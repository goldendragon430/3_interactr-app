import React, { useEffect } from 'react';
import getAsset from 'utils/getAsset';
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../graphql/LocalState/whitelabel";

const AppLogo = () => {
  const whitelabel = useReactiveVar(getWhitelabel);
  console.log(whitelabel)
  if(whitelabel) {
    return <img src={whitelabel.logo} className="wl"/>
  }

  return <img src={getAsset('/img/logo.png')}  className="n-wl" />
};

export default AppLogo;