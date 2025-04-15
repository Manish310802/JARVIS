"use client";
import React from "react";
import Header from "../dashboard/_components/Header";
import { CheckCircle, Mic, Bot, ThumbsUp } from "lucide-react";
import Image from "next/image";

function HowItWorksPage() {
  return (
    <>
      <Header />
      <div className="px-6 py-10 md:px-24 bg-white text-gray-900">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How JARVIS Works</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            JARVIS helps you overcome interview anxiety by simulating real-world interview scenarios using AI. Here's how it works.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="border p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center justify-center mb-4 text-primary">
              <Mic size={36} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Record Your Answers</h2>
            <p className="text-gray-600">
              Start your mock interview. Answer each question by speaking, just like a real interview.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center justify-center mb-4 text-primary">
              <Bot size={36} />
            </div>
            <h2 className="text-xl font-semibold mb-2">AI Feedback</h2>
            <p className="text-gray-600">
              Our AI analyzes your answers in real-time and gives personalized feedback on your response quality, tone, and structure.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div className="flex items-center justify-center mb-4 text-primary">
              <ThumbsUp size={36} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Review and Improve</h2>
            <p className="text-gray-600">
              Get a complete performance report, ratings, and suggestions to improve your answers. Practice again to level up.
            </p>
          </div>
        </section>

        <section className="mt-20 bg-gray-100 p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Use JARVIS?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-1" />
                  Real interview-like experience with webcam and voice input
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-1" />
                  Personalized feedback using advanced AI models
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-1" />
                  Learn from your mistakes and track progress
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-1" />
                  Multiple interview roles to choose from: Analyst, Full Stack, Python Dev, etc.
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/how_it_works.png"
                alt="AI Interview"
                width={500}
                height={400}
                className="rounded-xl shadow-md mx-auto"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HowItWorksPage;
