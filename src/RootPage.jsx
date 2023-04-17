import React, {lazy, useEffect, useState} from 'react';
//import {hot} from 'react-hot-loader/root';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './modules/auth/components/LoginPage';
import ForgottenPasswordPage from './modules/auth/components/ForgottenPasswordPage';
import PasswordResetFromTokenPage from './modules/auth/components/PasswordResetFromTokenPage';
import RegisterPage from './modules/registration/components/RegisterPage';
import Spinner from './components/Spinner';
import LoggedInPage from './LoggedInPage';
import SharePage from './modules/sharePage/components/SharePage';
import PrivacyPolicy from './modules/privacyPolicy/components/PrivacyPolicy';
import PageLoader from './components/PageLoader';
import Helmet from "react-helmet";
import {useLazyQuery, useQuery, useReactiveVar} from "@apollo/client";
import {GET_WHITELABEL} from "./graphql/Agency/queries";
import {ToastContainer} from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import {phpApi} from "./utils/apis";
import findIndex from 'lodash/findIndex';
import {ourDomains} from "./config";
import {getWhitelabel, setWhitelabel} from "./graphql/LocalState/whitelabel";

import axios from 'axios';
import reduce from 'lodash/reduce';

// const LoginPage = React.lazy(() => import(/* webpackChunkName:"LoginPage" */ 'modules/auth/components/LoginPage'));
// const PrivacyPolicy = lazy(() =>
//   import(/* webpackChunkName:"PrivacyPolicy" */ 'modules/privacyPolicy/components/PrivacyPolicy')
// );
// const LoginPage = lazy(() => import(/* webpackChunkName:"Login" */'modules/auth/components/LoginPage')) ;
// const SharePage = lazy(() => import(/* webpackChunkName: "SharePage" */ 'modules/sharePage/components/SharePage'));
// const LoggedInPage = lazy(() => import(/* webpackChunkName:'LoggedInPage' */ './LoggedInPage'));

const RootPage = () => {
  const [checkingWhitelabel, setCheckingWhitelabel] = useState(true);

  // const getLatestVersion = async () => {
  //   const options = {
  //       method: 'GET',
  //       headers: {Accept: '*/*', AccessKey: '195264bf-4e60-4356-b98db5a9c3fd-b55d-47e7'}
  //     };
      
  //     const req = await axios.get('https://storage.bunnycdn.com/interactr-projects/frontend/', options);
      
  //     if(req.data.length == 0) {
  //       return -1;
  //     }
  
  //     const versions = reduce(req.data, (result, item, index)=>{
  //         if(item.IsDirectory){
  //             result.push(
  //                 parseFloat(item.ObjectName)
  //             )
  //         }
  //         return result;
  //     }, []);
  
  //     const sortBy = require('lodash/sortBy');
  //     const sorted = sortBy(versions);
  
  //     const last = require('lodash/last')
      
  //     return last(sorted);
  // };

  useEffect(() => {
    const checkWhitelabel = async () => {

      // We need to check that the domain is not our domain before getting whitelabel, this not only makes the
      // app load faster but also prevents the exploit that
      const isOurDomain = findIndex(ourDomains, (i)=>{
        return (i === window.location.hostname);
      });
      if(isOurDomain > 0) {
        setCheckingWhitelabel(false)
        return;
      }

      const req = await phpApi(`get-whitelabel-for-domain`);
      const body = await req.json();
      
      setWhitelabel(body);
      setCheckingWhitelabel(false);
    };

    checkWhitelabel();
  }, [])


  // Just show plain loader until we can confirm whitelabel status
  if(checkingWhitelabel) return <PageLoader />;
  // After here we can work knowing that the whitelabel state has
  // already been established.
  return (
    <ErrorBoundary>
      <BeaconMask />
      <PageHead />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Slide}
      />
      {/* <React.Suspense fallback={<Spinner fullpage />}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotten-password" element={<ForgottenPasswordPage/>} />
          <Route path="/password/reset/:token" element={<PasswordResetFromTokenPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/share/:projectHash" element={<SharePage/>} />
          <Route path="/privacy-policy/:userId(\d+)" element={<PrivacyPolicy />} />
          <Route path="/*" element={<LoggedInPage />} />
        </Routes>
      </BrowserRouter>
      {/* </React.Suspense> */}
    </ErrorBoundary>
  );
};

// react-hot-loader recommends pluging hot watcher below all stateful and/or big libraries to avoid updating all of that on hot reloads
export default RootPage;

/**
 * Sets the page head data using the
 * react helmet component
 * @param isWhitelabel
 * @returns {*}
 * @constructor
 */
const PageHead = () => {
  const whitelabel = useReactiveVar(getWhitelabel);

  if(whitelabel) {
    return(
      <Helmet>
        <title>{ whitelabel.page_title }</title>
        <link rel="icon" type="image/png" href={whitelabel.icon} />
      </Helmet>
    );
  }

  return(
    <Helmet>
      <title>Interactr - The Future Of Video</title>
      <link rel="icon" type="image/png" href="/interactr.png" />
    </Helmet>
  );
};

const BeaconMask = () => {
	const [beaconMask, setBeaconMask] = useState(false);

	useEffect(() => {
		Beacon('init', 'd9187515-ab0f-4e38-8df7-118965a49b74');
		Beacon('config', {
			display: {
				position: 'left',
				style: 'manual',
			},
		});

		Beacon('on', 'open', () => {
			setBeaconMask(true);
		});
		Beacon('on', 'close', () => {
			setBeaconMask(false);
		});
	}, []);

	if (!beaconMask) return null;

	return <div className='beaconMask'>&nbsp;</div>;
};
