import React, {useState, useEffect} from 'react';
import { ADD_IMAGE_VAR_INITIAL_DATA, setAddImage } from "../../../../graphql/LocalState/addImage";
import ImageElementModal from "./ImageElementModal";
import YouzignModal from "../../../../components/YouzignModal";
import {Option, Section} from "components/PropertyEditor/PropertyEditor";
import { RangeInput } from 'components/PropertyEditor/PropertyEditor';
import {useParams} from 'react-router-dom'
import DropImageZone from "../../../media/components/DropImageZone";
import {motion} from "framer-motion";
import {useAuthUser} from "../../../../graphql/User/hooks";
import {useImageElementCommands} from "../../../../graphql/ImageElement/hooks";
import {INTERACTION_FRAGMENT} from "../../../../graphql/Interaction/fragments";
import {useElementGroupRoute, useElementRoute} from "../../routeHooks";
import {useQuery, useReactiveVar} from "@apollo/client";
import gql from "graphql-tag";
import {getAcl} from "../../../../graphql/LocalState/acl";
import LinkButton from "../../../../components/Buttons/LinkButton";
import Modal from "../../../../components/Modal";


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
      [type]: true
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
        {(src) ? <img className={'img-fluid'} src={src} style={{opacity}}/> : null}

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