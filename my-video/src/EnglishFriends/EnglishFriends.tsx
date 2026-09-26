import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Characters } from "./Characters";
import { ProfilePanel } from "./ProfilePanel";
import { Background, Intro, Outro, SceneCard, TopBar } from "./Screens";
import { buildTimeline, type ProfileField, type Segment } from "./script";
import { Subtitle } from "./Subtitle";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TIMELINE = buildTimeline();

type LineSegment = Extract<Segment, { kind: "line" }>;
const LINES = TIMELINE.segments.filter((s): s is LineSegment => s.kind === "line");
const INTRO = TIMELINE.segments.find((s) => s.kind === "intro")!;
const OUTRO = TIMELINE.segments.find((s) => s.kind === "outro")!;

// Cuándo aparece cada dato del perfil en la app.
const REVEALED_AT: Partial<Record<ProfileField, number>> = {};
for (const l of LINES) for (const f of l.reveal) REVEALED_AT[f] ??= l.from + Math.round(l.duration * 0.6);

// Rangos en los que se ve el celular con la app.
const appLines2 = LINES.filter((l) => l.scene.showApp);
const photoLine = LINES.find((l) => l.text.includes("take a photo"))!;
const doneLine = LINES.find((l) => l.text.startsWith("Done!"))!;
const APP_RANGES: [number, number][] = [
  [appLines2[0].from, appLines2[appLines2.length - 1].from + appLines2[appLines2.length - 1].duration],
  [photoLine.from, doneLine.from + doneLine.duration],
];
const PHOTO_AT = photoLine.from + Math.round(photoLine.duration * 0.8);
const DONE_AT = doneLine.from + 8;

const appVisibility = (frame: number) =>
  Math.max(
    0,
    ...APP_RANGES.map(([a, b]) => interpolate(frame, [a - 4, a + 14, b - 6, b + 12], [0, 1, 1, 0], clamp)),
  );

export const EnglishFriends: React.FC = () => {
  const frame = useCurrentFrame();
  const current = TIMELINE.segments.find((s) => frame >= s.from && frame < s.from + s.duration);
  const line = current?.kind === "line" ? current : null;

  // Escena activa (también durante las pausas entre líneas).
  const lastLine = [...LINES].reverse().find((l) => l.from <= frame) ?? LINES[0];
  const scene = current?.kind === "card" ? current.scene : lastLine.scene;

  const app = appVisibility(frame);
  const eased = app * app * (3 - 2 * app);
  const centerX = interpolate(eased, [0, 1], [960, 600]);

  const stageIn = interpolate(frame, [INTRO.duration - 16, INTRO.duration + 6], [0, 1], clamp);
  const topBar = interpolate(frame, [INTRO.duration + 60, INTRO.duration + 80, OUTRO.from - 10, OUTRO.from], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <Background frame={frame} app={app} />
      <Characters
        frame={frame}
        speaker={line?.speaker ?? null}
        lineFrame={line ? frame - line.from : 0}
        lineDuration={line?.duration ?? 1}
        centerX={centerX}
        top={60}
        appear={stageIn}
      />
      <ProfilePanel
        visible={app}
        frame={frame}
        revealedAt={REVEALED_AT}
        photoAt={frame >= PHOTO_AT ? PHOTO_AT : null}
        doneAt={frame >= DONE_AT ? DONE_AT : null}
      />
      <TopBar scene={scene} progress={frame / TIMELINE.durationInFrames} visible={topBar} />
      {line ? <Subtitle key={line.from} speaker={line.speaker} text={line.text} frame={frame - line.from} duration={line.duration} /> : null}
      {current?.kind === "card" ? <SceneCard frame={frame - current.from} duration={current.duration} scene={current.scene} /> : null}
      {current?.kind === "intro" ? <Intro frame={frame} duration={current.duration} /> : null}
      {current?.kind === "outro" ? <Outro frame={frame - current.from} duration={current.duration} /> : null}
    </AbsoluteFill>
  );
};
