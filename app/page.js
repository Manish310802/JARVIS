"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles"; // Optional: Custom background sparkles

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#0f0f0f] flex items-center justify-center text-white overflow-hidden">
      
      {/* Optional sparkles background */}
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1.2}
        particleDensity={50}
        className="absolute w-full h-full z-0"
      />

      <motion.div
        className="relative z-10 text-center p-6 rounded-xl bg-black/40 backdrop-blur-md shadow-xl border border-white/10 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Optional JARVIS Icon */}
        <Image
          src="/jarvis logo.png" // replace with your actual logo path
          alt="JARVIS Logo"
          width={250}
          height={200}
          className="mx-auto mb-4"
        />

        <p className="text-lg font-light text-gray-300">
          Your AI-Powered Mock Interview Assistant
        </p>
        <p className="text-sm mb-6">— Developed by <span className="text-white font-semibold">Manish Jangid</span></p>
        <Button
          onClick={() => router.replace("/dashboard")}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg transition duration-300 shadow-md"
        >
          Enter System
        </Button>
      </motion.div>
    </div>
  );
}