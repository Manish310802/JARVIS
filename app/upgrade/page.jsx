"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "../dashboard/_components/Header";

function UpgradePage() {
  return (
    <>
      <Header />
    <div className="px-6 md:px-20 py-10">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-primary mb-4">
            Unlock Pro Features with <span className="text-purple-600">JARVIS Premium</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Elevate your interview preparation with real-time feedback, video analysis, and access to industry-level mock questions tailored to your dream job.
          </p>
          <Button size="lg" className="rounded-2xl text-lg px-8">
            Upgrade to Premium
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/illustration.png"
            width={600}
            height={400}
            alt="Premium illustration"
            className="rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="mt-20 space-y-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <Image
              src="/feedback.png"
              width={600}
              height={400}
              alt="Feedback system"
              className="rounded-xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-3">Smart AI Feedback</h2>
            <p className="text-muted-foreground text-lg">
              Receive detailed feedback on your answers powered by advanced AI evaluation, helping you improve tone, clarity, and confidence.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="md:w-1/2">
            <Image
              src="/analysis.png"
              width={600}
              height={400}
              alt="Video analysis"
              className="rounded-xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-3">Facial Expression & Posture Analysis</h2>
            <p className="text-muted-foreground text-lg">
              Get insights on your non-verbal cues. Our system evaluates your expressions, eye contact, and posture to enhance your overall impression in interviews.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <Image
              src="/questions.png"
              width={600}
              height={400}
              alt="Exclusive content"
              className="rounded-xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-3">Exclusive Question Sets</h2>
            <p className="text-muted-foreground text-lg">
              Access to curated questions based on company profiles, job roles, and real-world scenarios that mimic actual technical interviews.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Ace Every Interview?</h3>
          <p className="text-muted-foreground mb-4">
            Take your interview prep to the next level with JARVIS Premium.
          </p>
          <Button size="lg" className="rounded-xl text-lg px-10">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

export default UpgradePage;
