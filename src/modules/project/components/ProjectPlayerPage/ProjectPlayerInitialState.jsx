import React, { useEffect } from 'react';
import ProjectPreview from '../ProjectPreview';
import { BooleanInput, Option, RangeInput, SizeInput, TextInput } from '../../../../components/PropertyEditor';
import ColorPicker from '../../../../components/ColorPicker';
import Button from '../../../../components/Buttons/Button';
import styles from '../PlayerSettingsPage.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { animationState, preAnimationState, transition } from '../../../../components/PageBody';
import ReplaceProjectThumbnailButton from "../ProjectSharingPage/ReplaceProjectThumbnailButton";

const ProjectPlayerInitialState = ({ project, update, updateSkin, updateEditingStatus }) => {
  useEffect(() => {
    updateEditingStatus();
  }, [updateEditingStatus]);

  const handleChangeSize = (e, [embed_width, embed_height]) => {
    update('embed_width')(embed_width);
    update('embed_height')(embed_height);
  };

  const { autoplay, player_skin, embed_width, embed_height } = project;

  return (
    <AnimatePresence>
      <motion.div exit={preAnimationState} initial={preAnimationState} animate={animationState} transition={transition}>
        <div>
          <h3 className="form-heading">Autoplay</h3>
          <div className={'form-control'}>
            <div className={'grid'}>
              <div className={'col3'}>
                <Option label="Autoplay" Component={BooleanInput} value={autoplay} onChange={update('autoplay')} />
              </div>
              <div className={'col9'}>
                {!!autoplay && (
                  <AnimatePresence>
                    <motion.div
                      exit={preAnimationState}
                      initial={preAnimationState}
                      animate={animationState}
                      transition={transition}
                    >
                      <Option
                        label="Unmute Text"
                        Component={TextInput}
                        value={player_skin.unmute_text}
                        onChange={updateSkin('unmute_text')}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {!autoplay && (
            <AnimatePresence>
              <motion.div
                exit={preAnimationState}
                initial={preAnimationState}
                animate={animationState}
                transition={transition}
              >
                <h3 className={'form-heading'}>Thumbnail</h3>
                <div className={'form-control'}>
                  <ReplaceProjectThumbnailButton />
                </div>

                <h3 className="form-heading">Big Play Icon</h3>
                <div className={'form-control'}>
                  <div className={'grid'}>
                    <div className={'col5'}>
                      <Option
                        label="Big Play Icon Color"
                        value={player_skin.bigPlay.color}
                        Component={ColorPicker}
                        stackOrder={5}
                        onChange={updateSkin('color', { bigPlay: true })}
                      />
                    </div>
                    <div className={'col7'}>
                      <Option
                        label="Big Play Icon Size"
                        value={parseInt(player_skin.bigPlay.size)}
                        Component={RangeInput}
                        onChange={updateSkin('size', { bigPlay: true })}
                        max={10}
                        min={4}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          {/* Commented by MagicPalm */}
          {/* <h3 className="form-heading">Player Max Size</h3>
          <div className={'form-control'}>
            <Option
              style={{ marginTop: 20 }}
              Component={SizeInput}
              value={[embed_width, embed_height]}
              onChange={handleChangeSize}
              ratio={project.base_width / project.base_height}
            />
          </div> */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default ProjectPlayerInitialState;
