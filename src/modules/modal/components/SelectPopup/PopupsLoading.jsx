import React from 'react';
import times from "lodash/times";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import ContentLoader from "react-content-loader";

const PopupsLoading = () => {
  const listItemInnerStyles = {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 0,
    boxShadow: '0px 2px 5px rgba(0,0,0,.1), 0px 1px 2px rgba(0,0,0,.05)'
  }
  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {
          times(12, (i)=>(
            <div style={{ width: 'calc(96% / 4)', padding: 15 }}>
              <div style={listItemInnerStyles}>
                <ContentLoader
                  speed={2}
                  width={300}
                  height={237}
                  viewBox="0 0 300 237"
                >
                  {/* Video */}
                  <rect x="0" y="0" rx="3" ry="3" width="250" height="135" />
                  {/* Tags */}
                  <rect x="5" y="150" rx="3" ry="3" width="190" height="20" />
                  <rect x="5" y="175" rx="3" ry="3" width="165" height="15" />
                  {/* Button */}
                  <rect x="5" y="205" rx="3" ry="3" width="61" height="20" />
                  <rect x="105" y="203" rx="3" ry="3" width="91" height="26" />
                </ContentLoader>
              </div>
            </div>
          ))
        }
      </motion.div>
    </AnimatePresence>
  )
};

export default PopupsLoading;