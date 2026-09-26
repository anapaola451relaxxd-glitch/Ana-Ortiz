# English Friends App – Video (Inglés A1, Parcial 1)

Video animado con Remotion: Javier y Max platican con subtítulos tipo karaoke.
El personaje que habla mueve la cabeza, se ilumina su nombre y aparece un globito de voz.
En la Escena 2 y al final de la Escena 5 aparece la app "English Friends" llenando los perfiles.

## Comandos

```bash
npm i                 # instalar (solo la primera vez)
npm run dev           # abrir Remotion Studio para ver y editar el video
npm run render        # crear el video en out/english-friends.mp4
npm run subtitles     # crear out/english-friends.srt y out/guion-con-tiempos.txt
```

## Cambiar diálogos o tiempos

Todo está en `src/EnglishFriends/script.ts`:

- **Textos**: edita el `text` de cada línea.
- **Una línea necesita más tiempo** (tu voz dura más): agrega `extra: 1` (segundos) a esa línea.
- **Todo va muy rápido o muy lento**: cambia `SECONDS_PER_WORD` (0.38 por defecto).

## Agregar las voces

1. Ejecuta `npm run subtitles` y abre `out/guion-con-tiempos.txt`: ahí está el segundo exacto
   en el que empieza cada línea.
2. Graba cada línea y colócala en ese tiempo en tu editor (CapCut, iMovie, etc.) junto con
   `out/english-friends.mp4`. El archivo `.srt` sirve para ver los tiempos en el editor.
3. Si una grabación no cabe, agrega `extra` a esa línea y vuelve a renderizar.

## Personajes

Las imágenes recortadas están en `public/characters/` (cuerpos y cabezas por separado para
animar la cabeza al hablar). Las fuentes (Fredoka y Poppins) están en `public/fonts/`.
