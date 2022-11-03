import React, {useState}  from 'react';
import styles from "./uploadMedia/StockListModalStyles.module.scss";
import VideoPlayer from "components/VideoPlayer";
import Button from "components/Buttons/Button";
import LinkButton from "components/Buttons/LinkButton";
import _map from 'lodash/map';
import {useCreateMediaByUrl} from "../../../graphql/Media/hooks";
import {errorAlert} from "../../../utils/alert";
import {useProject} from "../../../graphql/Project/hooks";
import {addItem} from "../../../graphql/utils";
import {GET_MEDIAS} from "../../../graphql/Media/queries";
import {useMediaLibraryRoute} from "../routeHooks";
import {useAuthUser} from "../../../graphql/User/hooks";
import Icon from "../../../components/Icon";
import {getAcl} from "../../../graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";
import apis from 'utils/apis';

const StockItem = ({stockItem, user, onSelect, setFilterText, isImage}) => {
    const [uploading, setUploading] = useState(false);

    const acl = useReactiveVar(getAcl);

    const handleTagClick = tag => {
        const loading = true,
              filteredTag = tag.toLowerCase().trim();

        setFilterText(filteredTag, loading);
    };

    const getImageURL = () => {
        const {  picture_id } = stockItem;

        return import.meta.env.VITE_PIXABAY_IMAGE_ROOT + "/" + picture_id + '_' + import.meta.env.VITE_PIXABAY_IMAGE_SIZE + '.jpg';
    };

    const getVideoDuration = () => {
        let { duration } = stockItem;

        if (duration < 10) {
            duration = '0' + duration;
        }

        return `00:${duration}`;
    };

    const handleBtnSelectClick = async () => {
        setUploading(true);
        const path = await uploadFile(isImage ? "" : stockItem.videos.large.url);
        setUploading(false);
        onSelect( {
            is_image: isImage ? 1 : 0,
            temp_storage_url: path,
            // thumbnail_url: stockItem.largeImageURL,
        })
    }

    const uploadFile = async (url) => {
        const params = {
            url: url
        };
        const res = await apis.uploadFileFromUrl(params);
        return res.filePath;
    }

    if (!stockItem) return null;

    return (
        <div className={styles.listItem}>
            <div className={styles.listItemInner}>
                <div className={styles.videoHolder}>
                    {!isImage ? (
                        <>
                            <VideoPlayer
                                url={stockItem.videos.tiny.url}
                                videoId={stockItem.id}
                                imageURL={getImageURL()}
                                controls
                                playing
                                light={getImageURL() || false} // stops preload and only shows thumbnail awesome for perf
                            />
                            <span className={styles.videoDuration}>{getVideoDuration()}</span>
                        </>
                    ) : (
                        <img style={{width: '100%', height: '138px'}} src={stockItem.previewURL} />
                    )}
                </div>
                <div className={styles.textHolder}>
                    <Tags
                        handleClick={handleTagClick}
                        tagItems={stockItem.tags}
                        stockItemId={stockItem.id}
                    />
                    <Hearts count={stockItem.favorites} />
                    <div className={styles.addButton}>
                        {
                            (acl.canAccessStockFootage) ?
                                <Button
                                    primary
                                    noMarginRight={true}
                                    small
                                    right
                                    loading={uploading}
                                    onClick={handleBtnSelectClick}
                                >
                                    { uploading ? "Uploading " : "Select "}
                                    {
                                        uploading ? <Icon name="spinner-third" spin={uploading} /> : <Icon name="arrow-right" />
                                    }
                                </Button> :
                                <LinkButton
                                    primary
                                    right
                                    noMarginRight={true}
                                    small
                                    to="/upgrade"
                                >
                                    Upgrade
                                </LinkButton>
                        }
                    </div>
                </div>
            </div>

        </div>
    );
};

const Tags = ({tagItems, stockItemId, handleClick}) => {
    const tags = tagItems.split(',');

    return (
      <div className={styles.tagHolder}>
          {
              _map(tags, tag => (
                <small
                  onClick={() => handleClick(tag)}
                  key={Math.random() * stockItemId}
                  className={styles.tag}
                >
                  {tag},
                </small>
              ))
          }
      </div>
    )
};

const Hearts = ({count}) => {
    return(
      <div className={styles.hearts}>
          <Icon name={'heart'} /> {count}
      </div>
    )
}

export default StockItem;
