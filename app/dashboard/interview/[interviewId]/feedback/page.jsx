"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema'; 
import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

function Feedback() {
  const { interviewId } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!interviewId) return;
    GetFeedback();
  }, [interviewId]);

  const GetFeedback = async () => {
    try {
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);
      setFeedbackList(result);
    } catch (error) {
      console.error("❌ Error fetching feedback:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 sm:px-12 py-10">
      {feedbackList?.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-medium">
          No Interview Feedback Record Found
        </div>
      ) : (
        <>
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-600 mb-2">🎉 Congratulations!</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Here is your interview feedback</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Below are the interview questions with your answers, correct answers, and tips for improvement.
            </p>
          </header>

          <section className="space-y-6">
            {feedbackList.map((item, index) => (
              <Collapsible key={item.id} className="bg-white border rounded-2xl shadow-sm transition hover:shadow-md">
                <CollapsibleTrigger className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium bg-muted/30 rounded-t-2xl hover:bg-muted/50 transition-colors">
                  <span className="text-base md:text-lg text-gray-800">
                    <strong>Q{index + 1}:</strong> {item.question}
                  </span>
                  <ChevronsUpDown className="h-5 w-5 text-gray-600" />
                </CollapsibleTrigger>

                <CollapsibleContent className="px-6 py-5 bg-white rounded-b-2xl space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-red-600 font-semibold">
                      Rating: {item.rating}/5
                    </span>
                  </div>

                  <AnswerBlock label="Your Answer" content={item.userAns} color="red" />
                  <AnswerBlock label="Correct Answer" content={item.correctAns} color="green" />
                  <AnswerBlock label="Feedback" content={item.feedback} color="blue" />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </section>
        </>
      )}

      <div className="mt-12 text-center">
        <Button
          onClick={() => router.replace('/dashboard')}
          className="px-6 py-3 text-base font-medium rounded-xl"
        >
          ⬅ Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default Feedback;

// ✅ Reusable Answer Block Component
function AnswerBlock({ label, content, color }) {
  const colorClasses = {
    red: 'bg-red-50 text-red-900 border-red-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  return (
    <div
      className={clsx(
        "p-4 border rounded-lg text-sm whitespace-pre-line",
        colorClasses[color]
      )}
    >
      <strong className="block mb-1">{label}:</strong>
      {content}
    </div>
  );
}
