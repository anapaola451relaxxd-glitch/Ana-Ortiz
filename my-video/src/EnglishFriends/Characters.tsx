import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import type { Speaker } from "./script";
import { COLORS, speakerColor, titleFont } from "./theme";

// Coordenadas medidas sobre la imagen original (450 x 450 px).
const SRC = 450;
const HEADS = {
  javier: { cx: 105, cy: 120, r: 62 },
  max: { cx: 322, cy: 113, r: 61 },
};
const FEET = {
  javier: { x: 152, y: 392, w: 150 },
  max: { x: 308, y: 392, w: 120 },
};

export const CHARACTER_SIZE = 860;

type Props = {
  frame: number;
  speaker: Speaker | null;
  // Frames desde que empezó la línea actual y su duración.
  lineFrame: number;
  lineDuration: number;
  centerX: number;
  top: number;
  appear: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const isSpeaking = (who: "javier" | "max", speaker: Speaker | null) =>
  speaker === who || speaker === "both";

export const Characters: React.FC<Props> = ({
  frame,
  speaker,
  lineFrame,
  lineDuration,
  centerX,
  top,
  appear,
}) => {
  const k = CHARACTER_SIZE / SRC;
  // Envolvente: la cabeza se mueve mientras "habla" (primer ~88% de la línea).
  const talkEnd = Math.max(20, lineDuration * 0.88);
  const env = interpolate(lineFrame, [0, 5, talkEnd - 8, talkEnd], [0, 1, 1, 0], clamp);
  const breathe = 1 + Math.sin(frame / 22) * 0.004;

  const headMotion = (who: "javier" | "max") => {
    if (isSpeaking(who, speaker)) {
      const f = lineFrame;
      const rot = (Math.sin(f * 0.55) * 0.65 + Math.sin(f * 0.23 + 1) * 0.35) * 3.2 * env;
      const y = -Math.abs(Math.sin(f * 0.42)) * 7 * env;
      return { rot, y };
    }
    // El que escucha inclina un poco la cabeza hacia su amigo.
    const listening = speaker !== null ? interpolate(lineFrame, [0, 10], [0, 1], clamp) : 0;
    const dir = who === "javier" ? 1 : -1;
    return { rot: dir * 2.5 * listening + Math.sin(frame / 30 + (who === "max" ? 2 : 0)) * 0.6, y: 0 };
  };

  const left = centerX - CHARACTER_SIZE / 2;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: CHARACTER_SIZE,
          height: CHARACTER_SIZE,
          opacity: appear,
          transform: `translateY(${(1 - appear) * 80}px) scale(${breathe})`,
          transformOrigin: "50% 90%",
        }}
      >
        {/* Sombras y foco en el piso */}
        {(["javier", "max"] as const).map((who) => {
          const f = FEET[who];
          const active = isSpeaking(who, speaker) ? env : 0;
          return (
            <React.Fragment key={who}>
              <div
                style={{
                  position: "absolute",
                  left: (f.x - f.w * 0.9) * k,
                  top: (f.y - 18) * k,
                  width: f.w * 1.8 * k,
                  height: 40 * k,
                  borderRadius: "50%",
                  background: `radial-gradient(closest-side, ${speakerColor(who)}55, ${speakerColor(who)}00)`,
                  opacity: active,
                  transform: `scale(${0.8 + active * 0.3})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: (f.x - f.w / 2) * k,
                  top: (f.y - 6) * k,
                  width: f.w * k,
                  height: 16 * k,
                  borderRadius: "50%",
                  background: "radial-gradient(closest-side, rgba(15,27,61,0.35), rgba(15,27,61,0))",
                }}
              />
            </React.Fragment>
          );
        })}

        <Img
          src={staticFile("characters/bodies.png")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {(["javier", "max"] as const).map((who) => {
          const h = HEADS[who];
          const { rot, y } = headMotion(who);
          return (
            <Img
              key={who}
              src={staticFile(`characters/${who}-head.png`)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transformOrigin: `${(h.cx / SRC) * 100}% ${((h.cy + h.r) / SRC) * 100}%`,
                transform: `translateY(${y}px) rotate(${rot}deg)`,
              }}
            />
          );
        })}

        {/* Nombre sobre cada personaje + indicador de voz */}
        {(["javier", "max"] as const).map((who) => {
          const h = HEADS[who];
          const talking = isSpeaking(who, speaker) ? env : 0;
          const color = speakerColor(who);
          const sideX = who === "javier" ? (h.cx - h.r - 70) * k : (h.cx + h.r + 12) * k;
          return (
            <React.Fragment key={who}>
              <div
                style={{
                  position: "absolute",
                  left: h.cx * k,
                  top: (h.cy - h.r) * k - 58,
                  transform: `translateX(-50%) scale(${1 + talking * 0.12})`,
                  padding: "6px 22px",
                  borderRadius: 999,
                  fontFamily: titleFont,
                  fontWeight: 600,
                  fontSize: 30,
                  letterSpacing: 1,
                  color: talking > 0.05 ? "#fff" : color,
                  background: talking > 0.05 ? color : "rgba(255,255,255,0.9)",
                  border: `3px solid ${color}`,
                  boxShadow: talking > 0.05 ? `0 10px 30px ${color}66` : "0 6px 16px rgba(15,27,61,0.12)",
                  whiteSpace: "nowrap",
                }}
              >
                {who === "javier" ? "Javier" : "Max"}
              </div>
              <VoiceBubble x={sideX} y={(h.cy - 30) * k} amount={talking} color={color} frame={frame} flip={who === "javier"} />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const VoiceBubble: React.FC<{
  x: number;
  y: number;
  amount: number;
  color: string;
  frame: number;
  flip: boolean;
}> = ({ x, y, amount, color, frame, flip }) => {
  if (amount <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 110,
        height: 76,
        borderRadius: 28,
        background: COLORS.paper,
        boxShadow: `0 10px 30px rgba(15,27,61,0.18)`,
        border: `3px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: amount,
        transform: `scale(${0.6 + amount * 0.4})`,
        transformOrigin: flip ? "100% 100%" : "0% 100%",
      }}
    >
      {[0, 1, 2, 3].map((i) => {
        const hgt = 12 + Math.abs(Math.sin(frame * 0.35 + i * 1.3)) * 30;
        return <div key={i} style={{ width: 9, height: hgt, borderRadius: 6, background: color }} />;
      })}
      <div
        style={{
          position: "absolute",
          bottom: -14,
          [flip ? "right" : "left"]: 14,
          width: 24,
          height: 24,
          background: COLORS.paper,
          borderRight: `3px solid ${color}`,
          borderBottom: `3px solid ${color}`,
          transform: `rotate(${flip ? 45 : 45}deg)`,
          borderBottomRightRadius: 6,
        }}
      />
    </div>
  );
};
