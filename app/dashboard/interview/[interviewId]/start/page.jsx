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
const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for each question
const [questionsAttempted, setQuestionsAttempted] = useState(0);




useEffect(() => {
    if (!interviewId || typeof interviewId !== "string") {
        console.warn("Invalid interviewId:", interviewId);
        return;
    }
    console.log("Fetching interview for ID:", interviewId);
    GetInterviewData(interviewId);
}, [interviewId]);

useEffect(() => {
    setTimeLeft(60); // Reset timer on new question
  }, [activeQuestionIndex]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
        setActiveQuestionIndex((prev) => prev + 1); // Move to next question
      }
    }
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [timeLeft]);
  

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
    <div className="p-5">
      
      {/* Timer Section */}
<div className="flex items-center justify-center my-4">
  <div className={`relative px-5 py-2 rounded-full shadow-md border ${timeLeft <= 10 ? "border-red-500 bg-red-50 animate-pulse" : "border-cyan-400 bg-cyan-50"}`}>
    
    <h2 className={`text-sm md:text-base font-semibold tracking-widest ${timeLeft <= 10 ? "text-red-600" : "text-cyan-600"}`}>
      ⏳ {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
    </h2>
    
    <div className={`absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full font-bold shadow ${timeLeft <= 10 ? "bg-red-500 text-white" : "bg-cyan-500 text-white"}`}>
      Timer
    </div>

  </div>
</div>


      


      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          onAnswerRecorded={() => setQuestionsAttempted(prev => prev + 1)} // 🆕
          questionsAttempted={questionsAttempted} // 🆕 optional if needed
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-6 mt-10">
        {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion?.length - 1 && interviewData?.mockId && (
  <Button
  disabled={questionsAttempted < 0} // Minimum 2 questions must be attempted
  onClick={() => {
    if (questionsAttempted < 2) {
      alert(`Please attempt at least 2 questions before ending the interview.`);
      return;
    }
  }}
>
  {/* Use Link to wrap the Button when conditions are met */}
  {questionsAttempted >= 2 ? (
    <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
      End Interview
    </Link>
  ) : (
    "End Interview"
  )}
</Button>
)}

      </div>

    </div>
  );
  
}

export default StartInterview