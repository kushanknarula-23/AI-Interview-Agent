import interviewModel from "../models/interview.mode.js";
import userModel from "../models/user.model.js";
import { askai } from "../services/openrouter.services.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzeresume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("resume not found", 409);
    }

    const filepath = req.file.path;
    // check that file exist before reading
    if (!fs.existsSync(filepath)) {
        throw new AppError("Uploaded file not found on disk", 500);
    }

    // Convert file to buffer then Uint8Array for pdfjs
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let newtext = "";
    for (let pagenum = 1; pagenum <= pdf.numPages; pagenum++) {
        const pageNo = await pdf.getPage(pagenum);
        const content = await pageNo.getTextContent();
        const textContent = content.items.map((item) => item.str).join(" ");
        newtext += textContent + "\n";
    }

    newtext = newtext.replace(/\s+/g, " ").trim();


    const messages = [
        {
            role: "system",
            content: `Extract the structured data from resume return strictly JSON and detect which type of interview it is technical or other type and add this into mode field{
             "role":"string"
             "experience":"string",
             "project":["project1","project2"],
             "skills":["skills1","skills2"]
             "mode":"string"
            }`,
        },
        {
            role: "user",
            content: newtext,
        },
    ];

    const aiResponse = await askai("openai/gpt-4o-mini", messages);

    let parse;
    try {
        // Strip markdown fences first
        let cleaned = aiResponse
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        // If model added text before/after JSON, extract the first { } block
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
        if (jsonMatch) cleaned = jsonMatch[0]

        parse = JSON.parse(cleaned);
    } catch (e) {
        throw new AppError("AI returned invalid JSON: " + aiResponse.slice(0, 150), 500);
    } finally {
        // Always clean up temp file whether parsing succeeded or failed
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    res.json({
        role: parse.role,
        experience: parse.experience,
        project: parse.project,
        skill: parse.skills,
        newtext,
        mode: parse.mode,
    });
});


export const generateQuestion = asyncHandler(async (req, res) => {
    let { role, experience, mode, resumeText, project, skill } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
        throw new AppError("Please enter the required field correctly", 401);
    }

    const findUser = await userModel.findById(req.user.id);

    if (!findUser) {
        throw new AppError("unable to find the user", 409);
    }

    if (findUser.token < 50) {
        throw new AppError("Not enough token,Minimum 50 token required");
    }

    const projectText =
        Array.isArray(project) && project.length ? project.join(", ") : "None";
    const skillText =
        Array.isArray(skill) && skill.length ? skill.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userContent = `
    experience:${experience}
    mode:${mode}
    role:${role}
    project:${projectText}
    skills:${skillText}
    resume:${safeResume}
    `;

    if (!userContent.trim()) {
        return res.status(400).json({
            message: "Prompt content is empty",
        });
    }

    const message = [
        {
            role: "system",
            content: `
                You are a real human interviewer conducting a professional interview.

                Speak in simple, natural English as if you are directly talking to the candidate.

                Generate exactly 7 interview questions.

                Strict Rules:
                - Each question must contain between 15 and 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number them.
                - Do NOT add explanations.
                - Do NOT add extra text before or after.
                - One question per line only.
                - Keep language simple and conversational.
                - Questions must feel practical and realistic.

                Difficulty progression:
                Question 0 → easy  
                Question 1 → easy  
                Question 2 → medium  
                Question 3 → hard 
                Question 4 → medium  
                Question 5 → hard 
                Question 6 → hard 
                 


                Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
                `,
        },
        {
            role: "user",
            content: userContent,
        },
    ];

    const aiResponse = await askai("gpt-4o-mini", message);
    if (!aiResponse) {
        throw new AppError("Empty AiResponse", 500);
    }

    const questionArray = aiResponse
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
        .slice(0, 7);

    if (questionArray.length === 0) {
        throw new AppError("questionArray is empty", 500);
    }

    findUser.token -= 50;
    await findUser.save();

    const Createinterview = await interviewModel.create({
        userId: findUser._id,
        role,
        experience,
        mode,
        resumetext: resumeText,   // schema field is lowercase 'resumetext'
        question: questionArray.map((item, index) => ({
            question: item,
            difficulty: ["easy", "easy", "medium", "hard", "medium", "hard", "hard"][index],
            timelimit: [60, 60, 70, 70, 90, 90][index],
        })),
    });

    res.status(201).json({
        interviewId: Createinterview._id,
        question: Createinterview.question,   // use document, not model class
        name: findUser.name,
        token: findUser.token,
    });
});

export const Submitanswer = asyncHandler(async (req, res) => {
    let { interviewid, questionIndex, answer, timetaken } = req.body;
    if (!answer) {
        throw new AppError("No answer recieved from the user", 409);
    }
    const findInterview = await interviewModel.findById(interviewid);
    const question = await findInterview.question[questionIndex];

    question.score = 0;
    question.feedback = "You did not submit the answer",
        question.answer = "";

    await findInterview.save();

    res.status(200).json({
        feedback: question.feedback,
    });

    // but if time limit exceeds

    if (!timetaken > question.timelimit) {
        ((question.score = 0),
            (question.feedback =
                "You did not submit the answer in the give time limit"),
            (question.answer = answer));
        throw new AppError("Time limit exceeds", 409);
    }

    await findInterview.save();

    res.status(408).json({
        feedback: question.feedback,
    });

    const message = [
        {
            role: "system",
            content: `
                You are a professional human interviewer evaluating a candidate's answer in a real interview.

                Evaluate naturally and fairly, like a real person would.

                Score the answer in these areas (0 to 10):

                1. Confidence – Does the answer sound clear, confident, and well-presented?
                2. Communication – Is the language simple, clear, and easy to understand?
                3. Correctness – Is the answer accurate, relevant, and complete?

                Rules:
                - Be realistic and unbiased.
                - Do not give random high scores.
                - If the answer is weak, score low.
                - If the answer is strong and detailed, score high.
                - Consider clarity, structure, and relevance.

                Calculate:
                finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                Feedback Rules:
                - Write natural human feedback.
                - 10 to 15 words only.
                - Sound like real interview feedback.
                - Can suggest improvement if needed.
                - Do NOT repeat the question.
                - Do NOT explain scoring.
                - Keep tone professional and honest.

                Return ONLY valid JSON in this format:

                {
                "confidence": number,
                "communication": number,
                "correctness": number,
                "finalScore": number,
                "feedback": "short human feedback"
                }
                `,
        },
        {
            role: "user",
            content: `
            Question: ${question.question}
            Answer: ${answer}
        `,
        },
    ];

    const aiResponse = await askai("gpt-4o-mini", message);
    const ParseAiresponse = JSON.parse(aiResponse)
    question.answer = answer,
        question.confidence = ParseAiresponse.confidence,
        question.correctness = ParseAiresponse.correctness,
        question.communication = ParseAiresponse.communication,
        question.score = ParseAiresponse.finalScore
    question.feedback = ParseAiresponse.feedback

    await findInterview.save()
    res.status(200).json({
        feedback: ParseAiresponse.feedback
    })
});

export const FinishInterview = asyncHandler(async (req, res) => {
    const { interviewId } = req.body;
    const findInterview = await interviewModel.findById(interviewId);
    if (!findInterview) {
        throw new AppError("No interview found", 401);
    }

    const totalQuestion = findInterview.question.length;
    let totalScore = 0;
    let totalCommunication = 0;
    let totalconfidence = 0;
    let totalcorrectness = 0;

    findInterview.question.forEach((q) => {
        totalScore += q.score || 0;
        totalCommunication += q.communication || 0;
        totalconfidence += q.confidence || 0;
        totalcorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestion ? totalScore / totalQuestion : 0;
    const avgcommunication = totalQuestion ? totalCommunication / totalQuestion : 0;
    const avgconfidence = totalQuestion ? totalconfidence / totalQuestion : 0;
    const avgcorrectness = totalQuestion ? totalcorrectness / totalQuestion : 0;

    findInterview.finalScore = finalScore;
    findInterview.status = "completed";
    await findInterview.save();

    return res.status(200).json({
        finalScore: Number(finalScore.toFixed(1)),
        communicationScore: Number(avgcommunication.toFixed(1)),
        correctnessScore: Number(avgcorrectness.toFixed(1)),
        confidenceScore: Number(avgconfidence.toFixed(1)),
        questionWiseScore: findInterview.question.map((q) => ({
            question: q.question || "",
            score: q.score || 0,
            correctness: q.correctness || 0,
            communication: q.communication || 0,
            feedback: q.feedback || "",
            confidence: q.confidence || 0
        }))
    });
});


export const getInterview = asyncHandler(async(req,res)=>{
    const interview = await interviewModel.find({userId:req.user._id})
    .sort({createdAt:-1})
    .select("role experience mode finalScore status createdAt")
    return res.status(200).json({
        interview
    })
})

export const getInterviewReport = asyncHandler(async (req, res) => {
    const interview = await interviewModel.findById(req.params.id);
    if (!interview) {
        throw new AppError("Unable to find the interview", 404);
    }
    const questions = interview.question || [];
    const totalQuestion = questions.length;

    let totalCommunication = 0;
    let totalconfidence = 0;
    let totalcorrectness = 0;

    questions.forEach((q) => {
        totalCommunication += q.communication || 0;
        totalconfidence += q.confidence || 0;
        totalcorrectness += q.correctness || 0;
    });

    const avgcommunication = totalQuestion ? totalCommunication / totalQuestion : 0;
    const avgconfidence = totalQuestion ? totalconfidence / totalQuestion : 0;
    const avgcorrectness = totalQuestion ? totalcorrectness / totalQuestion : 0;

    return res.status(200).json({
        finalScore: interview.finalScore || 0,
        role: interview.role,
        mode: interview.mode,
        experience: interview.experience,
        communicationScore: Number(avgcommunication.toFixed(1)),
        correctnessScore: Number(avgcorrectness.toFixed(1)),
        confidenceScore: Number(avgconfidence.toFixed(1)),
        questionWiseScore: questions,
    });
});