import React, { useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { animationState, preAnimationState, transition } from "../../../../components/PageBody";
import Button from "../../../../components/Buttons/Button";
import { BooleanInput, Option } from "../../../../components/PropertyEditor";
// import ColorPicker from "../../../../components/ColorPicker";
// import DropImageZone from "../../../media/components/DropImageZone";

const ProjectPlayerPlayingState = ({project, update, updateSkin , updateEditingStatus}) => {

  const {show_controls, player_skin} = project;
  
  useEffect(() => {
    updateEditingStatus()
  }, [])

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}>
          <div>
            <Option
              label="Show Player Seek Bar"
              Component={BooleanInput}
              value={show_controls}
              onChange={update('show_controls')}
            />
            {/* <Option
              label="Controls Icon Color"
              value={player_skin.controls.color}
              Component={ColorPicker}
              stackOrder={3}
              onChange={updateSkin('color', {controls: true})}
            />
            <Option
              label="Controls Background Color"
              value={player_skin.controls.background}
              Component={ColorPicker}
              stackOrder={2}
              onChange={updateSkin('background', {controls: true})}
            /> */}
            {/* <div className="form-control">
              <label>Branding Image</label>
              <DropImageZone
                onSuccess={({src}) => updateProject('branding_image_src', src)}
                src={project.branding_image_src}
                directory="brandingImages"
              />
              {!!project.branding_image_src && <Button onClick={() => update('branding_image_src', null)} style={{marginTop: '10px'}}>Clear Image</Button>}
            </div> */}
        </div>
      </motion.div>
    </AnimatePresence>
  )
};
export default ProjectPlayerPlayingState;