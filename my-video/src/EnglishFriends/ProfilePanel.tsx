import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { ProfileField } from "./script";
import { bodyFont, COLORS, titleFont } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Row = { field: ProfileField; label: string; value: string; swatch?: string };

const PROFILES: {
  who: "javier" | "max";
  name: string;
  color: string;
  head: { cx: number; cy: number; r: number };
  rows: Row[];
}[] = [
  {
    who: "javier",
    name: "Javier",
    color: COLORS.javier,
    head: { cx: 105, cy: 120, r: 62 },
    rows: [
      { field: "javier.name", label: "Name", value: "J-A-V-I-E-R" },
      { field: "javier.from", label: "From", value: "Hidalgo, Mexico" },
      { field: "javier.age", label: "Age", value: "15" },
      { field: "javier.phone", label: "Phone", value: "55 12 34 56 78" },
      { field: "javier.color", label: "Color", value: "Green", swatch: COLORS.green },
    ],
  },
  {
    who: "max",
    name: "Max",
    color: COLORS.max,
    head: { cx: 322, cy: 113, r: 61 },
    rows: [
      { field: "max.name", label: "Name", value: "M-A-X" },
      { field: "max.from", label: "From", value: "Hidalgo, Mexico" },
      { field: "max.age", label: "Age", value: "14" },
      { field: "max.color", label: "Color", value: "Red", swatch: COLORS.red },
    ],
  },
];

const AVATAR = 104;

const Avatar: React.FC<{ who: "javier" | "max"; head: { cx: number; cy: number; r: number }; color: string; photo: number; initial: string }> = ({
  who,
  head,
  color,
  photo,
  initial,
}) => {
  // Recorta la cabeza del personaje para usarla como "foto de perfil".
  const scale = AVATAR / (head.r * 2.15);
  const size = 450 * scale;
  return (
    <div
      style={{
        width: AVATAR,
        height: AVATAR,
        borderRadius: "50%",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        border: `4px solid ${color}`,
        background: `${color}22`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 46,
          color,
          opacity: 1 - photo,
        }}
      >
        {initial}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#eef3fb", opacity: photo }}>
        <Img
          src={staticFile(`characters/${who}-head.png`)}
          style={{
            position: "absolute",
            width: size,
            height: size,
            maxWidth: "none",
            left: AVATAR / 2 - head.cx * scale,
            top: AVATAR / 2 - head.cy * scale,
          }}
        />
      </div>
    </div>
  );
};

export const ProfilePanel: React.FC<{
  visible: number;
  revealedAt: Partial<Record<ProfileField, number>>;
  frame: number;
  photoAt: number | null;
  doneAt: number | null;
}> = ({ visible, revealedAt, frame, photoAt, doneAt }) => {
  if (visible <= 0.001) return null;
  const photo = photoAt === null ? 0 : interpolate(frame, [photoAt, photoAt + 8], [0, 1], clamp);
  const flash = photoAt === null ? 0 : interpolate(frame, [photoAt, photoAt + 3, photoAt + 14], [0, 1, 0], clamp);
  const done = doneAt === null ? 0 : interpolate(frame, [doneAt, doneAt + 10], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 1190,
        top: 70,
        width: 590,
        height: 750,
        opacity: visible,
        transform: `translateX(${(1 - visible) * 160}px) rotate(${(1 - visible) * 6}deg)`,
        borderRadius: 56,
        background: COLORS.ink,
        padding: 18,
        boxSizing: "border-box",
        boxShadow: "0 40px 80px rgba(15,27,61,0.35)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 42,
          background: "#f6f8fc",
          overflow: "hidden",
          position: "relative",
          fontFamily: bodyFont,
        }}
      >
        <div
          style={{
            height: 118,
            background: `linear-gradient(135deg, ${COLORS.brand}, ${COLORS.brandDark})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 30px 0",
            color: "#fff",
          }}
        >
          <ChatLogo size={58} />
          <div>
            <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 36, lineHeight: 1 }}>English Friends</div>
            <div style={{ fontSize: 20, opacity: 0.9, marginTop: 4 }}>My profile</div>
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {PROFILES.map((p) => (
            <div
              key={p.who}
              style={{
                background: "#fff",
                borderRadius: 26,
                padding: "18px 22px",
                boxShadow: "0 8px 24px rgba(15,27,61,0.08)",
                borderLeft: `8px solid ${p.color}`,
                display: "flex",
                gap: 20,
              }}
            >
              <Avatar who={p.who} head={p.head} color={p.color} photo={photo} initial={p.name[0]} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {p.rows.map((row) => {
                  const at = revealedAt[row.field];
                  const shown = at === undefined ? 0 : interpolate(frame, [at, at + 12], [0, 1], clamp);
                  const chars = Math.round(shown * row.value.length);
                  return (
                    <div key={row.field} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 25, height: 34 }}>
                      <span style={{ width: 86, color: COLORS.inkSoft, fontWeight: 500 }}>{row.label}</span>
                      <span
                        style={{
                          flex: 1,
                          fontWeight: 600,
                          color: COLORS.ink,
                          borderBottom: shown > 0 ? "none" : "2px dashed #cfd7e6",
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {row.swatch && shown > 0 ? (
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              background: row.swatch,
                              transform: `scale(${shown})`,
                            }}
                          />
                        ) : null}
                        {row.value.slice(0, chars)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {done > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 22,
              height: 70,
              borderRadius: 22,
              background: COLORS.green,
              color: "#fff",
              fontFamily: titleFont,
              fontWeight: 600,
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: done,
              transform: `scale(${0.8 + done * 0.2})`,
            }}
          >
            ✓ Profiles ready!
          </div>
        ) : null}

        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </div>
    </div>
  );
};

export const ChatLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="4" y="6" width="56" height="40" rx="16" fill="#fff" />
    <path d="M16 44 L12 58 L30 44 Z" fill="#fff" />
    <text x="32" y="34" textAnchor="middle" fontFamily={titleFont} fontWeight="700" fontSize="24" fill={COLORS.brand}>
      Hi!
    </text>
  </svg>
);
