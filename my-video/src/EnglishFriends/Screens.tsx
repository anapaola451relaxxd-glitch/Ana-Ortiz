import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { ChatLogo } from "./ProfilePanel";
import type { Scene } from "./script";
import { bodyFont, COLORS, titleFont } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FLOATERS = [
  { text: "Hello!", x: 90, y: 150, size: 44, speed: 1, color: COLORS.javier },
  { text: "ABC", x: 1690, y: 120, size: 50, speed: 1.3, color: COLORS.brand },
  { text: "Hi!", x: 150, y: 560, size: 40, speed: 0.8, color: COLORS.max },
  { text: "?", x: 1780, y: 520, size: 70, speed: 1.1, color: COLORS.both },
  { text: "A1", x: 330, y: 320, size: 34, speed: 0.9, color: COLORS.brand },
  { text: "Friends", x: 1510, y: 330, size: 36, speed: 1.2, color: COLORS.javier },
];

export const Background: React.FC<{ frame: number; app: number }> = ({ frame, app }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.bgTop} 0%, #f7f9ff 55%, ${COLORS.bgBottom} 100%)` }}>
    <div
      style={{
        position: "absolute",
        left: -200,
        right: -200,
        top: 790,
        height: 600,
        borderRadius: "50% 50% 0 0 / 120px 120px 0 0",
        background: `linear-gradient(180deg, ${COLORS.floor}, #eef4fc)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 900,
        height: 900,
        left: 510,
        top: -120,
        borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0))",
      }}
    />
    {FLOATERS.map((f, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: f.x,
          top: f.y + Math.sin(frame / (40 / f.speed) + i) * 14,
          // Los que quedan detrás del celular se ocultan mientras se ve la app.
          opacity: f.x > 1100 ? 1 - app : 1,
          padding: "10px 24px",
          borderRadius: 26,
          background: "rgba(255,255,255,0.75)",
          border: `3px solid ${f.color}33`,
          color: `${f.color}aa`,
          fontFamily: titleFont,
          fontWeight: 600,
          fontSize: f.size,
          transform: `rotate(${Math.sin(frame / 60 + i) * 4}deg)`,
        }}
      >
        {f.text}
      </div>
    ))}
  </AbsoluteFill>
);

const CharactersStill: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ position: "relative", width: size, height: size, ...style }}>
    {["bodies", "javier-head", "max-head"].map((f) => (
      <Img key={f} src={staticFile(`characters/${f}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    ))}
  </div>
);

export const Intro: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const title = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 22, fps, config: { damping: 16 } });
  const chars = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const out = interpolate(frame, [duration - 14, duration], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 20%, #23336b 0%, ${COLORS.ink} 60%)`,
        opacity: out,
        transform: `scale(${1 + (1 - out) * 0.08})`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -140,
          bottom: -180,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${COLORS.brand}55, ${COLORS.brand}00)`,
        }}
      />
      <div style={{ position: "absolute", left: 140, top: 190, width: 980 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 42,
            background: `linear-gradient(135deg, ${COLORS.brand}, ${COLORS.brandDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)`,
            boxShadow: `0 24px 60px ${COLORS.brand}66`,
          }}
        >
          <ChatLogo size={104} />
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: titleFont,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1,
            color: "#fff",
            opacity: title,
            transform: `translateY(${(1 - title) * 40}px)`,
          }}
        >
          English Friends <span style={{ color: COLORS.brand }}>App</span>
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: bodyFont,
            fontWeight: 500,
            fontSize: 40,
            color: "#c9d3f0",
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
          }}
        >
          Proyecto integrador oral · Inglés A1 · Parcial 1
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 44, opacity: sub }}>
          {[
            { n: "Javier", c: COLORS.javier },
            { n: "Max", c: COLORS.max },
          ].map((p) => (
            <div
              key={p.n}
              style={{
                padding: "12px 34px",
                borderRadius: 999,
                background: p.c,
                color: "#fff",
                fontFamily: titleFont,
                fontWeight: 600,
                fontSize: 36,
              }}
            >
              {p.n}
            </div>
          ))}
        </div>
      </div>
      <CharactersStill
        size={820}
        style={{
          position: "absolute",
          right: 80,
          top: 170,
          opacity: chars,
          transform: `translateY(${(1 - chars) * 120}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SceneCard: React.FC<{ frame: number; duration: number; scene: Scene }> = ({ frame, duration, scene }) => {
  const { fps } = useVideoConfig();
  const radius = interpolate(frame, [0, 16, duration - 14, duration], [0, 150, 150, 0], clamp);
  const num = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const title = spring({ frame: frame - 12, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at 50% 50%)`,
        background: `linear-gradient(135deg, ${COLORS.brand} 0%, ${COLORS.brandDark} 100%)`,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: "#fff",
          color: COLORS.brandDark,
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${num})`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        }}
      >
        {scene.number}
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: title * 0.9,
        }}
      >
        Escena {scene.number}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.05,
          maxWidth: 1600,
          opacity: title,
          transform: `translateY(${(1 - title) * 30}px)`,
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: bodyFont,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 42,
          opacity: title * 0.9,
        }}
      >
        {scene.english}
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const { fps } = useVideoConfig();
  const radius = interpolate(frame, [0, 18], [0, 150], clamp);
  const title = spring({ frame: frame - 10, fps, config: { damping: 13 } });
  const chars = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const fade = interpolate(frame, [duration - 20, duration], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at 50% 50%)`,
        background: `radial-gradient(circle at 70% 30%, #23336b 0%, ${COLORS.ink} 65%)`,
        opacity: fade,
      }}
    >
      <CharactersStill
        size={760}
        style={{ position: "absolute", left: 90, top: 200, opacity: chars, transform: `translateY(${(1 - chars) * 100}px)` }}
      />
      <div style={{ position: "absolute", left: 900, top: 290, color: "#fff" }}>
        <div
          style={{
            fontFamily: titleFont,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            opacity: title,
            transform: `scale(${0.8 + title * 0.2})`,
            transformOrigin: "0% 50%",
          }}
        >
          Thank you!
        </div>
        <div style={{ marginTop: 20, fontFamily: titleFont, fontWeight: 600, fontSize: 64, color: COLORS.brand, opacity: title }}>
          ¡Gracias por ver!
        </div>
        <div style={{ marginTop: 50, fontFamily: bodyFont, fontWeight: 500, fontSize: 34, color: "#c9d3f0", opacity: title }}>
          English Friends App · Inglés A1 · Parcial 1
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TopBar: React.FC<{ scene: Scene; progress: number; visible: number }> = ({ scene, progress, visible }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${progress * 100}%`, background: COLORS.brand }} />
    <div
      style={{
        position: "absolute",
        left: 48,
        top: 38,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 26px 10px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 8px 24px rgba(15,27,61,0.1)",
        opacity: visible,
        fontFamily: bodyFont,
        fontWeight: 600,
        fontSize: 26,
        color: COLORS.ink,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: COLORS.brand,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: titleFont,
          fontSize: 26,
        }}
      >
        {scene.number}
      </span>
      {scene.title}
    </div>
  </>
);
