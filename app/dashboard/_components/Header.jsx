"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log("📍 Current Path:", path);
  }, [path]);

  return (
    <div className="flex p-4 items-center justify-between bg-gray-200 shadow-md">
      <Image src="/logo.svg" alt="logo" width={160} height={100} />
      <ul className="hidden md:flex gap-6">
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/dashboard" ? "text-primary font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/Progress"
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/Progress" ? "text-primary font-bold" : ""
            }`}
          >
            Progress
          </Link>
        </li>
        <li>
          <Link
            href="/questions"
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/questions" ? "text-primary font-bold" : ""
            }`}
          >
            Questions
          </Link>
        </li>
        <li>
          <Link
            href="/upgrade"
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/upgrade" ? "text-primary font-bold" : ""
            }`}
          >
            Upgrade
          </Link>
        </li>
        <li>
          <Link
            href="/how_it_works"
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path === "/how_it_works" ? "text-primary font-bold" : ""
            }`}
          >
            How it works?
          </Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
