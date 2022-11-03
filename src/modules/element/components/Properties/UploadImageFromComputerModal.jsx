import React from 'react';
import DropImageZone from '../../../../modules/media/components/DropImageZone';
import { ADD_IMAGE_VAR_INITIAL_DATA, getAddImage, setAddImage } from "../../../../graphql/LocalState/addImage";
import { useReactiveVar } from "@apollo/client";
import Modal from 'components/Modal';
import Icon from "components/Icon";
import Button from "components/Buttons/Button";
import {motion, AnimatePresence} from "framer-motion";
import {useImageElementCommands} from "../../../../graphql/ImageElement/hooks";

const UploadImageFromComputerModal = ({show, close, element}) => {
  const { newImageElement } = useReactiveVar(getAddImage);
  const {_, saveImageElement} = useImageElementCommands(element.id);

  const handleSuccess = (options) => {
    setAddImage({
      ...ADD_IMAGE_VAR_INITIAL_DATA,
      newImageElement: options.src
    });
    handleUpload({ src: options.src })
    close();
  }
  
  const handleUpload = (options) => {
    saveImageElement({
      variables: {
        input : {
          id: Number(element.id),
          src: options.src,
          height: options.height,
          width: options.width
        }
      }
    })
  }

  return (
    <Modal
      width={415}
      height={360}
      show={show}
      onClose={close}
      heading={
        <>
          <Icon name="plus" />
          Upload From Computer
        </>
      }
    >
      <AnimatePresence>
        <motion.div 
          style={{ marginTop: 15 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <label style={{paddingBottom: 10}}>Upload your Image</label>
          <DropImageZone
            directory="imageElements"
            onSuccess={({src}) => handleSuccess({src})}
            src={newImageElement}
          />
        </motion.div>
      </AnimatePresence>
    </Modal>
  )
}

export default UploadImageFromComputerModal;