// components/Player.tsx
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

export default function Player({ videoUrl }) {
  return (
    <div className="my-8">
      <Plyr source={{ type: "video", sources: [{ src: videoUrl }] }} />
    </div>
  );
}
