"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import WebCam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { initializeChatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema"; // ✅ Importing Drizzle ORM schema
import { MockInterview } from "@/utils/schema";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, onAnswerRecorded  }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map((r) => r.transcript).join(" "));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log("📝 User Answer:", userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
      User Answer: ${userAnswer}, 
      Provide a JSON response with "rating"(out of 10) and "feedback" fields.`;

    try {
      const chatSession = initializeChatSession(); // ✅ Initialize AI Chat Session
      if (!chatSession) throw new Error("AI Chat session initialization failed");

      const result = await chatSession.sendMessage(feedbackPrompt);
      let mockJsonResp = result.response.text();

      console.log("Raw AI Response:", mockJsonResp);

      // Clean the response by removing unwanted characters and ensuring proper JSON format
      mockJsonResp = mockJsonResp.replace(/```json|```/g, '').trim();

      try {
        // Attempt to parse the cleaned JSON
        const JsonFeedbackResp = JSON.parse(mockJsonResp);

        // ✅ Insert into database using Drizzle ORM
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        toast.success("✅ Answer Recorded Successfully!");
        setUserAnswer("");
        setResults([]);

        if (onAnswerRecorded) {
          onAnswerRecorded();  // ➡️ Increase attempted questions after success
        }
        
      } catch (jsonParseError) {
        console.error("❌ Invalid JSON format:", jsonParseError);
        toast.error("Failed to parse AI response. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error Updating Answer:", error);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image src={"/WebCam.png"} width={300} height={300} className="absolute" alt="WebCam" />
        <WebCam
          mirrored={true}
          style={{
            height: 350,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      {/* Record Button */}
    <Button
      disabled={loading}
      variant="outline"
      className="my-8 px-8 py-3 text-base font-semibold rounded-full shadow hover:shadow-md transition-all"
      onClick={StartStopRecording}
    >
      {isRecording ? (
        <span className="text-red-600 flex items-center gap-2">
          <Mic className="h-5 w-5" /> Stop Recording
        </span>
      ) : (
        <span className="flex items-center gap-2 text-cyan-600">
          <Mic className="h-5 w-5" /> Start Recording
        </span>
      )}
    </Button>
    </div>
  );
}

export default RecordAnswerSection;
