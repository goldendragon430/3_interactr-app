import React, {useState} from "react";
import DropImageZone from "../../../media/components/DropImageZone";
import Icon from "../../../../components/Icon";
import {useParams} from "react-router-dom";
import Modal from "../../../../components/Modal";
import MessageBox from "../../../../components/MessageBox";
import gql from "graphql-tag";
import ErrorMessage from "../../../../components/ErrorMessage";
import {useQuery} from "@apollo/client";


/**
 * Open popup to replace given project thumbnail
 * @param show
 * @param onClose
 * @param updateProject
 * @returns {*}
 * @constructor
 */
const UploadCustomProjectThumbnail = ({ show, onClose, updateProjectThumbnail, saving }) => {

    return (
      <Modal
        height={575}
        width={550}
        show={show}
        onClose={onClose}
        heading={
          <><Icon name="cloud-upload" /> Upload Custom Thumbnail</>
        }
        submitButton={
          (!!saving) && <div style={{paddingTop: 10}}>Saving... <Icon loading /></div>
        }
      >
        <CustomThumbnailTab updateProjectThumbnail={updateProjectThumbnail} />
      </Modal>
    );
};

export default UploadCustomProjectThumbnail;




const QUERY = gql`
  query project($id: ID!){
      project(id: $id){
          id
          embed_width
          embed_height
      }
  }
`

const CustomThumbnailTab = ({updateProjectThumbnail}) => {
  const {projectId} = useParams();

  const {data, loading, error} = useQuery(QUERY, {
    variables:{
      id: parseInt(projectId)
    }
  })

  if(loading) return <Icon loading />

  if(error) {
    console.error(error);
    return <ErrorMessage error={'Unable to load project dimensions'} />
  }

  const {project} = data;

  return (
    <div className={'grid'} style={{paddingTop: 15}}>
      <div className={'col12'} style={{marginBottom: 15}}>
        <MessageBox heading="Uploading a New Thumbnail">
          <p>
            Use the image upload box below to upload a custom thumbnail to your project.
          </p>
          <p>
            Your image should be at least {project.embed_height}px high by {project.embed_width}px wide.
          </p>
        </MessageBox>

      </div>
      <div className={'col12'} style={{padding: 15}}>
        <DropImageZone
          onSuccess={({src}) => {
            updateProjectThumbnail(src)
          }}
          directory="thumbnails"
        />
      </div>
    </div>
  )
}