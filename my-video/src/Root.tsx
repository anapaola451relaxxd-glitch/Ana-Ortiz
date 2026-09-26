import "./index.css";
import { Composition } from "remotion";
import { EnglishFriends, TIMELINE } from "./EnglishFriends/EnglishFriends";
import { FPS } from "./EnglishFriends/script";

export const RemotionRoot: React.FC = () => {
  return (
    // Para renderizar: npx remotion render EnglishFriends out/english-friends.mp4
    <Composition
      id="EnglishFriends"
      component={EnglishFriends}
      durationInFrames={TIMELINE.durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
