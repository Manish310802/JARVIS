"use client";
import React, { use, useEffect, useState } from 'react'
import { useParams } from "next/navigation"; // ✅ Import useParams() instead of props
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import RecordAnswerSection from './_components/RecordAnswerSection';
import QuestionsSection from './_components/QuestionsSection';
import { Button } from '@/components/ui/button';
import Link from "next/link";



function StartInterview() {
const params = useParams(); // ✅ Get params from Next.js
const interviewId = params?.interviewId || "";


const [interviewData, setInterviewData] = useState();
const [mockInterviewQuestion,setMockInterviewQuestion] = useState([]);
const [activeQuestionIndex,setActiveQuestionIndex] = useState(0);

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
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions */}
            <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />
            {/* Video/ Audio Recording */}
            <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            />

        </div>
        <div className='flex justify-end gap-6'>
           {activeQuestionIndex>0&& <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
           {activeQuestionIndex!=mockInterviewQuestion?.length-1&& <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
           {activeQuestionIndex === mockInterviewQuestion?.length - 1 && interviewData?.mockId && (
  <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
    <Button>End Interview</Button>
  </Link>
)}

        </div>
    </div>
  )
}

export default StartInterview