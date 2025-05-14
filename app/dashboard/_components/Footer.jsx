"use client";

import React from "react";
import Image from "next/image";
import { Linkedin, Github, Twitter, Instagram } from "lucide-react"; // Correct imports

function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-900 py-8 border-t mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* ABOUT */}
        <div className="text-center md:text-left space-y-2">
          <Image src="/logo.svg" alt="JARVIS" width={80} height={40} />
          <p className="text-xs md:text-sm  max-w-sm text-gray-800">
            JARVIS is an AI-powered personal Interview Trainer. 
          </p>
          <div className="text-xs md:text-sm text-muted-foreground text-center">
          Developed by <span className="text-primary font-semibold">Manish Jangid</span>
        </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/manish-jangid-7427b6279" target="_blank" rel="noreferrer" className="hover:text-primary">
            <Linkedin size={20} /> {/* Correct name for LinkedIn */}
          </a>
          <a href="https://github.com/Manish310802" target="_blank" rel="noreferrer" className="hover:text-primary">
            <Github size={20} /> {/* Correct name for GitHub */}
          </a>
          <a href="https://www.instagram.com/lifeofmanish_07/" target="_blank" rel="noreferrer" className="hover:text-primary">
            <Instagram size={20} /> {/* Correct name for Twitter */}
          </a>
        </div>

        {/* COPYRIGHT */}
        <div className="text-xs md:text-sm text-gray-800 text-center">
          © {new Date().getFullYear()} JARVIS. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
