import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import type { Speaker } from "./script";
import { bodyFont, COLORS, speakerColor, speakerName, titleFont } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Subtitle: React.FC<{
  speaker: Speaker;
  text: string;
  frame: number;
  duration: number;
}> = ({ speaker, text, frame, duration }) => {
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 180 } });
  const exit = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  const color = speakerColor(speaker);

  const words = text.split(" ");
  // Las palabras se van "encendiendo" como karaoke mientras el personaje habla.
  const progress = interpolate(frame, [3, duration * 0.85], [0, words.length], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 46,
        width: 1560,
        transform: `translateX(-50%) translateY(${(1 - enter) * 40}px)`,
        opacity: enter * exit,
        display: "flex",
        flexDirection: "column",
        alignItems: speaker === "javier" ? "flex-start" : speaker === "max" ? "flex-end" : "center",
      }}
    >
      <div
        style={{
          marginBottom: -18,
          marginLeft: 40,
          marginRight: 40,
          zIndex: 1,
          padding: "8px 26px",
          borderRadius: 999,
          background: color,
          color: "#fff",
          fontFamily: titleFont,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: 1,
          boxShadow: `0 8px 20px ${color}55`,
        }}
      >
        {speakerName(speaker)}
      </div>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "34px 56px 30px",
          borderRadius: 34,
          background: "rgba(15, 27, 61, 0.9)",
          border: `4px solid ${color}`,
          boxShadow: "0 24px 60px rgba(15,27,61,0.35)",
          textAlign: "center",
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 54,
          lineHeight: 1.3,
          color: "#fff",
        }}
      >
        {words.map((w, i) => {
          const lit = interpolate(progress, [i, i + 1], [0, 1], clamp);
          const current = progress > i && progress < i + 1;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: i === words.length - 1 ? 0 : "0.28em",
                opacity: 0.38 + lit * 0.62,
                color: current ? COLORS.brand : "#fff",
                transform: `translateY(${current ? -3 : 0}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
