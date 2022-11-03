import React from "react";
import _map from "lodash/map";
import MediaLibraryModalItem from "../MediaLibraryModalItem";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";

/**
 * Media library items list in select popup
 * @param medias
 * @param close
 * @returns {Array}
 * @constructor
 */
const MediaLibraryList = ({medias, onSelect}) => {
    return(
      <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}
            style={{width: '100%'}}
          >
              {
                  _map(medias, video => (
                    <MediaLibraryModalItem
                      media={video}
                      onSelect={onSelect}
                      key={'media_library_video_' + video.id}
                    />
                  ))
              }
          </motion.div>
      </AnimatePresence>
    )
};

export default MediaLibraryList;