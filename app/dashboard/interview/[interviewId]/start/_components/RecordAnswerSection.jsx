// ✅ Logging added throughout the flow like a pro debugger assistant

"use client";

import React, { useEffect, useRef, useState } from "react";
import WebCam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
import { initializeChatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import * as faceapi from "face-api.js";

// 🧠 Utility function to load models
export async function loadFaceModels() {
  console.log("📦 Loading face-api models...");
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ]);
  console.log("✅ Face-api models loaded");
}

// 😶‍🌫️ Emotion summarizer
function summarizeExpressions(data) {
  const totalFrames = data.length;
  if (totalFrames === 0) return "No clear facial data found";

  const emotionCounts = {
    happy: 0,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
    neutral: 0,
  };

  data.forEach((frame, index) => {
    const sorted = Object.entries(frame).sort((a, b) => b[1] - a[1]);
    const topEmotion = sorted[0][0];
    emotionCounts[topEmotion]++;
    console.log(`🎭 Frame ${index + 1}: Dominant Emotion - ${topEmotion}`);
  });

  for (let emotion in emotionCounts) {
    emotionCounts[emotion] = Math.round((emotionCounts[emotion] / totalFrames) * 100);
  }

  console.log("📊 Emotion Percentages:", emotionCounts);
  return `Facial Emotion Summary: ${JSON.stringify(emotionCounts)}`;
}

// 📽️ Analyze the video blob
export async function analyzeVideoBlob(blob) {
  return new Promise(async (resolve) => {
    console.log("📼 Starting video analysis...");
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.crossOrigin = "anonymous";
    video.muted = true;
    await video.play();
    console.log("▶️ Video is playing...");

    const expressionsData = [];
    const canvas = document.createElement("canvas");

    const interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        console.log(`🧠 Detected ${detections.length} face(s)`);
        detections.forEach((det, i) => {
          console.log(`📷 Face #${i + 1} expressions:`, det.expressions);
          expressionsData.push(det.expressions);
        });
      }
    }, 500);

    video.onended = () => {
      clearInterval(interval);
      console.log("🛑 Video ended, finalizing analysis...");
      resolve(summarizeExpressions(expressionsData));
    };
  });
}

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onAnswerRecorded,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);

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
      console.log("📝 Transcription Results Updated:", results);
      setUserAnswer(results.map((r) => r.transcript).join(" "));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 1) {
      console.log("🧾 Final Transcript Ready:", userAnswer);
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  // 🎥 Start capturing video + speech
  const StartStopRecording = async () => {
    if (isRecording) {
      console.log("🛑 Stopping Recording...");
      stopSpeechToText();
      mediaRecorderRef.current?.stop();
    } else {
      console.log("🎬 Starting Recording...");
      await loadFaceModels();
      startSpeechToText();
      console.log("🎙️ Speech-to-text started");

      const stream = webcamRef.current?.stream;
      if (stream) {
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        chunks.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            console.log("📥 Received video data chunk");
            chunks.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks.current, { type: "video/webm" });
          console.log("📦 Final video blob ready:", blob);
          setVideoBlob(blob);
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        console.log("🎥 Video recording started");
      }
    }
  };

  // 🤖 Save + analyze + get AI feedback
  const UpdateUserAnswer = async () => {
    setLoading(true);
    console.log("📨 Sending data to AI for feedback...");

    let videoFeedback = "";
      if (videoBlob) {
        videoFeedback = await analyzeVideoBlob(videoBlob);
        console.log("📹 Video Feedback:", videoFeedback);
      }

    const feedbackPrompt = `You're an AI mock interview evaluator.

Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}

User's Spoken Answer: ${userAnswer}

User's Facial Expression Summary During Answer: ${videoFeedback}

Based on the content of the spoken answer and the emotional tone captured from facial expressions, give a professional evaluation.

Respond in strict JSON format with two fields:
- "rating" (out of 10)
- "feedback" (detailed insights, tips, and improvements considering both verbal content and emotional delivery).`;

    try {
      const chatSession = initializeChatSession();
      if (!chatSession) throw new Error("AI Chat session failed");

      const result = await chatSession.sendMessage(feedbackPrompt);
      let rawText = await result.response.text();
      console.log("📩 Gemini Raw Response:", rawText);

      rawText = rawText.replace(/```json|```/g, "").trim();
      const aiFeedback = JSON.parse(rawText);
      console.log("✅ Parsed AI Feedback:", aiFeedback);

      
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: aiFeedback.feedback,
        rating: aiFeedback.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      toast.success("✅ Answer + Facial Feedback Saved!");
      console.log("📦 Answer saved in DB");
      setUserAnswer("");
      setResults([]);
      setVideoBlob(null);

      onAnswerRecorded?.();
    } catch (e) {
      console.error("❌ Error saving answer:", e);
      toast.error("Failed to process the answer!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <WebCam
          ref={webcamRef}
          audio={{
         echoCancellation: true,
         noiseSuppression: true,
        }}
         muted={true} 
          mirrored={true}
          videoConstraints={{ facingMode: "user" }}
          style={{ height: 350, width: "100%", zIndex: 10 }}
        />
      </div>

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
          <span className="text-cyan-600 flex items-center gap-2">
            <Mic className="h-5 w-5" /> Start Recording
          </span>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
