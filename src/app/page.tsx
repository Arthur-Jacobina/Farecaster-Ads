import { getTokenUrl } from "frames.js";
import React, { useState } from "react";

import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  FrameInput,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { currentURL } from "./utils";
import { createDebugUrl } from "./debug";

type State = {
  pageIndex: number;
};

const imgs: {
  src: string;
}[] = [
  {
    src: "https://www.pngitem.com/pimgs/m/563-5634790_doge-meme-png-photo-shiba-inu-meme-png.png",
  },
  {
    src: "https://i.pinimg.com/originals/d4/33/56/d43356820873342865e5718a7daa2702.png",
  },
  {
    src: "https://i.pinimg.com/originals/29/d2/18/29d21833548643530bb758ad5022c540.png",
  },
];

const initialState: State = { pageIndex: 0 };


//Edit here for changes in button behaviour
const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
    ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % imgs.length
    : state.pageIndex,
  };
};  


// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);
  const [inputValue, setInputValue] = useState("");

  
  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Aqui você pode fazer o que quiser com o valor do input
      console.log("Valor do input:", inputValue);
      // Por exemplo, enviar para o servidor, manipular o estado, etc.
    }
  };
  // then, when done, return next frame
  return (
    <div>
      <FrameContainer
        pathname="/"
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={imgs[state.pageIndex]!.src}
          aspectRatio="1:1"
        ></FrameImage>
        <FrameInput
          text="sign our newsletter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        <FrameButton>B</FrameButton>
        <FrameButton>A</FrameButton>
        <FrameButton>enter</FrameButton>
        <FrameButton action="link" target={`https://www.youtube.com/`}>
          Visit our site
        </FrameButton>
      </FrameContainer>
    </div>
  );
}
