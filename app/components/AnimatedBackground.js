"use client";

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { withBasePath } from "../utils/deepgramUtils";
import ClientOnly from "../utils/ClientOnly";

const AnimatedBackground = ({ children }) => {
  return (
    <ClientOnly>
      <Player
        autoplay
        loop
        src={withBasePath("/sts-bg.json")}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        className="animatedBackground"
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "black",
        }}
      >
        {children}
      </div>
    </ClientOnly>
  );
};

export default AnimatedBackground;
