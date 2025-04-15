"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router=useRouter();

  return (
    <div>
    <h2>JARVIS</h2>
    <h3>-Developed by Manish Jangid</h3>
    <Button onClick={()=>router.replace('/dashboard')}>Start</Button>
    </div>
  );
}
