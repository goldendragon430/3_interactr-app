import React from 'react';
import ReactTooltip from "react-tooltip";
import getAsset from "../../../utils/getAsset";
import Icon from "../../../components/Icon";
import {MediaViews} from "./MediaViews";
import moment from "moment";
import styles from "./MediaSidebarCard.module.scss";
import {useDeleteMedia} from "../../../graphql/Media/hooks";
import {confirm, errorAlert} from "../../../utils/alert";
import {DraggableCore} from "react-draggable";
import {getRelativeDrop} from "../../composer/dragging";
import {COMPOSER_DOM_ID} from "../../../graphql/LocalState/composer";
import CloneOnDrag from "../../../components/CloneOnDrag";
import {setAddMedia} from "../../../graphql/LocalState/addMedia";
import {useParams} from "react-router-dom";
import {setAddNode} from "../../../graphql/LocalState/addNode";
import MediaListItem from "./MediaListItem";

/**
 * This card is used to only use in media sidebar on canvas page
 * @param media
 * @param onUpdate
 * @param onDelete
 * @param replaceMediaSource
 * @param deleting
 * @returns {*}
 * @constructor
 */
const MediaSidebarCard = ({media, onUpdate, replaceMediaSource}) => {
    let mediaItem = media;
    const [deleteMedia, {loading: deleting, error: deleteError}] = useDeleteMedia();
  

    const confirmDeleteMedia = (media) => {
        confirm({
            title: 'Are You Sure!',
            text: 'Are You Sure You Want To Delete This Media?',
            confirmButtonText: 'Yes, Delete It!',
            onConfirm: async () => {
                try {
                    await deleteMedia(null, media.id)
                } catch (err) {
                    // TODO set static error while can figure out how to get exact BE error message
                    errorAlert({text: 'Can\'t delete media item. It is in use for other nodes.'});
                }
            }
        });
    };

    // if (updatedMedia && media.id === updatedMedia.id) {
    //     mediaItem = updatedMedia;
    // }

    return (
       <MediaListItem
         item={mediaItem}
         thumbnail={<Thumbnail item={mediaItem} />}
         onSelect={onUpdate}
         actions={
           <>
             <span style={{cursor: 'pointer', marginRight: '10px'}} data-tip={'Edit'}>
               <Icon name={'edit'} onClick={onUpdate}/>
             </span>
             <span style={{cursor: 'pointer', marginRight: '10px'}} data-tip={'Replace Media'}>
               <Icon name={'sync'} onClick={replaceMediaSource}/>
             </span>
             <span style={{cursor: 'pointer',}} data-tip={'Delete'} onClick={() => confirmDeleteMedia(mediaItem)}>
               {(deleting) ? <Icon loading /> : <Icon name={'trash-alt'} />}
             </span>
           </>
         }
       />
    );
};

function Thumbnail({item, project}){

  // const {createNode} = useNodeCommands();
  const {projectId} = useParams();

  const style = {boxShadow: '0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)', cursor: 'pointer'};


    // If we have a thumbnail URL nothing else matter we can display it
    if (!item.is_image && ! item.thumbnail_url ) {
        return <img draggable={false} className={styles.image} src={ getAsset('/img/avatar-logo.png') }  style={style} />;
    }


    const handleDragStop = e => {
      const acceptedDrop = getRelativeDrop(COMPOSER_DOM_ID, e);

      if (!acceptedDrop) return;
      // Make sure it's a drop on the composer

      setAddNode({
        newNodeObject: {
          project_id: parseInt(projectId),
          media_id: parseInt(item.id),
          background_color: null,
          posX: acceptedDrop.x,
          posY: acceptedDrop.y
        },
        showNameSelectModal: true
      })
    };


    return(
      <CloneOnDrag
        onStop={handleDragStop}
        offset={{ x: 5, y: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <img className={styles.image} src={item.thumbnail_url || item.url}  style={style} />
        </div>
      </CloneOnDrag>
    )
}

export default MediaSidebarCard;