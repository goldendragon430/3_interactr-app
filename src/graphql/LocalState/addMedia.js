import {makeVar} from "@apollo/client";
import {composerVar} from "./composer";
import {getAddNode, setAddNode} from "./addNode";

// Save the modals as CONST so we can reference them in the
// components without having to worry about typo's

// First step when user selects the type of upload method for the media
export const SHOW_UPLOAD_TYPE_SELECT_MODAL = "SHOW_UPLOAD_TYPE_SELECT_MODAL"

// Upload a file from users computer
export const SHOW_UPLOAD_FROM_FILE_MODAL = "SHOW_UPLOAD_FROM_FILE_MODAL"

// Upload a file from a url
export const SHOW_UPLOAD_FROM_URL_MODAL = "SHOW_UPLOAD_FROM_URL_MODAL"

// Select media from the stock footage api integrations
export const SHOW_UPLOAD_FROM_STOCK_MODAL = "SHOW_UPLOAD_FROM_STOCK_MODAL"

// Select media from another project
export const SHOW_UPLOAD_FROM_LIBRARY_MODAL = "SHOW_UPLOAD_FROM_LIBRARY_MODAL"

// Choose the medias thumbnail
export const SHOW_THUMBNAIL_SELECT_MODAL = "SHOW_THUMBNAIL_SELECT_MODAL"

// Name the media
export const SHOW_MEDIA_NAME_MODAL = "SHOW_MEDIA_NAME_MODAL"

export const ADD_MEDIA_VAR_INITIAL_DATA = {
  activeModal: "",
  // Each time a modal is selected we push to this array, this allows us
  // to better use the back functionality in the app so users can move
  // backwards through the media creation process
  previousModals: [],
  // The media object that is saved to the DB should only include valid values from
  // the media model
  newMediaObject: null,
  // This prop is a little messy but it tells the add media flow
  // that when it completes it should add the media id to the
  // add node flow and open the final step of the add node flow
  // so it just stitches the two workflows together
  addingNode: false,
  // When files are drag and dropped onto the media library
  // sidebar we save them here then open up the upload step
  // with inital files prop set on the dropzone
  droppedFiles: [],
  replaceMedia: 0,
}

// Call with useReactiveVar to read data from this object
export const getAddMedia = makeVar(ADD_MEDIA_VAR_INITIAL_DATA);

export const setAddMedia = (newData)=>{
  const oldData = getAddMedia();

  if(newData.newMediaObject) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newMediaObject = {...oldData.newMediaObject, ...newData.newMediaObject};
  }

  if(newData.replaceMedia) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.replaceMedia = {...oldData.replaceMedia, ...newData.replaceMedia};
  }

  const data = {...oldData, ...newData};

  //console.log(data);
  getAddMedia(data);
};