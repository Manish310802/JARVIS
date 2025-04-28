import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`bg-white border rounded-xl p-5 shadow ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={`mb-4 text-center ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}
