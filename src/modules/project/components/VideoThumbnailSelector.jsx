import React from 'react';
import DropImageZone from 'modules/media/components/DropImageZone';
import styles from './VideoThumbnailSelector.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
import Modal from 'components/Modal';
import filter from 'lodash/filter';
import Button from 'components/Buttons/Button';
import PlayThumbnailCard from './PlayThumbnailCard';
import playThumbnailList from 'utils/customVideoThumbnails';


export default class VideoThumbnailSelector extends React.Component {
  constructor() {
    super();

    this.state = {
      showUploadThumbnailModal: false,
      showSelectThumbnailFromVideoModal: false,
      showSelectPlayThumbnail: false,
      selectedVideo: { id: 0 },
      videosForSelect: [],
      player: {},
      createdSelect: false,
    };
  }

  componentDidMount() {
    let videosFormattedForDropdown = [];

    this.props.projectVideos.forEach((video) => {
      if (video.url.endsWith('.mp4')) {
        videosFormattedForDropdown.push({
          name: video.name,
          id: video.id,
          clearableValue: false,
          play_thumbnail_url: video.thumbnail_url,
        });
      }
    });
    this.setState({ videosForSelect: videosFormattedForDropdown, createdSelect: true });
  }

  handleUpload = (options) => {
    this.props.updateProject({ image_url: options.src, id: this.props.project.id });
  };

  handleChooseThumbnail = async () => {
    const time = this.state.player.currentTime();
    const { project, generateProjectThumbnail, setThumbnailAsGenerating } = this.props;
    generateProjectThumbnail(project.id, time, this.state.selectedVideo.url, () => {
      this.setState({ showSelectThumbnailFromVideoModal: false });
    });

    setThumbnailAsGenerating && setThumbnailAsGenerating();
  };

  handleSelectPlayThumbnail = (options) => {
    this.setState(
      {
        showSelectPlayThumbnail: false,
        showSelectThumbnailFromVideoModal: false,
      },
      () => this.handleUpload(options)
    );
  };

  renderUploadThumbnailModal = () => {
    return (
      <Modal
        show={this.state.showUploadThumbnailModal}
        height={350}
        onClose={() => this.setState({ showUploadThumbnailModal: false })}
        heading={
          <>
            <Icon name="cloud-upload" /> Upload Custom Thumbnail
          </>
        }
      >
        <DropImageZone
          onSuccess={this.handleUpload}
          directory="thumbnails"
          style={{ height: '265px' }}
        >
        </DropImageZone>
      </Modal>
    );
  };

  selectVideo = (selected) => {
    // Default if we don't find a video
    const template = { id: 0 };
    let video = [];

    if (this.props.projectVideos) {
      video = filter(this.props.projectVideos, { id: selected.value });
    }
    const newVideo = video.length ? video[0] : template;

    this.setState({
      selectedVideo: newVideo,
    });
  };

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  useFrameForThumbnail = (e) => {
    e.preventDefault();
    this.vid && this.vid.pause();
    this.handleChooseThumbnail();
  };

  renderSelectThumbnailFromVideoModal() {
    const { nodes, user } = this.props;
    const { showSelectThumbnailFromVideoModal } = this.state;

    const thumbnails = nodes
      .filter((node) => node.media && node.media.thumbnail_url)
      .map((node) => ({
        id: node.id,
        name: node.name,
        play_thumbnail_url: node.media.thumbnail_url,
      }));

    return (
      <Modal
        show={showSelectThumbnailFromVideoModal}
        width={1010}
        height={720}
        onClose={() => this.setState({ showSelectThumbnailFromVideoModal: false })}
        heading={
          <>
            <Icon name="image" /> Select The Thumbnail To Use
          </>
        }
      >
        <div className={styles.videoLibraryListWrapper}>
          {thumbnails.map((thumbnail) => (
            <PlayThumbnailCard
              thumbnail={thumbnail}
              showSelectThumbnailFromVideoModal={showSelectThumbnailFromVideoModal}
              onSelect={this.handleSelectPlayThumbnail}
              user={user}
            />
          ))}
        </div>
      </Modal>
    );
  }

  renderSelectTemplateModal = () => {
    const { user } = this.props;
    const { showSelectPlayThumbnail } = this.state;
    return (
      <Modal
        show={showSelectPlayThumbnail}
        width={1010}
        height={720}
        onClose={() => this.setState({ showSelectPlayThumbnail: false })}
        heading={
          <>
            <Icon name="image" /> Choose Play Thumbnail
          </>
        }
      >
        <div className={styles.videoLibraryListWrapper}>
          {playThumbnailList.map((thumbnail) => (
            <PlayThumbnailCard
              thumbnail={thumbnail}
              showSelectPlayThumbnail={showSelectPlayThumbnail}
              onSelect={this.handleSelectPlayThumbnail}
              user={user}
            />
          ))}
        </div>
      </Modal>
    );
  };

  render() {
    const { value } = this.props;

    return (
      <div style={{ marginTop: '20px' }}>
        {/*<h2 className="form-heading">Thumbnail</h2>*/}
        <div className="form-control">
          <h3 className="form-heading" style={{ marginBottom: '10px' }}>
            Video Thumbnail
          </h3>
          <div className={styles.thumbnail}>
            <ul className={cx(styles.list, 'grid')}>
              <li className={styles.heading}>Current</li>
              <li className={styles.heading}>Choose</li>
              <li className={styles.heading}>Upload</li>
              {this.props.user.evolution_pro === 1 && <li className={styles.heading}>Templates</li>}
            </ul>
            <ul className={styles.list}>
              <li className={cx(styles.item, styles.current)}>
                {value && <img src={value} />}
                {!value && (
                  <div className={styles.generatingThumb}>
                    <Icon spin name="circle-notch" />
                  </div>
                )}
              </li>
              <li className={styles.item} onClick={() => this.setState({ showSelectThumbnailFromVideoModal: true })}>
                <Icon name="image" />
              </li>
              <li
                className={cx(styles.item, styles.upload)}
                onClick={() => this.setState({ showUploadThumbnailModal: true })}
              >
                <Icon name="cloud-upload" />
              </li>
              {this.props.user.evolution_pro === 1 && (
                <li className={styles.item} onClick={() => this.setState({ showSelectPlayThumbnail: true })}>
                  <Icon name="image" />
                </li>
              )}
            </ul>
          </div>
        </div>

        {this.renderUploadThumbnailModal()}
        {this.renderSelectThumbnailFromVideoModal()}
        {this.renderSelectTemplateModal()}
      </div>
    );
  }
}
