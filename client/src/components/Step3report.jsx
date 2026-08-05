import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaArrowLeft } from "react-icons/fa6";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./style.css";

function Step3report({ report }) {
  const navigate = useNavigate();
  console.log("Step3report received report:", report);
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report......</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidenceScore = 0,
    communicationScore = 0,
    correctnessScore = 0,
    questionWiseScore = [],
  } = report;
  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    {
      label: "confidence",
      value: confidenceScore,
    },
    { label: "communication", value: communicationScore },
    { label: "correctnes", value: correctnessScore },
  ];
  const score = finalScore;
  const percentage = (score / 10) * 100;
  let performancetext = "";
  let shortTagLine = "";
  let adviceList = [];

  if (finalScore >= 8) {
    performancetext = "Ready for Job Opportunities";
    shortTagLine = "Excellent clarity and structured responses";
    adviceList = [
      "Maintain your strong level of confidence and high articulation.",
      "Focus on providing concise, high-impact examples using the STAR method.",
      "Showcase technical leadership, system design depth, and project ownership."
    ];
  } else if (finalScore >= 5) {
    performancetext = "Need minor improvement before interviews";
    shortTagLine = "Good foundation, refine articulation";
    adviceList = [
      "Structure your technical answers systematically using Situation, Task, Action, Result (STAR).",
      "Elaborate more on core technical concepts and trade-offs in your answers.",
      "Reduce pauses and practice speaking with steady pace and confidence."
    ];
  } else {
    performancetext = "Significant improvement required";
    shortTagLine = "Work on clarity and confidence";
    adviceList = [
      "Revisit core domain fundamentals and practice answering essential interview questions.",
      "Re-record your spoken answers to improve vocal clarity, pacing, and presence.",
      "Outline key project achievements and technical details before your next interview."
    ];
  }

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 20;

    // Header Banner
    doc.setFillColor(34, 197, 94); // green-500
    doc.rect(0, 0, pageWidth, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("AI Interview Performance Report", pageWidth / 2, 15, { align: "center" });

    currentY = 32;

    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, currentY);
    if (report.role) doc.text(`Role: ${report.role}`, margin + 60, currentY);
    if (report.mode) doc.text(`Mode: ${report.mode}`, margin + 130, currentY);

    currentY += 8;

    // Overall Score Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(margin, currentY, contentWidth, 22, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(22, 101, 52);
    doc.text(`Overall Score: ${score} / 10`, pageWidth / 2, currentY + 9, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`${performancetext} — ${shortTagLine}`, pageWidth / 2, currentY + 16, { align: "center" });

    currentY += 30;

    // 1. Skills Evaluation Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text("1. Skills Breakdown", margin, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Evaluation Metric", "Score / 10"]],
      body: [
        ["Confidence", `${confidenceScore} / 10`],
        ["Communication", `${communicationScore} / 10`],
        ["Correctness", `${correctnessScore} / 10`],
      ],
      theme: "striped",
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 9.5, cellPadding: 3 },
      margin: { left: margin, right: margin },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // 2. Actionable Advice & Recommendations Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text("2. Key Recommendations & Actionable Advice", margin, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["#", "Actionable Recommendation"]],
      body: adviceList.map((item, idx) => [`${idx + 1}`, item]),
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: contentWidth - 12 },
      },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 3, overflow: "linebreak" },
      margin: { left: margin, right: margin },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // 3. Question-Wise Evaluation Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text("3. Question-Wise Evaluation & AI Feedback", margin, currentY);

    const questionRows = questionWiseScore.map((q, idx) => [
      `Q${idx + 1}`,
      q.question || "",
      `${q.score || 0}/10`,
      q.feedback || "No feedback available for this question",
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["#", "Question", "Score", "AI Feedback"]],
      body: questionRows,
      theme: "grid",
      headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 65 },
        2: { cellWidth: 18 },
        3: { cellWidth: contentWidth - (12 + 65 + 18) },
      },
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 3, overflow: "linebreak" },
      margin: { left: margin, right: margin },
    });

    // Save File
    const fileName = report.role ? `${report.role}_Interview_Report.pdf` : "Interview_Report.pdf";
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col md:flex-row md:px-10 py-3 md:py-1">
        <div className="w-[100vw] md:w-[80vw] max-w-full mt-5 bg-white  mx-auto py-3 px-3">
          <div className="flex items-center px-3 py-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex justify-center items-center bg-gray-200 w-10 h-10 rounded-full cursor-pointer "
              onClick={() => navigate("/history")}
            >
              <FaArrowLeft size={18} />
            </motion.button>
            <div>
              <h2 className="text-xl font-semibold leading-tight whitespace-nowrap">
                Interview Analytics Dashboard
              </h2>
              <p>AI powered performance insights</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center ">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
            className="bg-green-300 hover:bg-green-400 cursor-pointer px-4 py-2 w-full rounded-2xl mx-10 md:mx-4 whitespace-nowrap font-medium transition-colors"
          >
            Download PDF
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 md:gap-3 mt-3 md:px-10">
        <div className="col-span-1">
          <div className="bg-gray-100 md:w-[30vw] md:h-[40vh] flex items-center rounded-2xl justify-center hover:shadow-2xl transition-all  mx-auto py-3">
            <div className="flex flex-col justify-center items-center">
              <p>Overall performance</p>
              <div className='w-20 h-20 mt-3'>
                <CircularProgressbar
                  value={percentage}
                  text={`${score}/10`}
                  styles={buildStyles({
                    textSize: "22px",
                    pathColor: "#10b981",
                    textColor: "#10b981"
                  })}
                />
              </div>
              <div className="mt-3 text-green-500">{performancetext}</div>
              <div className="mt-2 text-green-500">{shortTagLine}</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-100 hover:shadow-2xl transition-all w-full md:w-[30vw] md:h-[35vh] md:mb-4 rounded-2xl mt-5 px-2 ">
            <h2 className="text-start font-semibold px-5 py-3">Skills evaluation</h2>
            <div>
              {skills.map((skill, index) => (
                <div>
                  <div className="flex items-center justify-between px-5">
                    <span>{skill.label}</span>
                    <span className="text-green-400">{skill.value}</span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-2xl mx-5 mt-2 mb-2">
                    <div className="bg-green-300 h-full rounded-full" style={{ width: `${skill.value * 10}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>


        {/* 2nd column */}
        <div className="col-span-2">
          <div className="bg-gray-100  md:w-[62vw] md:h-[40vh] rounded-2xl hover:shadow-2xl transition-all mt-3 md:mt-1">
            <p className="text-center py-2 text-lg font-semibold">Performance Trend</p>
            <div className="w-full h-[30vh] pr-9">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div id="QuestionWiseInfoDiv" className="bg-gray-100  md:w-[62vw] md:h-[40vh] overflow-auto rounded-2xl hover:shadow-2xl transition-all mt-3 md:mt-4 md:mb-4 py-4 px-3">
            <div className="flex flex-col justify-center gap-3 ">
              {questionWiseScore.map((q, i) => (
                <div key={i} className="bg-gray-100 border border-green-500 px-2 py-3 hover:shadow-2xl rounded-2xl">
                  <div className="flex flex-col md:flex-row justify-between  px-1">
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="text-lg font-semibold">Question {i + 1}</p>
                        <p className="py-3">{q.question}</p>
                      </div>
                      <div className="mt-2 ">
                        <div className="bg-green-100 px-2 py-1 rounded-2xl w-[45vw] md:mx-15 ">
                          <h4 className="text-center text-green-700 font-semibold">AI Feedback</h4>
                          <p className="text-center py-1">{q.feedback ? q.feedback : "No feedback available for this question"}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="whitespace-nowrap bg-green-200 px-2 py-1 rounded-2xl">{q.score}/10</span>
                    </div>
                  </div>


                </div>
              ))}
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}

export default Step3report;
