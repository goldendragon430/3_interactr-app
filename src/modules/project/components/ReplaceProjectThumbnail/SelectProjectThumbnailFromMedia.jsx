import React from 'react'
import gql from "graphql-tag";
import {useLazyQuery, useQuery} from "@apollo/client";
import ErrorMessage from "../../../../components/ErrorMessage";
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Buttons/Button";
import MediaSelectorDropdown from "../../../media/components/mediaLibrarySidebar/MediaSelectorDropdown";
import {useParams} from "react-router-dom";
import Modal from "../../../../components/Modal";

const QUERY = gql`
    query media($id: ID!){
        media(id: $id) {
            id
            thumbnail_url
        }
    }
`
const SelectProjectThumbnailFromMedia = ({show, onClose, updateProjectThumbnail, mediaId, saving})=>{
  const [getMedia, {loading, data, called}] = useLazyQuery(QUERY);

  const {projectId} = useParams()

  const handleChange = (mediaId) => {
    getMedia({
      variables:{
        id: mediaId
      }
    })
  }

  const handleSubmit = () => {
    updateProjectThumbnail(data.media.thumbnail_url)
  };

  return(
    <Modal
      height={525}
      width={490}
      show={show}
      onClose={onClose}
      heading={
        <><Icon name="cloud-upload" /> Select Thumbnail From Media</>
      }
      submitButton={
        (data && data.media) ?
          <Button primary onClick={handleSubmit}>
            Select Thumbnail {(saving) ?  <Icon loading /> :  <Icon name={'arrow-right'} />}
          </Button> : null
      }
    >
      <div style={{height: 350}}>
        <MediaSelectorDropdown projectId={projectId} mediaId={mediaId} onChange={handleChange}/>
        <div style={{paddingTop: 30}}>
          {(loading) && <Icon loading />}
          <MediaThumbnail data={data} />
        </div>
      </div>

    </Modal>
  )
};

export default SelectProjectThumbnailFromMedia;

const MediaThumbnail = ({data})=>{
  if(! data || ! data.media) return null;

  return <img src={data.media.thumbnail_url} className={'img-fluid'} style={{maxHeight: '250px'}}/>
};

