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
import Link from "next/link";
import { currentURL } from "../../utils";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "../../debug";
import {
  ThanksPage,
  HelloWorld,
} from "../../assets/caroussel"

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

const slides: {
}[] = [
  {
    src: ThanksPage,
  },
  {
    src: HelloWorld,
  },
];

const initialState: State = { pageIndex: 0 , active: "1", total_button_presses: 0 };

//Edit here for changes in button behaviour
const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
    ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % slides.length
    : state.pageIndex,
    total_button_presses: state.total_button_presses + 1,
    // active: action.postBody?.untrustedData.buttonIndex
    //   ? String(action.postBody?.untrustedData.inputText)
    //   : "Help",
  };
};  


////TO EDIT SLIDES GO TO ./pages/coroussel.tsx ################################################
// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  function HandleSubscription() {
    const ans = frameMessage.inputText;
    console.log("Users email: %s", ans);
    return (
        <div>Subscribe</div>
    );
  }
  console.log("info: state is:", state);
  // then, when done, return next frame
  return (
    <div className="p-4">
    frames.js starter kit. The Template Frame is on this page, it&apos;s in
    the html meta tags (inspect source).{" "}
    <Link href={createDebugUrl(url)} className="underline">
      Debug
    </Link>{" "}
    or see{" "}
    <Link href="/examples" className="underline">
      other examples
    </Link>
    <FrameContainer
      postUrl="/frames"
      pathname="/pages/leave"
      state={state}
      previousFrame={previousFrame}
      accepts={acceptedProtocols}
    >
      {/* <FrameImage src="https://framesjs.org/og.png" /> */}
      <FrameImage aspectRatio="1.91:1">
        <ThanksPage />
      </FrameImage>
      <FrameButton action="link" target={`https://www.google.com`}>
        Our Twitter
      </FrameButton>
    </FrameContainer>
  </div>

  );
}
