// Guion del video "English Friends App".
// Este archivo no importa nada para que también se pueda leer desde
// scripts/export-srt.mjs (genera los subtítulos con tiempos para grabar las voces).

export type Speaker = "javier" | "max" | "both";

export type ProfileField =
  | "javier.name"
  | "javier.from"
  | "javier.age"
  | "javier.phone"
  | "javier.color"
  | "max.name"
  | "max.from"
  | "max.age"
  | "max.color";

export type Line = {
  speaker: Speaker;
  text: string;
  // Segundos extra para esta línea (útil si tu voz dura más que el subtítulo).
  extra?: number;
  // Datos del perfil de la app que aparecen cuando se dice esta línea.
  reveal?: ProfileField[];
};

export type Scene = {
  number: number;
  title: string;
  english: string;
  // Muestra el panel de la app durante toda la escena.
  showApp?: boolean;
  lines: Line[];
};

export const FPS = 30;

// ---- Ajustes de tiempo (cámbialos si tus voces van más rápido o más lento) ----
export const SECONDS_PER_WORD = 0.38;
export const MIN_LINE_SECONDS = 2.4;
export const LINE_BASE_SECONDS = 1.1;
export const GAP_SECONDS = 0.35;
export const INTRO_SECONDS = 5;
export const SCENE_CARD_SECONDS = 2.6;
export const OUTRO_SECONDS = 5;
// Las líneas más largas que esto se dividen en dos subtítulos seguidos.
export const MAX_SUBTITLE_CHARS = 72;

export const SCENES: Scene[] = [
  {
    number: 1,
    title: "Saludo",
    english: "Greetings",
    lines: [
      { speaker: "javier", text: "Good morning! My name is Javier. What's your name?" },
      { speaker: "max", text: "Hi, Javier! I'm Max. Nice to meet you." },
      { speaker: "javier", text: "Nice to meet you, too. How are you?" },
      { speaker: "max", text: "I'm fine, thank you. And you?" },
      { speaker: "javier", text: "I'm great, thanks!" },
    ],
  },
  {
    number: 2,
    title: "Crear el perfil",
    english: "Creating our profiles",
    showApp: true,
    lines: [
      { speaker: "max", text: "Look! This is a new app. It's “English Friends.” Let's make our profiles!" },
      { speaker: "javier", text: "OK! How do you spell your name?" },
      { speaker: "max", text: "M-A-X. And you?", extra: 0.8, reveal: ["max.name"] },
      { speaker: "javier", text: "J-A-V-I-E-R.", extra: 1.2, reveal: ["javier.name"] },
      { speaker: "max", text: "Where are you from, Javier?" },
      { speaker: "javier", text: "I'm from Hidalgo, Mexico. I'm Mexican. And you?", reveal: ["javier.from"] },
      { speaker: "max", text: "Really? I'm from Hidalgo too!", reveal: ["max.from"] },
      { speaker: "javier", text: "Cool! How old are you?" },
      { speaker: "max", text: "I'm fourteen years old. And you?", reveal: ["max.age"] },
      { speaker: "javier", text: "I'm fifteen.", reveal: ["javier.age"] },
      { speaker: "max", text: "What's your phone number?" },
      {
        speaker: "javier",
        text: "It's fifty-five, twelve, thirty-four, fifty-six, seventy-eight.",
        extra: 0.8,
        reveal: ["javier.phone"],
      },
      { speaker: "max", text: "What's your favorite color?" },
      { speaker: "javier", text: "My favorite color is green. And you?", reveal: ["javier.color"] },
      { speaker: "max", text: "My favorite color is red.", reveal: ["max.color"] },
    ],
  },
  {
    number: 3,
    title: "Ocupaciones y familia",
    english: "Jobs and family",
    lines: [
      { speaker: "max", text: "What do you do?" },
      { speaker: "javier", text: "I'm a student. I also sell fruit at the market on weekends." },
      { speaker: "max", text: "Wow! What do you sell?" },
      { speaker: "javier", text: "I sell apples, oranges and bananas." },
      {
        speaker: "max",
        text: "Cool! I'm a student too. My father is a doctor and my sister is a teacher. Her name is Laura.",
      },
      { speaker: "javier", text: "Who is your favorite soccer player?" },
      { speaker: "max", text: "It's Lionel Messi. He is from Argentina. He is Argentinian." },
      { speaker: "javier", text: "And who is your favorite teacher?" },
      { speaker: "max", text: "Our English teacher! Ha ha!" },
    ],
  },
  {
    number: 4,
    title: "Objetos y colores",
    english: "Objects and colors",
    lines: [
      { speaker: "javier", text: "What's in your bag?" },
      { speaker: "max", text: "I have a notebook, two pens, an eraser and my phone." },
      { speaker: "javier", text: "What color is your notebook?" },
      { speaker: "max", text: "It's blue. Is this your umbrella?" },
      { speaker: "javier", text: "Yes, it is! It's an old umbrella. It's red. Thank you!" },
    ],
  },
  {
    number: 5,
    title: "Habilidades y expresiones de clase",
    english: "Abilities and classroom language",
    lines: [
      { speaker: "max", text: "Can you speak English?" },
      { speaker: "javier", text: "Yes, I can speak a little English. Can you cook?" },
      { speaker: "max", text: "Yes, I can. But I can't sing!" },
      { speaker: "javier", text: "How do you say “perfil” in English?" },
      { speaker: "max", text: "“Profile.”" },
      { speaker: "javier", text: "Can you repeat, please?" },
      { speaker: "max", text: "Pro-file. Open the app, please. Write your name and take a photo!" },
      { speaker: "javier", text: "Done! Our profiles are ready!", extra: 1.5 },
    ],
  },
  {
    number: 6,
    title: "Presentar al otro y despedida",
    english: "Introducing my friend & goodbye",
    lines: [
      {
        speaker: "javier",
        text: "This is my friend Max. He is fourteen years old. He is from Hidalgo. He is a student and he can cook!",
      },
      {
        speaker: "max",
        text: "And this is my friend Javier. He is fifteen years old. He is from Hidalgo too. He is a student and he sells fruit at the market.",
      },
      { speaker: "javier", text: "Well, see you tomorrow, Max!" },
      { speaker: "max", text: "Bye, Javier! Have a nice day!" },
      { speaker: "both", text: "Goodbye!", extra: 0.6 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Línea de tiempo
// ---------------------------------------------------------------------------

export type Segment =
  | { kind: "intro"; from: number; duration: number }
  | { kind: "card"; from: number; duration: number; scene: Scene }
  | {
      kind: "line";
      from: number;
      duration: number;
      scene: Scene;
      speaker: Speaker;
      text: string;
      reveal: ProfileField[];
      // Última parte de la línea original (para "reveal" y "Done!").
      isLast: boolean;
    }
  | { kind: "outro"; from: number; duration: number };

const sec = (s: number) => Math.round(s * FPS);

const countWords = (text: string) =>
  // "M-A-X" y "J-A-V-I-E-R" se deletrean letra por letra, así que cuentan como varias palabras.
  text.split(/[\s-]+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

export const lineSeconds = (text: string, extra = 0) =>
  Math.max(MIN_LINE_SECONDS, LINE_BASE_SECONDS + countWords(text) * SECONDS_PER_WORD) + extra;

// Divide líneas largas en frases completas para que el subtítulo no ocupe 3 renglones.
export const splitLine = (text: string): string[] => {
  if (text.length <= MAX_SUBTITLE_CHARS) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+["”]?\s*/g) ?? [text];
  const parts: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (current && (current + s).trim().length > MAX_SUBTITLE_CHARS) {
      parts.push(current.trim());
      current = "";
    }
    current += s;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

export const buildTimeline = () => {
  const segments: Segment[] = [];
  let t = 0;
  segments.push({ kind: "intro", from: t, duration: sec(INTRO_SECONDS) });
  t += sec(INTRO_SECONDS);
  for (const scene of SCENES) {
    segments.push({ kind: "card", from: t, duration: sec(SCENE_CARD_SECONDS), scene });
    t += sec(SCENE_CARD_SECONDS);
    for (const line of scene.lines) {
      const parts = splitLine(line.text);
      parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;
        const duration = sec(lineSeconds(part, isLast ? line.extra : 0));
        segments.push({
          kind: "line",
          from: t,
          duration,
          scene,
          speaker: line.speaker,
          text: part,
          reveal: isLast ? (line.reveal ?? []) : [],
          isLast,
        });
        t += duration + sec(GAP_SECONDS);
      });
    }
  }
  segments.push({ kind: "outro", from: t, duration: sec(OUTRO_SECONDS) });
  t += sec(OUTRO_SECONDS);
  return { segments, durationInFrames: t };
};
