import React from 'react';
import {useParams} from "react-router-dom";
import styles from "./uploadMedia/StockListModalStyles.module.scss";
import Button from "components/Buttons/Button";
import VideoPlayer from "components/VideoPlayer";
import getAsset from 'utils/getAsset';
import {useCreateMediaByUrl} from "../../../graphql/Media/hooks";
import {addItem} from "../../../graphql/utils";
import {GET_MEDIAS} from "../../../graphql/Media/queries";
import {useMediaLibraryRoute} from "../routeHooks";
import {errorAlert} from "../../../utils/alert";
import Icon from "../../../components/Icon";

/**
 * Show single media library item in MediaLibraryModal
 * @param media
 * @param closeModal
 * @returns {*}
 * @constructor
 */
const MediaLibraryModalItem = ({media, onSelect}) => {

    const getThumbnailURL = () => {
        return media.thumbnail_url || getAsset('/img/no-thumbnail.png');
    };

    const getVideoURL = () => {
        return media.url || media.manifest_url || '';
    };


    return (
        <div className={styles.listItem}>
            <div className={styles.listItemInner}>
                <div className={styles.videoHolder}>
                    {!media.is_image ? (
                      <>
                          <VideoPlayer
                            url={getVideoURL()}
                            videoId={media.id}
                            imageURL={getThumbnailURL()}
                            controls
                            light={getThumbnailURL()} // stops preload and only shows thumbnail awesome for perf
                          />
                      </>
                    ) : (
                      <img style={{width: '100%', height: '138px'}} src={media.thumbnail_url} />
                    )}
                </div>
                <div className={styles.textHolder}>
                    <h4 style={{marginTop: '5px', marginBottom: '4px'}} className="ellipsis">{media.name}</h4>
                    <div className={styles.hearts} style={{fontSize: '13px', marginTop: '15px', marginLeft: '5px'}}>
                        {
                            (media.is_image) ?
                              <Icon name={'image'} /> :
                              <Icon name={'video'} />
                        }
                    </div>
                    <div className={styles.addButton}>
                        <Button
                            primary
                            noMarginRight={true}
                            right={true}
                            small
                            onClick={()=>onSelect(  {
                              is_image: media.is_image,
                              url: media.url,
                              manifest_url:  media.manifest_url,
                              thumbnail_url: media.thumbnail_url
                            })}
                        >
                            Select <Icon name={'arrow-right'} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MediaLibraryModalItem;
