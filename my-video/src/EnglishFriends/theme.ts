import { continueRender, delayRender, staticFile } from "remotion";
import type { Speaker } from "./script";

// Las fuentes vienen incluidas en public/fonts, así el video se renderiza sin internet.
const FONTS: { family: string; file: string; weight: string }[] = [
  { family: "Fredoka", file: "fonts/fredoka.woff2", weight: "300 700" },
  { family: "Poppins", file: "fonts/poppins-400.woff2", weight: "400" },
  { family: "Poppins", file: "fonts/poppins-500.woff2", weight: "500" },
  { family: "Poppins", file: "fonts/poppins-600.woff2", weight: "600" },
  { family: "Poppins", file: "fonts/poppins-700.woff2", weight: "700" },
];

if (typeof document !== "undefined") {
  const handle = delayRender("Cargando fuentes");
  Promise.all(
    FONTS.map((f) =>
      new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight })
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const titleFont = "Fredoka, sans-serif";
export const bodyFont = "Poppins, sans-serif";

export const COLORS = {
  ink: "#0f1b3d",
  inkSoft: "#4a5578",
  paper: "#ffffff",
  bgTop: "#e9f4ff",
  bgBottom: "#fff4e6",
  floor: "#dbe8f7",
  brand: "#ff7a3d",
  brandDark: "#e85d1f",
  javier: "#3b4fd8",
  max: "#0ea5e9",
  both: "#8b5cf6",
  green: "#22c55e",
  red: "#ef4444",
};

export const speakerColor = (s: Speaker) =>
  s === "javier" ? COLORS.javier : s === "max" ? COLORS.max : COLORS.both;

export const speakerName = (s: Speaker) =>
  s === "javier" ? "Javier" : s === "max" ? "Max" : "Javier & Max";
