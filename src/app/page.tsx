import { getTokenUrl } from "frames.js";

import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp"; 
import { ClientProtocolId } from "frames.js";
import { currentURL } from "./utils";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";
import React from 'react';

const acceptedProtocols: ClientProtocolId[] = [ 
  {
    id: "xmtp", 
    version: "vNext", 
  }, 
  { 
    id: "farcaster", 
    version: "vNext", 
  }, 
]; 

type State = {
  pageIndex: number;
  active: string;
  total_button_presses: number;
};

type FrameActionData = {
  buttonIndex: number;
  requesterFid: number;
  castId?: {
    fid: number;
    hash: `0x${string}`;
  };
  inputText?: string;
};


const imgs: {
  src: string;
}[] = [
  {
    src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75",
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeidc6e5t3qmyckqh4fr2ewrov5asmeuv4djycopvo3ro366nd3bfpu&w=1920&q=75",
  },
];

const initialState: State = { pageIndex: 0 , active: "1", total_button_presses: 0 };


const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
    ? (state.pageIndex + (buttonIndex === 2 ?  1 : 1 ? state.pageIndex === 0 ? 0 :  -1 : 0)) % imgs.length
    : state.pageIndex,
    total_button_presses: state.total_button_presses + 1,
  };
};  

export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });
  if ( 
    previousFrame.postBody
  ) {
    console.log();
  }


  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  console.log("info: state is:", state);
 
  return (
    <div>
    <FrameContainer
      postUrl="/frames"
      pathname="/"
      state={state}
      previousFrame={previousFrame}
      accepts= {acceptedProtocols}
    >
      <FrameImage aspectRatio="1.91:1" src={imgs[state.pageIndex]!.src}>
      </FrameImage>
      <FrameInput text="Subscribe" />
      <FrameButton>←</FrameButton>
      <FrameButton>→</FrameButton>
      <FrameButton action = 'post' target = '/pages/leave'>
        Subscribe
      </FrameButton>
    </FrameContainer>
  </div>
  );
}

