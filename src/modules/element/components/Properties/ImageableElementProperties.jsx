import React, { useEffect, useState } from 'react';
import { useReactiveVar } from "@apollo/client";
import { Option, RangeInput, Section } from "components/PropertyEditor/PropertyEditor";
import { motion } from "framer-motion";
import gql from "graphql-tag";
import { useImageElementCommands } from "../../../../graphql/ImageElement/hooks";
import { INTERACTION_FRAGMENT } from "../../../../graphql/Interaction/fragments";
import { getAcl } from "../../../../graphql/LocalState/acl";
import { ADD_IMAGE_VAR_INITIAL_DATA, setAddImage } from "../../../../graphql/LocalState/addImage";
import { useAuthUser } from "../../../../graphql/User/hooks";
import ImageElementModal from "./ImageElementModal";
import getAsset from "../../../../utils/getAsset";

const QUERY = gql`
    query interaction($id: ID!) {
        interaction(id: $id) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
  `;


const ImageableElementProperties = ({tabAnimation, element, update, save}) => {
  const [opacity, setOpacity] = useState(element.opacity)

  useEffect(() => {
    update('opacity', opacity)
  }, [opacity, update])
  
  const [addImageModal, setAddImageModal] = useState(false);
  const [addFromComputer, setAddFromComputer] = useState(false);
  const user = useAuthUser();

  const acl = useReactiveVar(getAcl);
  
  const handleSuccess = (options) => {
    save({
      variables: {
        input : {
          id: element.id,
          src: options.src,
          height: options.height,
          width: options.width
        }
      }
    })
  };

  const showImageModal = (type) => {
    setAddImage({
      ...ADD_IMAGE_VAR_INITIAL_DATA,
      [type]: true,
      imageElement: element
    })
  }

  const { src } = element;
  
  return(
    <motion.div {...tabAnimation}>
      <ImageElementModal
        showStockList={addImageModal}
        close={()=>setAddImageModal(false)}
        submit={handleSuccess}
        user={user}
      />
      {/*<YouzignModal*/}
      {/*  showMe={addFromYouZign}*/}
      {/*  source="youzign"*/}
      {/*  close={()=>setAddFromYouZign(false)}*/}
      {/*  submit={handleSuccess}*/}
      {/*  user={user}*/}
      {/*/>*/}

      {/* <UploadImageFromComputerModal
        show={addFromComputer}
      /> */}

      <Section>
        <label>Image Src</label>
        {(! acl.isSubUser)
          ?
            <span style={{display: 'block', padding: '15px 0px'}}>
              Add From:<br/>
              <a className="link" onClick={() => showImageModal('showImageElementModal')}>Image Library</a>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a className="link" onClick={() => showImageModal('showUploadImageFromComputerModal')}>Upload From Computer</a>
            </span>
          :
          <a className="link" onClick={() => showImageModal('showUploadImageFromComputerModal')}>Upload From Computer</a>
        }

        {/*<DropImageZone*/}
        {/*  directory="imageElements"*/}
        {/*  onSuccess={handleSuccess}*/}
        {/*  src={src}*/}
        {/*/>*/}
        {
          (src) ? 
          <div style={{ width: '100%', height:'300px', position: 'relative', display: 'flex'}}>
            <img className={'img-fluid'} src={src} style={{opacity, height: '100%', marginLeft: 'auto', marginRight: 'auto', zIndex: 2}}/> 
            <img
              src={getAsset('/img/modal-page-bg-720.jpg')}
              style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0, zIndex: 1 }}
            />
          </div>
          :null
        }

        <Option
          style={{marginTop: '20px'}}
          label="Image Opacity (%)"
          value={opacity * 100}
          Component={RangeInput}
          onChange={val => setOpacity(val / 100)}
          max={100}
          min={0}
          step={1}
        />
      </Section>
    </motion.div>
  )
};

export default ImageableElementProperties;

const Slider = ({ element }) => {
  // const [interactionId] = useElementRoute();
  const [opacity, setOpacity] = useState(element.opacity)
  const { updateImageElement } = useImageElementCommands(element.id);
  // console.log(val);

  useEffect(() => {
    updateImageElement('opacity', opacity)
    return () => {
      //
    }
  }, [opacity, updateImageElement])

  return (
    <Option
      style={{marginTop: '20px'}}
      label="Opacity (%)"
      value={opacity * 100}
      Component={RangeInput}
      onChange={val => setOpacity(val / 100)}
      // onChange={val => handleInputChange(val)}
      max={100}
      min={0}
      step={2}
    />
  )
}