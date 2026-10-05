import React from "react";
import { Composition } from "remotion";
import InkPilot from "./ink/InkPilot";
import InkEpisode from "./ink/Episode";
import InkThumb from "./ink/Thumb";

const secs = (props: unknown, d: number) => Math.ceil((((props as { durationInSeconds?: number }).durationInSeconds) ?? d) * 30);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="InkPilot" component={InkPilot} durationInFrames={2100} fps={30} width={1920} height={1080} defaultProps={{}}
      calculateMetadata={({ props }) => ({ durationInFrames: secs(props, 70) })} />
    <Composition id="InkEpisode" component={InkEpisode} durationInFrames={9000} fps={30} width={1920} height={1080} defaultProps={{}}
      calculateMetadata={({ props }) => ({ durationInFrames: secs(props, 300) })} />
    <Composition id="InkThumb" component={InkThumb} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{}} />
  </>
);
