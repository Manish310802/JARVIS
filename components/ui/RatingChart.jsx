"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function RatingChart({ rating }) {
  const percentage = (parseInt(rating || "0") / 10) * 100;

  return (
    <div className="w-20 h-20 mx-auto">
      <CircularProgressbar
        value={percentage}
        text={`${rating}/10`}
        styles={buildStyles({
          textSize: "24px",
          pathColor: `#22c55e`,
          textColor: "#4ade80",
          trailColor: "#d1fae5",
          backgroundColor: "#f0fdf4",
        })}
      />
    </div>
  );
}
