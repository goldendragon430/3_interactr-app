import {makeVar} from "@apollo/client";
import {getAddNode} from "./addNode";

const USER_AVATAR_INITIAL_DATA = {
  showUserAvatarModal: false
}

export const getUserAvatar = makeVar(USER_AVATAR_INITIAL_DATA);

export const setUserAvatar = (newData) => {
  const oldData = getUserAvatar();

  const data = {...oldData, ...newData};

  getUserAvatar(data)
}