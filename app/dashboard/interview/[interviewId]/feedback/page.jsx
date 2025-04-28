"use client";
import { useState, useEffect, useRef } from 'react';
import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin for tables in PDF
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import clsx from "clsx";
import html2canvas from 'html2canvas';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js'; // 👈 Add this import



// Helper function to pick red/amber/green color
const getColorForPercentage = (pct) => {
  if (pct < 30) return "#ef4444";   // red-500
  if (pct < 70) return "#f59e0b";   // amber-500
  return "#10b981";                 // green-500
};




function Feedback() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [mergedList, setMergedList] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state
  const feedbackRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [openAll, setOpenAll] = useState(false); // control expand state for all collapsibles




  useEffect(() => {
    if (interviewId) fetchFeedbackData();
  }, [interviewId]);

  const fetchFeedbackData = async () => {
    setLoading(true);  // Set loading to true when data is being fetched

    // 1) Fetch attempted answers from UserAnswer table
    const userAnswers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    // 2) Fetch interview questions and correct answers from MockInterview table
    const interview = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    const originalQuestions =
      JSON.parse(interview[0]?.jsonMockResp)?.interview_questions || [];

    // 3) Fetch user details
    const user = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .limit(1); // Assuming user info can be fetched from the UserAnswer table

    // 4) Compute summary metrics
    const total = originalQuestions.length;
    const attempted = userAnswers.filter((a) => a.userAns?.length > 0).length;
    const avgRating =
      userAnswers.length > 0
        ? (
            userAnswers.reduce((sum, a) => sum + parseFloat(a.rating || "0"), 0) /
            10
          ).toFixed(1)
        : 0;

    setTotalQuestions(total);
    setAttemptedQuestions(attempted);
    setAverageRating(avgRating);

    // Set user details (adjust field names as necessary)
    setUserDetails({
      jobDesc: interview[0]?.jobDesc || "N/A",
      jobTitle: interview[0]?.jobPosition || "N/A",
      experience: interview[0]?.jobExperience || "N/A",
      mockId: interviewId,
      createdBy: interview[0]?.createdBy || "N/A",
    });

    // 5) Merge questions with user answers and correct answers from jsonMockResp
    const merged = originalQuestions.map((q, idx) => {
      const attempt = userAnswers.find((a) => a.question === q.question);
      return {
        ...q,
        id: idx + 1,
        userAns: attempt?.userAns || null,
        feedback: attempt?.feedback || null,
        rating: attempt?.rating || null,
        correctAns: q.answer,  // Corrected: Using "answer" from the JSON response instead of a separate column
        isAttempted: !!attempt,
      };
    });
    setMergedList(merged);

    setLoading(false);  // Set loading to false once data is fetched
  };

  const attemptPerc =
    totalQuestions > 0 ? Math.round((attemptedQuestions / totalQuestions) * 100) : 0;

   
    const downloadReport = async () => {
      setIsGenerating(true);
      setOpenAll(true); // Expand all sections
    
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for React rerender
    
      const element = feedbackRef.current;
    
      // Hide buttons before generating
      const buttonsToHide = element.querySelectorAll('.hide-in-pdf');
      buttonsToHide.forEach(button => {
        button.style.display = 'none';
        button.style.visibility = 'hidden';
      });
    
      const opt = {
        margin:       0.2, // inches
        filename:     'Feedback_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }, // 👈 handle page breaks properly
      };
    
      html2pdf().from(element).set(opt).save().then(() => {
        toast.success("PDF Downloaded Successfully!", { position: "bottom-right" });
        setIsGenerating(false);
        setOpenAll(false);
      }).catch(err => {
        console.error('PDF generation error:', err);
        toast.error("Failed to generate PDF", { position: "bottom-right" });
        setIsGenerating(false);
        setOpenAll(false);
      }).finally(() => {
        // Restore buttons after PDF generation
        buttonsToHide.forEach(button => {
          button.style.display = '';
          button.style.visibility = '';

          
        });
      });
    };
    
       
{isGenerating && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div className="loader"></div>
      <p style={{ marginTop: '20px', fontSize: '18px' }}>Generating PDF...</p>
    </div>
  </div>
)}

 

  return (

    
    <div className="max-w-screen-xl mx-auto px-6 sm:px-12 py-10">
      <ToastContainer />
      {loading ? (
          <div className="space-y-4">
            <Skeleton height={30} />
            <Skeleton height={20} count={4} />
            <div className="flex space-x-2">
              <Skeleton circle width={40} height={40} />
              <Skeleton circle width={40} height={40} />
            </div>
          </div>
        )  : mergedList.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-medium">
          No Interview Feedback Record Found
        </div>
      ) : (
        <>

          {/* Page Header */}

          <div ref={feedbackRef} className="space-y-8  p-6 rounded-lg ">

          <div className="report-header mb-10 p-6 border rounded-xl shadow-md bg-gray-50">
  <h1 className="text-3xl font-bold text-center text-primary mb-6 tracking-wide">
    Interview Feedback Report
  </h1>
  <div className="grid grid-cols-2 gap-4 text-base text-gray-800">
    <div className="flex flex-col">
      <span className="font-semibold">Candidate ID:</span>
      <span>{userDetails.createdBy}</span>
    </div>
    <div className="flex flex-col">
      <span className="font-semibold">Mock ID:</span>
      <span>{userDetails.mockId}</span>
    </div>
    <div className="flex flex-col">
      <span className="font-semibold">Position:</span>
      <span>{userDetails.jobTitle}</span>
    </div>
    <div className="flex flex-col">
      <span className="font-semibold">Years of Experience:</span>
      <span>{userDetails.experience}</span>
    </div>
  </div>
</div>

<div className="report-header mb-10 p-6 border rounded-xl shadow-md bg-gray-50">


          <header className="text-center mb-8 space-y-2">
            <h1 className="text-4xl font-bold text-green-600">🎉 Congratulations!</h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              Here is your Full Interview Analysis
            </h2>
            <p className="text-gray-500 text-sm">
              Below are all questions in sequence, with your performance metrics and correct answers.
            </p>
          </header>

          {/* Buttons Row at the top */}
          <div className="flex justify-center gap-6 mb-12">
            <Button
              onClick={() => router.replace("/dashboard")}
              className="px-6 py-3 text-base font-medium rounded-xl hide-in-pdf"
            >
              ⬅ Go to Dashboard
            </Button>
            <Button
              onClick={downloadReport}
              className="px-6 py-3 text-base font-medium rounded-xl bg-blue-600 text-white hide-in-pdf"
            >
              📄 Download Report
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
            {/* Attempt % */}
            <div className="w-40 p-4 bg-white rounded-2xl shadow flex flex-col items-center">
              <div className="w-20 h-20 mb-2">
                <CircularProgressbar
                  value={attemptPerc}
                  text={`${attemptPerc}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: getColorForPercentage(attemptPerc),
                    textColor: getColorForPercentage(attemptPerc),
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
              <span className="mt-2 text-sm font-semibold">Attempt %</span>
            </div>
            {/* Avg Rating */}
            <div className="w-40 p-4 bg-white rounded-2xl shadow flex flex-col items-center">
              <div className="w-20 h-20 mb-2">
                <CircularProgressbar
                  value={averageRating * 10}
                  text={`${averageRating}`}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: getColorForPercentage(averageRating * 10),
                    textColor: getColorForPercentage(averageRating * 10),
                    trailColor: "#fef3c7",
                  })}
                />
              </div>
              <span className="mt-2 text-sm font-semibold">Overall Rating</span>
            </div>
          </div>

          {/* Question-by-Question Feedback */}
          <section className="space-y-6">
          {mergedList.map((item, index) => (
  <Collapsible
  key={index}
  open={openAll ? true : undefined}  // 👈 force open when needed
  className={` border rounded-2xl shadow-md transition hover:shadow-lg p-4 my-4  
    ${item.isAttempted ? 'bg-white border-l-4 border-green-400' : 'bg-white border-l-4 border-red-400'}
  `}
>
    <CollapsibleTrigger className="w-full text-left font-semibold text-lg flex justify-between items-center">
      {`Q${index + 1}: ${item.question}`}
      <ChevronsUpDown className="ml-2 h-5 w-5" />
    </CollapsibleTrigger>

    <CollapsibleContent className="mt-4 space-y-4">
      {item.isAttempted ? (
        <>
          {/* Rating Section */}
          <div className="flex flex-col items-center space-y-2">
            <span className="font-bold text-gray-700">Rating:</span>
            <div className="w-24 h-24">
              <CircularProgressbar
                value={item.rating ? parseFloat(item.rating) * 10 : 0}
                text={`${item.rating || 0}`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: getColorForPercentage(item.rating * 10),
                  textColor: getColorForPercentage(item.rating * 10),
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>

          {/* Your Answer */}
          <div className="p-4 rounded-xl border-2 border-red-500 bg-red-100 text-red-700">
            <strong>Your Answer:</strong> {item.userAns || "No Answer Given"}
          </div>

          {/* Correct Answer */}
          <div className="p-4 rounded-xl border-2 border-green-500 bg-green-100 text-green-700">
            <strong>Correct Answer:</strong> {item.correctAns}
          </div>

          {/* Feedback */}
          <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-100 text-blue-700">
            <strong>Feedback:</strong> {item.feedback || "No feedback available"}
          </div>
        </>
      ) : (
        <>
          {/* Unattempted */}
          <div className="text-yellow-500 font-semibold">
            Unattempted
          </div>

          {/* Correct Answer */}
          <div className="p-4 rounded-xl border-2 border-green-500 bg-green-100 text-green-700">
            <strong>Correct Answer:</strong> {item.correctAns}
          </div>

        </>
      )}
    </CollapsibleContent>
  </Collapsible>
))}

          </section>

          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;


