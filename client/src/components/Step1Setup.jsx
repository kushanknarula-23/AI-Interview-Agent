import React, { useContext, useState } from "react";
import "./style.css"
import { motion } from "motion/react";
import {
    FaChartLine,
    FaUserTie,
    FaMicrophone,
    FaBriefcase,
    FaFile,
} from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axios.js";
import { setUserData } from "../redux/userSlice.js";

function Step1Setup({ onstart }) {
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)
    const [role, setrole] = useState("");
    const [experience, setexperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState([]);
    const [skill, setskill] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzingdone, setAnalyzingDone] = useState(false);
    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) {
            return;
        }
        setAnalyzing(true);
        // to send the file to backend
        const formData = new FormData();
        formData.append("resume", resumeFile);
        try {
            const response = await axiosInstance.post(
                "/api/interview/resume",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const data = response.data;
            console.log(data);
            setrole(data.role);
            setexperience(data.experience);
            setProject(data.project);
            setskill(data.skill);
            setResumeText(data.newtext);
            setAnalyzingDone(true); //
            setAnalyzing(false); //  reset so button doesn't stay stuck
        } catch (error) {
            console.log(error);
            setAnalyzing(false); //   reset on error
        }
    };

    const handleStart = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post("/api/interview/generate-question", { role, experience, mode, resumeText, project, skill })
            console.log(response.data)
            if (userData) {

                dispatch(setUserData({ ...userData, token: response.data.token }))
            }
            setLoading(false)
            onstart(response.data)
        }
        catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-5 md:px-15 py-3">
            <div className="rounded-xl overflow-hidden">
                <div className="w-full grid md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="w-[1/2] flex flex-col bg-green-100 py-6 px-3 rounded-sm"
                    >
                        <h1 className="mb-1 text-xl md:text-2xl uppercase font-bold px-7">
                            Start your ai interview
                        </h1>
                        <p className="px-7 text-md md:text-l">
                            Practice real interview scenario powered by AI improve your
                            techincal skills ,communication skills and confidence
                        </p>
                        <div className="px-4 flex flex-col gap-2 py-4">
                            {[
                                {
                                    icon: <FaUserTie className="text-green-600 text-xl" />,
                                    text: "Choose Role & experience ",
                                },
                                {
                                    icon: <FaMicrophone className="text-green-600 text-xl" />,
                                    text: "Smart voice interview",
                                },
                                {
                                    icon: <FaChartLine className="text-green-600 text-xl" />,
                                    text: "Perfomance Analytics",
                                },
                            ].map((item, index) => {
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 + index * 0.15 }}
                                        whileHover={{ scale: 1.05 }}

                                        className="flex items-center gap-2 bg-white border border-gray-400 px-3 py-2 rounded-xl"
                                    >
                                        {item.icon}
                                        <span className="px-3 text-center whitespace-nowrap">
                                            {item.text}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="w-[1/2] flex flex-col bg-gray-200 py-6 px-3 rounded-sm"
                    >
                        <h1 className="mb-1 text-xl md:text-2xl uppercase font-bold px-7">
                            Interview Setup
                        </h1>
                        <div className="bg-white relative outline-none px-2 py-2 mt-4 mx-4 hover:ring hover:ring-green-700 rounded-xl">
                            <FaUserTie className="absolute top-3 left-[-5] text-center" />
                            <input
                                onChange={(e) => {
                                    setrole(e.target.value);
                                }}
                                value={role}
                                className="px-8 outline-none"
                                placeholder="Enter your Role"
                                maxLength={30}
                            ></input>
                        </div>

                        <div className="bg-white relative outline-none px-2 py-2 mt-4 mx-4 hover:ring hover:ring-green-700 rounded-xl">
                            <FaBriefcase className="absolute top-3 left-[-5] text-center" />
                            <input
                                onChange={(e) => {
                                    setexperience(e.target.value);
                                }}
                                value={experience}
                                className="px-8 outline-none w-full text-sm"
                                placeholder="Enter your Experience"
                                maxLength={30}
                            ></input>
                        </div>
                        <select
                            value={mode}
                            onChange={(e) => {
                                setMode(e.target.value);
                            }}
                            className="mt-4 mx-4 py-2 px-3 bg-white outline-none rounded-xl hover:ring hover:ring-green-700"
                        >
                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>
                        </select>

                        {!analyzingdone && (
                            <motion.div
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className="border-2 border-dashed hover:border-green-400 hover:bg-white rounded-xl text-center mt-4 mx-5 py-3 cursor-pointer"
                            >
                                <FaFile className="mx-auto text-3xl text-green-300" />
                                <input
                                    onChange={(e) => setResume(e.target.files[0])}
                                    type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className="hidden"
                                    maxLength={30}
                                ></input>
                                <p>
                                    {resumeFile
                                        ? resumeFile.name
                                        : "Click here to upload the Resume"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume();
                                        }}
                                        whileHover={{ scale: 1.03 }}
                                        className="rounded-xl mt-4 px-2 py-1 border hover:border-green-300 bg-white mx-auto"
                                    >
                                        {analyzing ? " analyzing........ " : "Analyze Resume"}
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        <div className="w-full  flex gap-8 mt-5 mx-6">
                            {project.length > 0 && (
                                <div className="w-[1/2] flex-col items-center">
                                    <p className="text-l py-2 font-bold">Projects</p>
                                    <ul>
                                        {project.map((item, index) => {
                                            return <li key={index}>{item}</li>;
                                        })}
                                    </ul>
                                </div>
                            )}

                            {skill.length > 0 && <div className="w-1/2  px-2 py-2">
                                <p className="font-semibold mb-2 px-2 text-l ">Skills</p>

                                <div id="div1" className="h-32 overflow-y-auto px-2">
                                    <ul >
                                        {skill.map((item, index) => (
                                            <li key={index} className="text-sm">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>}
                        </div>
                        {analyzingdone && (
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.03 }}
                                className="mx-auto px-3 py-1 mt-2  border hover:border-green-400 rounded-xl hover:bg-white"
                            >
                                {loading ? "starting......" : "start interview"}
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Step1Setup;
