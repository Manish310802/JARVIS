"use client";

import React from "react";
import Image from "next/image";
import Header from "../dashboard/_components/Header";
import { useRouter } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Level Up Your Interview Skills</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Dive into expertly curated questions tailored to your dream role. Practice, learn, and conquer every technical round with confidence.
        </p>
        <Image
          src="/sharpen.png"
          alt="Interview practice illustration"
          width={600}
          height={400}
          className="mx-auto rounded-xl"
        />
      </section>

      {/* Static Highlights Section */}
      <section className="px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          {
            label: "Total Curated Sets",
            value: "50+ Sets",
            desc: "Carefully selected across domains."
          },
          {
            label: "Expert Reviewed",
            value: "1000+ Questions",
            desc: "Each question vetted by industry pros."
          },
          {
            label: "Updated Monthly",
            value: "Fresh & Relevant",
            desc: "Keeps up with hiring trends."
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold text-primary mb-2">{item.value}</h2>
            <p className="text-gray-800 font-semibold">{item.label}</p>
            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Curated Question Sets */}
      <section className="px-6 py-14 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Curated for You
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "DSA Warm-Up",
              desc: "Essential data structure and algorithm questions for all levels.",
              tag: "Beginner",
              link: "https://www.interviewbit.com/data-structure-interview-questions/"
            },
            {
              title: "System Design",
              desc: "High-level architecture and scalable system challenges.",
              tag: "Advanced",
              link: "https://github.com/donnemartin/system-design-primer"
            },
            {
              title: "Behavioral & HR",
              desc: "Ace the non-technical part of your interview journey.",
              tag: "All",
              link: "https://www.indeed.com/career-advice/interviewing/top-interview-questions-and-answers"
            },
          ].map((q, i) => (
            <div
              key={i}
              className="bg-[#f1f3f5] rounded-xl p-6 hover:bg-[#e9ecef] transition"
            >
              <span className="px-3 py-1 text-sm bg-primary text-white rounded-full mb-3 inline-block">
                {q.tag}
              </span>
              <h3 className="text-xl font-semibold mb-2">{q.title}</h3>
              <p className="text-gray-600">{q.desc}</p>
              <button 
  onClick={() => window.open(q.link, "_blank")}
  className="mt-4 text-primary font-medium hover:underline"
>
  Start Practicing →
</button>

            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-14 bg-primary text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Want Access to Company-Specific Sets?
        </h2>
        <p className="mb-6">
          Unlock Google, Amazon, Microsoft-specific rounds with our Pro tier.
        </p>
        <button
          onClick={() => router.push("/upgrade")}
          className="bg-white text-primary font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          Upgrade to Pro
        </button>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="px-6 py-14 bg-white">
        <h2 className="text-3xl font-semibold mb-10 text-center">FAQs & Tips</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              q: "What’s the best way to start interview prep?",
              a: "Begin with beginner-level sets and gradually progress. Stay consistent and practice daily to build confidence."
            },
            {
              q: "Are these questions enough for top companies?",
              a: "Yes. Our Pro sets are modeled after actual interview rounds from top-tier companies."
            },
            {
              q: "How can I simulate real interview conditions?",
              a: "Use the timer, speak your answers aloud, and record yourself to evaluate performance."
            },
            {
              q: "Do you offer mock interviews too?",
              a: "Coming soon! We’re working on adding AI-powered mock interview sessions and live feedback."
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg mb-1">{item.q}</h3>
              <p className="text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}