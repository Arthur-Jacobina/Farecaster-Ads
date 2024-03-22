import { getTokenUrl } from "frames.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
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

const initialState: State = { pageIndex: 0 };


//Edit here for changes in button behaviour
const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {

  };
};  


// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

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
          src="https://nft.storage/images/getting-started.png"
          aspectRatio="1:1"
        ></FrameImage>
        <FrameButton>B</FrameButton>
        <FrameButton>A</FrameButton>
      </FrameContainer>
    </div>
  );
}
