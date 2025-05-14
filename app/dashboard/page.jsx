"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks } from 'lucide-react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';




export default function Dashboard() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const interviewResult = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress));

      const userAnswerResult = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

      setInterviews(interviewResult);
      setUserAnswers(userAnswerResult);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (interviews.length === 0) return 0;
  
    const { totalRating, attemptedCount } = userAnswers.reduce(
      (acc, ans) => {
        if (ans.userAns?.length > 0) {
          acc.totalRating += parseFloat(ans.rating || 0);
          acc.attemptedCount += 1;
        }
        return acc;
      },
      { totalRating: 0, attemptedCount: 0 }
    );
  
    const totalPossible = interviews.length * 100;
  
    return (totalRating / totalPossible).toFixed(2);
  };
  
  const calculateCompletionRate = () => {
    if (interviews.length === 0) return 0;
  
    const attemptedQuestions = userAnswers.reduce(
      (count, ans) => (ans.userAns?.length > 0 ? count + 1 : count),
      0
    );
  
    const totalQuestionsPossible = interviews.length * 10;
  
    return Math.round((attemptedQuestions / totalQuestionsPossible) * 100);
  };
  

  return (
    
    <div className="min-h-screen pt-11 ">
<div className="mt-100  bg-gray-50 ">
<div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-8">Create and manage your AI-powered mock interviews</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">New Interview</h2>
              <PlusCircle className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <AddNewInterview />
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Previous Mock Interviews</h2>
              <ListChecks className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <InterviewList />
            </CardContent>
          </Card>
        </div>

       {/* Statistic Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent>
              <p className="text-sm uppercase">Total Interviews</p>
              <p className="text-3xl font-bold">{loading ? "..." : interviews.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardContent>
              <p className="text-sm uppercase">Average Rating</p>
              <p className="text-3xl font-bold">{loading ? "..." : `${calculateAverageRating()}/10`}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent>
              <p className="text-sm uppercase">Completion Rate</p>
              <p className="text-3xl font-bold">{loading ? "..." : `${calculateCompletionRate()}%`}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
    
  );
}
