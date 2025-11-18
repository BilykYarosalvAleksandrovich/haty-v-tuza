"use client";

import "plyr-react/plyr.css";
import Plyr from "plyr-react";

interface PlayerProps {
  videoUrl: string;
}

export default function Player({ videoUrl }: PlayerProps) {
  return (
    <div className="my-8">
      <Plyr source={{ type: "video", sources: [{ src: videoUrl }] }} />
    </div>
  );
}
