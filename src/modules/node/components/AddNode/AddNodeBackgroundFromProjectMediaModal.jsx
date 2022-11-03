import React from 'react'
import {useQuery, useReactiveVar} from "@apollo/client";
import {getAddNode, setAddNode} from "../../../../graphql/LocalState/addNode";
import Modal from "../../../../components/Modal";
import {useMediaLibraryRoute} from "../../../media/routeHooks";
import {useParams} from "react-router-dom";
import {GET_MEDIAS} from "../../../../graphql/Media/queries";
import ErrorMessage from "../../../../components/ErrorMessage";
import { IMAGES_ACTIVE_TAB, MEDIA_LIBRARY_QUERY_PARAMS, TOGGLE_ON } from "modules/media/components/mediaLibrarySidebar";
import VideosPaginator from "../../../media/components/VideosPaginator";
import {AnimateSharedLayout, motion} from "framer-motion";
import _map from "lodash/map";
import MediaSidebarCard from "../../../media/components/MediaSidebarCard";
import MediaCard from "../../../media/components/MediaCard";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import Icon from "../../../../components/Icon";
import MediaListItem from "../../../media/components/MediaListItem";
import getAsset from "../../../../utils/getAsset";
import Button from "../../../../components/Buttons/Button";

const AddNodeBackgroundFromProjectMediaModal = ({onClose}) => {
  const {showBackgroundFromProjectMediaModal} = useReactiveVar(getAddNode);

  const goBack = () => {
    setAddNode({
      showBackgroundMediaSelectModal: true,
      showBackgroundFromProjectMediaModal: false
    })
  };

  return(
    <Modal
      height={800}
      width={650}
      show={showBackgroundFromProjectMediaModal}
      onClose={onClose}
      onBack={goBack}
      heading={
        <><Icon name={'list'} /> Your Projects Media</>
      }
    >
      {/* Only render body if the modal is shown */}
      <h3 style={{marginTop: 0}}>Select Media To Use From The List Below</h3>
      {(showBackgroundFromProjectMediaModal && <ModalBody  />)}
    </Modal>
  )
}
export default AddNodeBackgroundFromProjectMediaModal;

const ModalBody = () => {
  const [{isOpen, activeTab, page, q}, setMediaRouteParams] = useMediaLibraryRoute();

  const {projectId} = useParams();

  const variables = {...MEDIA_LIBRARY_QUERY_PARAMS, ...{
      page: parseInt(page),
      q,
      project_id: parseInt(projectId)
    }}

  const {data, loading, error} = useQuery(GET_MEDIAS, {variables});

  if(error) return <ErrorMessage error={error} />;

  if(loading) return <ModalBodyLoader />

  return(
    <div style={{height: 'calc(100% - 178px)', overflow: 'hidden',overflowY: "scroll"}}>
      {(!data.result.data.length) && (<NoMediaInProject />)}
      <MediaList items={data.result.data}/>
      <VideosPaginator
        page={page}
        paginatorInfo={data.result.paginatorInfo}
        onChange={page => setMediaRouteParams(TOGGLE_ON, IMAGES_ACTIVE_TAB, page)}
      />
    </div>
  )
}

const MediaList = ({items}) => {
  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };


  return(
    <AnimateSharedLayout>
      <motion.div  initial="hidden" animate="show"  variants={list}>
        {_map(items, (item => (
          <motion.ul
            key={item.id}
            style={{padding: 0}}
            show={{ opacity: 1, y:0, scale: 1, transition: {type: 'ease-in'}}}
            initial={{ opacity: 1, y:0, scale: 1, transition: {type: 'ease-in'}}}
            animate={{ opacity: 1, y: 0, transition: {type: 'ease-in', duration: 0.8} }}
            //exit={{ opacity: 0, x: 150, transition: {type: 'ease-in', duration: 0.8} }}
          >
           <MediaItem item={item}/>
          </motion.ul>
        )))}
      </motion.div>
    </AnimateSharedLayout>
  )
}

const MediaItem = ({item}) => {

  const onSelect = () => {
    setAddNode({
      newNodeObject:{media_id: parseInt(item.id)},
      showBackgroundFromProjectMediaModal: false,
      showNameSelectModal: true,
      staticNode: !!(item.is_image)
    });


  }

  const imageStyles = {
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)',
  }

  return(
    <MediaListItem
      item={item}
      thumbnail={
        <div style={{paddingRight: '30px'}}>
          <img src={item.thumbnail_url || getAsset('/img/no-thumbnail.png')}  className="img-fluid " style={imageStyles} />
        </div>
      }
      onSelect={onSelect}
      actions={
        <Button small onClick={onSelect} primary>Select <Icon name={'arrow-right'} /> </Button>
      }
    />
  )
}


const ModalBodyLoader = () => {
  return <Icon loading/>;
}

const NoMediaInProject = () => {
  return (
    <div style={{paddingRight: '30px'}}>
      <p>No media has been uploaded to this project yet.</p>
      <p> Please click the back button below and choose add new media to upload media to this project.</p>
    </div>
  )
}