import React from 'react';
// import cx from 'classnames';
import styles from './AuthPage.module.scss';
import { supportLink, docsLink } from '@/utils/externalLinks';
import AppLogo from 'components/AppLogo';
import Icon from 'components/Icon';
import { error } from 'utils/alert';
import { isBrowserSupported } from 'utils/domUtils';
// import { updatePageLoadingState } from 'modules/pageLoader/pageLoader';
import Button from 'components/Buttons/Button';
import {motion} from "framer-motion";
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../../graphql/LocalState/whitelabel";
import { getAsset } from '@/utils';


const AuthPage = ({heading, children}) => {
  const whitelabel = useReactiveVar(getWhitelabel);

  const leftWhitelabelStyles = {};
  if (whitelabel) {
    leftWhitelabelStyles.background = whitelabel.background_colour;
  }

  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x:0, transition: {type: 'ease-in'} }
  };

  const animateImageIn = {
    animate: {y: 0, opacity: 1},
    initial: {y:50, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15, delay: 0.7},
  };

  const animateButtonIn = {
    animate: {y: 0, opacity: 1},
    initial: {y:-50, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15, delay: 1.2},
  }
console.log(styles.wrapper)
  return (
    <div className={styles.wrapper}>
      <div className={styles.left} style={leftWhitelabelStyles}>
        <motion.div initial="hidden" animate="show"  variants={list}>
          <motion.div className={styles.logo} variants={item} >
            <AppLogo />
          </motion.div>
          <motion.div className={styles.box} variants={item} >
            <div className={styles.boxForm}>
              {heading && <h1>{heading}</h1>}
              {/* {tip} */}
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className={styles.right} >
        <motion.img src={getAsset('/img/worker_bg.jpg')} {...animateImageIn} />
        {whitelabel == null && (
          <motion.div style={{ position: 'absolute', top: '20px', right: '15px' }} {...animateButtonIn}>
            <Button primary large onClick={()=>Beacon('open')}>
              <Icon name="life-ring" /> Support
            </Button>
          </motion.div>
        )}
        &nbsp;
      </div>
    </div>
  );
};
export default AuthPage;
