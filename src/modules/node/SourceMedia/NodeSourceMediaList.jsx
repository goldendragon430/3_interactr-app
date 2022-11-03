import React, { useEffect } from 'react';
import map from 'lodash/map';
import times from "lodash/times";
import { AnimatePresence, motion } from "framer-motion";
import { useReactiveVar } from "@apollo/client";
import ContentLoader from "react-content-loader";

import { useMedias } from "@/graphql/Media/hooks";
import { NodeSourceMediaListItem } from './NodeSourceMediaListItem';
import { ErrorMessage } from 'components';
import { 
  getNodeSettings, 
  SHOW_CHANGE_SOURCE_MEDIA_MODAL,
} from "@/graphql/LocalState/nodeSettings";
import {
  animationState, 
  preAnimationState, 
  transition
} from "components/PageBody";

export const NodeSourceMediaList = ({onChange, loading: saving, projectId}) => {
  const { activeModal } = useReactiveVar(getNodeSettings);
  const [medias, , { loading, error, refetch }] = useMedias({
    id: projectId, 
    last: 12, 
    page: 1, 
    is_image: 0
  });

  useEffect(() => {
    if (activeModal === SHOW_CHANGE_SOURCE_MEDIA_MODAL) {
      (async function () {
        await refetch();
      })();
    }
  }, [activeModal]);

  if(loading) return <ItemsLoading />;

  if(error) return <ErrorMessage error={error}/>;

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{ width: '100%' }}
      >
        <div className="grid">
          {map(
            medias.data, 
            media => (
              <NodeSourceMediaListItem 
                media={media} 
                key={'media_key_' + media.id} 
                onChange={onChange} saving={saving}
              />
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

const ItemsLoading = () => {
  const styles = {
    listItem: { 
      width: 'calc(100% / 4)', 
      float: 'left', 
      padding: '10px 15px' 
    },
    listItemInner: {
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 0,
      boxShadow: '0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)'
    }
  }
  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{ width: '100%' }}
      >
        {
          times(12, ()=>(
            <div style={styles.listItem}>
              <div style={styles.listItemInner}>
                <ContentLoader
                  speed={2}
                  width={190}
                  height={125}
                  viewBox="0 0 190 125"
                >
                  {/* Video */}
                  <rect x="0" y="0" rx="3" ry="3" width="190" height="75" />
                  {/* Tags */}
                  <rect x="5" y="80" rx="3" ry="3" width="180" height="14" />
                  {/* Hearts */}
                  <rect x="5" y="103" rx="3" ry="3" width="37" height="17" />
                  {/* Button */}
                  <rect x="94" y="100" rx="5" ry="3" width="91" height="24" />
                </ContentLoader>
              </div>
            </div>
          ))
        }
      </motion.div>
    </AnimatePresence>
  )
};