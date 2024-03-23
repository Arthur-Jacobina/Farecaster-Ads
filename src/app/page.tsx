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
import Link from "next/link";
import { currentURL } from "./utils";
import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";

type State = {
  pageIndex: number;
  active: string;
  total_button_presses: number;
};

const imgs: {
  src: string;
}[] = [
  {
    src: "https://raw.githubusercontent.com/Arthur-Jacobina/Farecaster-Ads/main/frames-imgs/firstFrame.png",
  },
  {
    src: "https://i.pinimg.com/originals/d4/33/56/d43356820873342865e5718a7daa2702.png",
  },
  {
    src: "https://www.pngitem.com/pimgs/m/563-5634790_doge-meme-png-photo-shiba-inu-meme-png.png",
  },
];

const initialState: State = { pageIndex: 0 , active: "1", total_button_presses: 0 };

//Edit here for changes in button behaviour
const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
    ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % imgs.length
    : state.pageIndex,
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};  



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
      pathname="/"
      state={state}
      previousFrame={previousFrame}
    >
      {/* <FrameImage src="https://framesjs.org/og.png" /> */}
      <FrameImage aspectRatio="1.91:1">
        <div tw="w-full h-full bg-blue-500 text-white justify-center items-center flex flex-col">
          {/* <div tw="flex flex-row z-50">
            {frameMessage?.inputText ? frameMessage.inputText : "Hello world"}
          </div> */}
          {frameMessage && (
            <div tw="w-full h-full flex flex-col">
              <img src = {imgs[state.pageIndex]!.src}/>
            </div>
          )}
        </div>
      </FrameImage>
      <FrameInput text="put some text here" />
      <FrameButton>
        {state?.active === "1" ? "Active" : "Inactive"}
      </FrameButton>
      <FrameButton>
        {state?.active === "2" ? "Active" : "Inactive"}
      </FrameButton>
      <FrameButton>A</FrameButton>
      <FrameButton action="link" target={`https://www.google.com`}>
        External
      </FrameButton>
    </FrameContainer>
  </div>
   
    //     <FrameImage  
    //       src={imgs[state.pageIndex]!.src}
    //       aspectRatio="1:1"
    //     >
    //     <FrameInput
    //       text="sign our newsletter"

    //     />
    //     <FrameButton>B</FrameButton>
    //     <FrameButton>A</FrameButton>
    //     <FrameButton>{state?.active === "1" ? "Active" : "Inactive"}</FrameButton>
    //     <FrameButton action="link" target={`https://www.youtube.com/`}>
    //       Visit our site
    //     </FrameButton>
    //   </FrameContainer>
    // </div>
  );
}
