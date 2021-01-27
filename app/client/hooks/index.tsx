import React,
{ 
  createContext, 
  useReducer, 
  useContext } from "react";
import { CropStateITF, DownloadITF, RotateStateITF, TrimStateITF, UsePaperITF } from "../utils/state";
import { 
  StateITF, StudioITF } from '../utils/state'

const defaultState: StateITF = {
  componentMount: false,
  studio: {
    status: false,
    objectUrl: '',
    fileId: '',
    fileName: '',
    extension: '',
    autoPlay: false,
    isPlay: false,
    file: undefined,
    isVideo: false,
    fileType: '',
    duration: 0,
    dimensionWidth: 0,
    dimensionHeight: 0,
    fps: undefined,
    originalResolution: '',
    previewFilesType: 0,
    updateContainer: false
  },
  download: {
    status: false,
    algorithm: '',
    style: '',
    paperName: '',
    link: '',
    technique: '',
    authors: '',
    mse: 0,
    ssim: 0,
    psnr: 0,
  },
  usePaper: {
    algorithm: '',
    algorithmLabel: '',
    styleName: '',
    styleLabel: '',
    styleRate: 0,
    paper: '',
    link: '',
    technique: '',
    authors: '',
    type: ''
  },
  crop: {
    status: false,
    width: 0,
    height: 0,
    x: 0,
    y: 0
  },
  trim: {
    status: false,
    start: 0,
    end: 0
  },
  rotate: {
    status: false,
    angle: 0
  }
}

type Action =
  | { type: 'SETCOMPONENTMOUNT' }
  | { type: 'SETSTUDIO', payload: StudioITF }
  | { type: 'SETSTUDIOPLAYPAUSE', payload: StudioITF }
  | { type: "SETDOWNLOAD", payload: DownloadITF }
  | { type: "RESETDOWNLOAD" }
  | { type: "SETUSEPAPER", payload: UsePaperITF }
  | { type: "UPDATECONTAINER", payload: boolean }
  | { type: "SETCROP", payload: CropStateITF }
  | { type: "SETTRIM", payload: TrimStateITF }
  | { type: "SETROTATE", payload: RotateStateITF }
  | { type: "RESETTOOLS" }

const reducer = (state: StateITF = defaultState, action: Action) => {
  switch(action.type) {
    case "RESETTOOLS":
      return {
        ...state,
        crop: {
          status: false,
          width: 0,
          height: 0,
          x: 0,
          y: 0
        },
        trim: {
          status: false,
          start: 0,
          end: 0
        },
        rotate: {
          status: false,
          angle: 0
        }
      }
    case "SETROTATE":
      return {
        ...state,
        rotate: {
          ...state.rotate,
          ...action.payload
        }
      }
    case "SETTRIM":
      return {
        ...state,
        trim: {
          ...state.trim,
          ...action.payload
        }
      }
    case "SETCROP":
      return {
        ...state,
        crop: {
          ...state.crop,
          ...action.payload
        }
      }
    case "UPDATECONTAINER":
      return {
        ...state,
        studio: {
          ...state.studio,
          updateContainer: action.payload
        }
      }
    case "SETUSEPAPER":
      return {
        ...state,
        usePaper: {
          ...state.usePaper,
          ...action.payload
        }
      }
    case "RESETDOWNLOAD":
      return {
        ...state,
        download: {
          status: false,
          algorithm: '',
          style: '',
          paperName: '',
          link: '',
          technique: '',
          authors: '',
          mse: 0,
          ssim: 0,
          psnr: 0,
        }
      }
    case "SETDOWNLOAD":
      return {
        ...state,
        download: {
          ...state.download,
          status: action.payload.status,
          algorithm: action.payload.algorithm,
          style: action.payload.style,
          paperName: action.payload.paperName,
          link: action.payload.link,
          technique: action.payload.technique,
          authors: action.payload.authors,
          mse: action.payload.mse,
          ssim: action.payload.ssim,
          psnr: action.payload.psnr
        }
      }
    case "SETSTUDIOPLAYPAUSE":
      return {
        ...state,
        studio: {
          ...state.studio,
          isPlay: action.payload.isPlay
        }
      }
    case "SETSTUDIO":
      return {
        ...state,
        studio: action.payload
      }
    case "SETCOMPONENTMOUNT":
      return {
        ...state,
        componentMount: true
      }
    default:
      throw new Error();
  }
}

const DispatchContext: any = createContext(defaultState);
const StoreContext: any = createContext(defaultState);

export const StoreProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, (defaultState as never));
  return (
      <StoreContext.Provider value={{ state, dispatch }}>
          {props.children}
      </StoreContext.Provider>
  );
}

export const useDispatch = () => useContext(DispatchContext);
export const useStore = () => useContext(StoreContext);