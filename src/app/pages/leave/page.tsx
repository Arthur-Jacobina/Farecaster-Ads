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

const slides = [
    {
      component: HelloWorld,
      props: {} 
    },
    {
      component: ThanksPage,
      props: {} 
    }
  ];
  

const initialState: State = { pageIndex: 0 , active: "1", total_button_presses: 0 };


const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;
  return {
    pageIndex: buttonIndex
    ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % slides.length
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
  console.log("info: state is:", frameMessage?.imputText);


  return (
    <div className="p-4">
    <FrameContainer
      postUrl="/frames"
      pathname="/pages/leave"
      state={state}
      previousFrame={previousFrame}
      accepts={acceptedProtocols}
    >

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
