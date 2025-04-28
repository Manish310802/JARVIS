"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import moment from "moment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Footer from "@/app/dashboard/_components/Footer";
import Header from "@/app/dashboard/_components/Header";
import SkeletonCard from "@/app/dashboard/_components/skeletoncard";

function getColorForPercentage(pct) {
  if (pct < 30) return "#ef4444";
  if (pct < 70) return "#f59e0b";
  return "#10b981";
}

function ProgressPage() {
  const { user } = useUser();
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const interviewResult = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      const userAnswerResult = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

      setInterviews(interviewResult);
      setUserAnswers(userAnswerResult);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (mockId) => {
    const answers = userAnswers.filter((ans) => ans.mockIdRef === mockId && ans.rating);
    if (answers.length === 0) return 0;
    const totalRating = answers.reduce((sum, ans) => sum + parseFloat(ans.rating || 0), 0);
    return (totalRating / 10).toFixed(1);
  };

  const calculateCompletionPercentage = (mockId) => {
    const totalQuestions =
      JSON.parse(interviews.find((interview) => interview.mockId === mockId)?.jsonMockResp || "{}")
        .interview_questions?.length || 0;
    const attemptedQuestions = userAnswers.filter(
      (ans) => ans.mockIdRef === mockId && ans.userAns?.length > 0
    ).length;
    if (totalQuestions === 0) return 0;
    return Math.round((attemptedQuestions / totalQuestions) * 100);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-8 min-h-screen">
        <h1 className="text-4xl font-bold text-center text-primary mb-10">
          🚀 Your Interview Progress
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <p className="text-center text-gray-500">No interview progress found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((interview) => (
              <Card key={interview.mockId} className="hover:shadow-lg transition duration-300">
                <CardHeader className="text-center">
                  <h2 className="text-xl text-primary font-bold">{interview.jobPosition}</h2>
                  <p className="text-sm text-muted-foreground">
                    {moment(interview.createdAt).format("DD MMM YYYY")}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-12">
                  {/* Circular Progressbars Row */}
                  <div className="flex gap-8 justify-center w-full">
                    {/* Attempt Percentage */}
                    <div className="w-24 h-24">
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">Attempt Rate</h3>
                      </div>
                      <CircularProgressbar
                        value={calculateCompletionPercentage(interview.mockId)}
                        text={`${calculateCompletionPercentage(interview.mockId)}%`}
                        styles={buildStyles({
                          textSize: "18px",
                          pathColor: getColorForPercentage(calculateCompletionPercentage(interview.mockId)),
                          textColor: getColorForPercentage(calculateCompletionPercentage(interview.mockId)),
                          trailColor: "#e5e7eb",
                        })}
                      />
                    </div>

                    {/* Average Rating */}
                    <div className="w-24 h-24">
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">Overall Rating</h3>
                      </div>
                      <CircularProgressbar
                        value={calculateAverageRating(interview.mockId) * 10}
                        text={`${calculateAverageRating(interview.mockId)}`}
                        styles={buildStyles({
                          textSize: "18px",
                          pathColor: getColorForPercentage(calculateAverageRating(interview.mockId) * 10),
                          textColor: getColorForPercentage(calculateAverageRating(interview.mockId) * 10),
                          trailColor: "#e5e7eb",
                        })}
                      />
                    </div>
                  </div>

                  {/* Tech Stack & Experience */}
                  <div className="flex gap-8 justify-center w-full">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Tech Stack</h3>
                      <p className="text-sm text-gray-500">{interview.jobDesc}</p>
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Experience Level</h3>
                      <p className="text-sm text-gray-700">{interview.jobExperience} years</p>
                    </div>
                  </div>

                  {/* Feedback Button */}
                  <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => router.push(`/dashboard/interview/${interview.mockId}/feedback`)}
                  >
                    View Feedback
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProgressPage;
