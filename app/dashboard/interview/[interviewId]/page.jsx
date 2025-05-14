"use client";
import { MockInterview } from "@/utils/schema";
import React, { useState, useEffect, use } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // ✅ Import useParams() instead of props




function Interview() {
   
    const params = useParams(); // ✅ Get params from Next.js
    const interviewId = params?.interviewId || "";


    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebcamEnabled] = useState(false);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);


    useEffect(() => {
        if (!interviewId || typeof interviewId !== "string") {
            console.warn("Invalid interviewId:", interviewId);
            return;
        }
        console.log("Fetching interview for ID:", interviewId);
        GetInterviewData(interviewId);
    }, [interviewId]);
    

    const GetInterviewData = async (interviewId) => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
    
            if (result.length === 0) {
                console.warn("⚠️ No interview found for this ID.");
                return;
            }
    
            console.log("✅ Fetched Interview Details:", result[0]);
    
            let jsonMockResp;
            try {
                jsonMockResp = result[0]?.jsonMockResp ? JSON.parse(result[0].jsonMockResp) : null;
            } catch (error) {
                console.error("❌ Error parsing JSON:", error);
                return;
            }
    
            if (!jsonMockResp || Object.keys(jsonMockResp).length === 0) {
                console.error("❌ jsonMockResp is empty or invalid:", jsonMockResp);
                return;
            }
    
            if (!Array.isArray(jsonMockResp.interview_questions)) {
                console.error("❌ interview_questions is missing or not an array:", jsonMockResp);
                return;
            }
    
            console.log("✅ Valid interview questions found:", jsonMockResp.interview_questions);
            setMockInterviewQuestion(jsonMockResp.interview_questions);
            setInterviewData(result[0]);
    
        } catch (error) {
            console.error("❌ Error fetching interview:", error);
        }
    };
    
    

    return (
       
        <div className="my-10">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col my-5 gap-4 p-5 ">
                    <div className='flex flex-col p-5 rounded-lg border gap-4'>
                    {interviewData ? (
                        <>
                            <h2 className="text-lg">
                                <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
                            </h2>
                            <h2 className="text-lg">
                                <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
                            </h2>
                            <h2 className="text-lg">
                                <strong>Years of Experience:</strong> {interviewData.jobExperience}
                            </h2>
                        </>
                    ) : (
                        <p>Loading interview details...</p>
                    )}
                    </div>
                    <div className='p-5 rounded-lg border-yellow-300 bg-yellow'>
                        <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebcamEnabled(true)}
                            onUserMediaError={() => setWebcamEnabled(false)}
                            mirrored={true}
                            videoConstraints={{ facingMode: "user" }}
                            style={{ height: 350, width: "100%", zIndex: 10 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                            <Button variant="ghost" className='w-full' onClick={() => setWebcamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end'>
            <Link href={interviewId ? `/dashboard/interview/${interviewId}/start` : "#"} onClick={(e) => {
    if (!interviewId) e.preventDefault();
}}>
    <Button disabled={!interviewId}>Start Interview</Button>
</Link>

            </div>
        </div>
        
    );
}

export default Interview;
