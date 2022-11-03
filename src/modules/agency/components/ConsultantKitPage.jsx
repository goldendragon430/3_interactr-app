import React, {useEffect} from 'react';
import AgencySubNav from "./AgencySubNav";
import PageBody, {animationState, preAnimationState, transition} from "../../../components/PageBody";
import Upgrade from "../../../components/Upgrade";
import getAsset from 'utils/getAsset';
import {useAuthUser} from "../../../graphql/User/hooks";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import Icon from "../../../components/Icon";
import {AnimatePresence, motion} from "framer-motion";
import {dashboardPath} from "../../dashboard/routes";
import {agencyPath} from "../routes";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";


const ConsultantKitPage = () => {

  setBreadcrumbs([
    {text: 'Agency', link: agencyPath()},
    {text: 'Consulting Kit'}
  ]);


  setPageHeader('Your Consulting Kit')

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <ConsultantKitPageBody />
      </motion.div>
    </AnimatePresence>
  )
};
export default ConsultantKitPage;


const ConsultantKitPageBody = () => {
  return(
    <div style={{ padding: '0 30px' }}>
            <div className="grid">
              <div className={'col10'}>
                <h1 style={{marginTop: 0}}>Your Agency Consulting Kit</h1>
                <p style={{maxWidth:'1000px'}}>
                  Our all inclusive agency consulting kit provides you with the exact tools you need to sell interactive videos to your clients. Below you will find
                  a full collection of Sales Materials, Marketing Assets, Landing and Sales pages. You will also find our deluxe explainer video, this professionally animated & scripted
                  video is optimized to sell your interactive video services. It reminds prospects of current video marketing challenges, educates them on the benefits of interactive video,
                  and presents your agency as the solution.
                </p>
              </div>
              <div className="col12" style={{marginTop: '30px'}}>
                <div className="grid" style={{marginBottom: '50px'}}>
                  <div className="col3">
                    <h3 className="faded-heading ">Marketing Swipes</h3>
                    <p style={{marginTop: 0}}>&nbsp;</p>
                    <a href={getAsset("/img/consultant-kit/Marketing Swipes.pdf")} target="_blank">
                      <img src={getAsset("/img/consultant-kit/marketing-swipes.png")} className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Quote Sheet</h3>
                    <p style={{marginTop: 0}}>&nbsp;</p>
                    <a href={getAsset("/img/consultant-kit/Quote Sheet Blank.pdf")} target="_blank">
                      <img src={getAsset("/img/consultant-kit/quote-sheet.png")} className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Landing Page </h3>
                    <p style={{marginTop: 0}}>(Click Funnels Template) <a
                      href="http://special.videosuite.io/interactr-agency-landing-page"
                      target="_blank"><u>Preview Here</u></a></p>
                    <a href="https://app.clickfunnels.com/funnels/4489973/share/j3hhjvxqm5mtnxyy"
                       target="_blank">
                      <img src={getAsset("/img/consultant-kit/landing-page.jpg")} className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Landing Page </h3>
                    <p style={{marginTop: 0}}>(Convertri Template) <a
                      href="https://arizonahomes.convertri.com/interactr" target="_blank"><u>Preview
                      Here</u></a></p>
                    <a href="https://app.convertri.com/import/b6dd975c-151c-11e8-9da7-065fdb616b18"
                       target="_blank">
                      <img src={getAsset("/img/consultant-kit/landing-page.jpg")} className="img-fluid"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid" style={{marginBottom: '50px'}}>
              <div className="col12">
                <div className="grid">
                  <div className="co3">
                    <h3 className="faded-heading">Infographics</h3>
                    <a href="https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/Infographic+(1).zip" target="_blank">
                      <img src="https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/Infographic-Preview.jpg" className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Social Media Posts</h3>
                    <a href="https://www.dropbox.com/sh/hoi9bvrk04r0g5q/AADGxzqDWVoNL6aCIOqp40ifa?dl=0" target="_blank">
                      <img src="https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/social.jpeg" className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Explainer Video </h3>
                    <p style={{marginTop: 0}}><em>(Click image to download)</em></p>
                    <a href="https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/Interactr+Local.mp4" target="_blank" download>
                      <img src="http://interactrlocal.com/image/oto2/explainer-thumb.png" className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">View Interactr MasterClass</h3>
                    <p style={{marginTop: 0}}><em>(Click image to view)</em></p>
                    <a href="https://player.vimeo.com/video/311795412" target="_blank" download>
                      <img src="http://interactrlocal.com/image/oto2/Webinar-crop.jpg" className="img-fluid"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <h1 style={{marginTop: '75px'}}>Case Studies</h1>
            <div className="grid">
              <div className="col12">
                <div className="grid">
                  <div className="col3">
                    <h3 className="faded-heading">Gaiam</h3>
                    <a href={getAsset("/img/consultant-kit/Gaiam Case Study.pdf")} target="_blank">
                      <img src={getAsset("/img/consultant-kit/giam-case-study.png")} className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Maybelline</h3>
                    <a href={getAsset("/img/consultant-kit/Maybelline Case Study.pdf")} target="_blank">
                      <img src={getAsset("/img/consultant-kit/maybelline-case-study.png")} className="img-fluid"/>
                    </a>
                  </div>
                  <div className="col3">
                    <h3 className="faded-heading">Videosuite</h3>
                    <a href={getAsset("/img/consultant-kit/VideoSuite Case Study.pdf")} target="_blank">
                      <img src={getAsset("/img/consultant-kit/videosuite-case-study.png")} className="img-fluid"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
      </div>
  )
};