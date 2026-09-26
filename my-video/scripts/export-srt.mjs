// Genera out/english-friends.srt y out/guion-con-tiempos.txt con los tiempos exactos
// de cada línea, para grabar las voces o sincronizarlas en un editor de video.
// Uso: npm run subtitles   (requiere Node 22.18 o más nuevo)
import { mkdirSync, writeFileSync } from "node:fs";
import { buildTimeline, FPS } from "../src/EnglishFriends/script.ts";

const { segments } = buildTimeline();
const pad = (n, w = 2) => String(n).padStart(w, "0");
const stamp = (frames, sep) => {
  const ms = Math.round((frames / FPS) * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms % 1000, 3)}`;
};
const name = (s) => (s === "javier" ? "Javier" : s === "max" ? "Max" : "Javier & Max");

const srt = [];
const txt = [];
let n = 1;
for (const seg of segments) {
  if (seg.kind === "card") txt.push(`\n=== Escena ${seg.scene.number}: ${seg.scene.title} (${stamp(seg.from, ".")}) ===`);
  if (seg.kind !== "line") continue;
  srt.push(`${n++}\n${stamp(seg.from, ",")} --> ${stamp(seg.from + seg.duration, ",")}\n${name(seg.speaker)}: ${seg.text}\n`);
  txt.push(`[${stamp(seg.from, ".")} - ${stamp(seg.from + seg.duration, ".")}] ${name(seg.speaker)}: ${seg.text}`);
}

mkdirSync("out", { recursive: true });
writeFileSync("out/english-friends.srt", srt.join("\n"));
writeFileSync("out/guion-con-tiempos.txt", txt.join("\n").trim() + "\n");
console.log("Listo: out/english-friends.srt y out/guion-con-tiempos.txt");
