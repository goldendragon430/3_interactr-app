import React from "react";
import styles from "./MediaItem.module.scss";
import { COMPOSER_DOM_ID } from "@/graphql/LocalState/composer";
import { getRelativeDrop } from "modules/composer/dragging";
import CloneOnDrag from "components/CloneOnDrag";
import Icon from "components/Icon";
import { confirm, success, error } from "utils/alert";
import cx from "classnames";
import { Link } from "react-router-dom";
import EditMediaModal from "./mediaLibrarySidebar/_EditMediaModal";
import VimeoErrorModal from "./VimeoErrorModal";
import getAsset from "utils/getAsset";
import PropTypes from "prop-types";
import EncodeMediaItem from "./EncodingStatusUpdater";
import { EditMediaModal } from "./EditMediaModal";

const _props = {
  /** type the component is used for, ['node' , 'media' ] */
  type: PropTypes.oneOf(["media", "node"]).isRequired,
  /** media object that is required for media type */
  media: PropTypes.object,
  /** Node object because component is used for Nodes tab in Node Editor, required for node type */
  node: PropTypes.object,
  /** Required for node type , for media type it's taken from the media itself */
  thumbnail_url: PropTypes.string,

  // ========= Props from Redux store and Actions =====================

  dropMediaOnComposer: PropTypes.func,
  /** Updates the selected media in Redux for editing which
   * is needed for incomming updates (ex from pusher) to show up */
  updateSelectedMedia: PropTypes.func,
  /** Project is legacy or not*/
  isProjectLegacy: PropTypes.bool,
};

class MediaItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      editModal: false,
      vimeoError: false,
      editMediaModal: {
        editMediaName: false,
        media: null,
      },
    };
  }

  handleDragStop = (e) => {
    const acceptedDrop = getRelativeDrop(COMPOSER_DOM_ID, e);

    if (!acceptedDrop) return;
    // Make sure it's a drop on the composer

    const {
      media: { id },
      dropMediaOnComposer,
    } = this.props;

    dropMediaOnComposer(id, acceptedDrop);
  };

  hideModal = (modal) => () => {
    this.setState({ [modal]: false });
  };

  renderEditMediaModal = () => {
    const { editModal } = this.state;
    return (
      editModal && (
        <EditMediaModal
          media={this.props.selectedMedia}
          show={editModal}
          close={this.hideModal("editModal")}
        />
      )
    );
  };

  renderVimeoErrorModal = () => {
    const { vimeoError } = this.state;
    return (
      vimeoError && (
        <VimeoErrorModal
          show={vimeoError}
          close={this.hideModal("vimeoError")}
          onEditSource={() => {
            this.setState({ editModal: true, vimeoError: false });
            this.props.updateSelectedMedia(this.props.media.id);
          }}
        />
      )
    );
  };

  updateMediaName = (mediaName, mediaId) => {
    this.props.updateMediaItem(mediaId, { name: mediaName });
    this.closeModal();
  };

  editMedia = (media) => {
    this.setState({
      editMediaModal: {
        editMediaName: true,
        media,
      },
    });
  };

  closeModal = () => {
    this.setState({
      editMediaModal: {
        editMediaName: false,
        media: null,
      },
    });
  };

  editVideo = async () => {
    await this.props.updateSelectedMedia(this.props.media.id);
    this.setState({ editModal: true });
  };

  hasVimeoError = () => {
    return false;
  };

  renderMediaItems() {
    const { media, isLegacyProject } = this.props;
    const { name, manifest_url, id, thumbnail_url } = media;
    const { isDragging } = this.state;

    return (
      <div className={cx(styles.MediaItemWrapper)}>
        <CloneOnDrag
          onStop={this.handleDragStop}
          onDragging={(isDragging) => this.setState({ isDragging })}
          offset={{ x: 5, y: 0 }}
        >
          <div className={cx(styles.MediaItem, styles.draggable)}>
            {!isDragging && this.hasVimeoError() && (
              <a
                onClick={() => {
                  this.setState({ vimeoError: true });
                }}
                className={styles.vimeoError}
              >
                <Icon name="exclamation-circle" />
              </a>
            )}
            {
              // (! thumbnail_url && ! isLegacyProject) ?
              // <EncodeMediaItem  id={id} mediaName={name} isLegacyProject={isLegacyProject} />
              // :
              // this.renderImage()
            }
          </div>
        </CloneOnDrag>
        <div className={styles.mediaTitle}>
          <a onClick={this.confirmDeleteItem} className={styles.editIcon}>
            <Icon name="trash-alt" />
          </a>
          <span
            data-tip={"Click to rename"}
            onClick={() => this.editMedia(media)}
          >
            {name}
          </span>
        </div>
      </div>
    );
  }

  confirmDeleteItem = () => {
    const { id } = this.props.media;
    confirm({
      title: "Are You Sure!",
      text: "Are You Sure You Want To Delete This Video?",
      confirmButtonText: "Yes, Delete It!",
      onConfirm: async () => {
        await this.props.attemptDeleteMediaItem(id);
      },
    });
  };

  renderImage = () => {
    let { media, thumbnail_url, isLegacyProject, type } = this.props;
    if (media && !isLegacyProject) {
      const { url, stream_url } = media;
      thumbnail_url = media.thumbnail_url;

      // The backend is generating the thumbnail
      if (thumbnail_url === "" && (url || stream_url)) {
        return (
          <div className={styles.generatingThumb}>
            <Icon spin name="circle-notch" />
            <p>
              <small>Generating Thumbnail</small>
            </p>
          </div>
        );
      }
    }

    if (type === "media") {
      thumbnail_url =
        media.thumbnail_url === ""
          ? getAsset("/img/no-thumb.jpg")
          : media.thumbnail_url;
    } else if (type === "node") {
      thumbnail_url =
        thumbnail_url === "" ? getAsset("/img/no-thumb.jpg") : thumbnail_url;
    }

    return (
      <img draggable={false} className={styles.image} src={thumbnail_url} />
    );
  };

  // renderNodeItems() {
  //   const {
  //     node: { name, id, project_id, active }
  //   } = this.props;
  //   const classes = cx({
  //     [styles.MediaItem]: true,
  //     [styles.clickable]: true,
  //     [styles.active]: active
  //   });

  //   return (
  //     <div className={styles.MediaItemWrapper}>
  //       <div className={classes}>
  //         <Link to={nodePath({ nodeId: id, projectId: project_id })}>
  //           {this.renderImage()}
  //           <div className={styles.mediaTitle} style={{ textAlign: 'center' }}>
  //             {name}
  //           </div>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    const { type } = this.props;
    const { editModal, vimeoError } = this.state;

    return (
      <div>
        {editModal && this.renderEditMediaModal()}
        {vimeoError && this.renderVimeoErrorModal()}
        {type === "media" && this.renderMediaItems()}
        {type === "media" && (
          <EditMediaModal
            {...this.state.editMediaModal}
            updateMedia={this.updateMediaName}
            closeModal={this.closeModal}
          />
        )}

        {/* {type === 'node' && this.renderNodeItems()} */}
      </div>
    );
  }
}

MediaItem.propTypes = _props;
export default MediaItem;
