import React from 'react';
import {
  addMediaUrl,
  receiveMediaItem,
  updateMediaItem,
  editMediaUrl,
  updateMediaUploadingState
} from 'modules/media/media';
import { uploadingSelector } from 'modules/media/mediaSelectors';
import Icon from 'components/Icon';
import styles from './UploadMedia.module.scss';
import DropMediaZone from '../DropMediaZone';
import Swal from 'sweetalert2';
import ReactTooltip from 'react-tooltip';
import StockListModal from 'modules/media/components/StockListModal';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal';
import cx from 'classnames';
import PropTypes from 'prop-types';
import MediaLibraryModal from "./MediaLibraryModal";

/** Props */
const _props = {
  show: PropTypes.bool.isRequired,
  /** should toggle the value for show prop in parent state */
  toggleMediaZone: PropTypes.func.isRequired,
  /** Current Project selected , passed from selector */
  project: PropTypes.object,
  /** Is required for replacing a media  */
  mediaToReplace: PropTypes.object,
  /** Gets called after media succesfully uploaded */
  onDone: PropTypes.func
};

@connect(
  projectSelector,
  {}
)
@connect(
  uploadingSelector,
  { addMediaUrl, editMediaUrl, receiveMediaItem, updateMediaItem, updateMediaUploadingState }
)
class _UploadMediaButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      image: null,
      showStockList: false,
      showMediaLibrary: false,
      mediaType: props.showUploadFileArea ? 'file' : '',
      open: false
    };
  }


  componentDidUpdate(prevProps) {
    if (!this.props.uploading && prevProps.uploading) {
      this.setState({
        open: false,
        mediaType: ''
      });
    }

    if (this.props.showUploadFileArea && this.state.mediaType !== 'file') {
      this.setState({
        mediaType: 'file'
      })
    }
  }

  handleUrlInputSubmit = e => {
    const { mediaToReplace, editMediaUrl, onDone, project } = this.props;
    e.preventDefault();

    const { value } = this.urlInput;
    this.urlInput.value = '';

    // check it's an https
    if (!value.startsWith('https:')) {
      Swal.fire({
        title: 'Error',
        text: 'Resources must be over https!',
        icon: 'error',
        confirmButtonColor: '#ff6961',
        confirmButtonText: 'Got it!'
      });
      return;
    }

    if (! this.isLegacyProject() && (value.includes('youtube') || value.includes('youtu.be'))) {
      Swal.fire({
        title: 'Error',
        text: 'Youtube link is not supported.',
        icon: 'error',
        confirmButtonColor: '#ff6961',
        confirmButtonText: 'Got it!'
      });
      return;
    }

    if (mediaToReplace) {
      editMediaUrl(value, { projectId: mediaToReplace.project_id, mediaId: mediaToReplace.id }, onDone);
    } else {
      this.addMediaUrl(value);
    }
  };

  addMediaUrl = (url, thumbnail_url, name = false) => {
    this.props.addMediaUrl(url, { thumbnail_url, projectId: this.props.project.id, name });
  };

  handleUploadError = error => {
    Swal.fire({
      title: 'Upload failed',
      text: error,
      icon: 'warning',
      confirmButtonColor: '#ff6961',
      confirmButtonText: 'Got it!'
    });
  };

  handleUploadSuccess = ({ item }) => {
    const { mediaToReplace, receiveMediaItem, updateMediaItem, onDone } = this.props;
    if (mediaToReplace) {
      updateMediaItem(mediaToReplace.id, item, false);
      setTimeout(() => {
        if (onDone) onDone();
      }, 2000);
    } else {
      receiveMediaItem(item, item.project_id);
    }
    Swal.fire({
      title: 'Success',
      text: 'Media Successfully added, We will now encode your video for use in interactr.',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    this.setState({
      open: false,
      mediaType: ''
    });
  };

  showStockList = () => {
    this.setState({ showStockList: true });
  };

  showMediaLibrary = () => {
    this.setState({ showMediaLibrary: true });
  };

  hideStockList = () => {
    this.setState({ showStockList: false });
  };

  hideMediaLibrary = () => {
    this.setState({ showMediaLibrary: false });
  };

  toggleMediaZone = () => {
    // Add a delay here so the ui doesn't visually change before the upload zone closes
    const timeout = this.state.mediaType ? 0 : 400;
    if (this.state.open) {
      setTimeout(() => {
        this.setState({ mediaType: '' });
      }, timeout);
    }

    if(! this.state.mediaType || this.props.mediaLibraryPage) {
      // only close if not selected a type. if type is selected cancel button should go back not close
      this.setState({ open: !this.state.open });
    }
  };

  setMediaType = mediaType => () => {
    this.setState({ mediaType });
  };

  isLegacyProject = () => {
    const {project} = this.props;
    return (project) ? (project.legacy === 1) : false;
  };

  renderMediaType = () => {
    if(this.isLegacyProject()){
      return (
          <div>
            {/* <ReactTooltip /> */}
            <ul className={styles.mediaSelect_wrapper}>
              <li data-tip="Upload Video" onClick={this.setMediaType('file')}>
                <Icon name={'cloud-upload'} />
              </li>
              <li data-tip="Add Video Url" onClick={this.setMediaType('url')}>
                <Icon name={'link'} />
              </li>
              <li data-tip="Youtube Video" onClick={this.setMediaType('youtube')}>
                <Icon name={['fab', 'youtube']} />
              </li>
              <li data-tip="Vimeo Video" onClick={this.setMediaType('vimeo')}>
                <Icon name={['fab', 'vimeo']} />
              </li>
              {/* Hide while replacing a video */}
              {!this.props.mediaToReplace && ! (! this.props.user.evolution_pro && this.props.user.parent_user_id ) &&
                (  <li data-tip="Stock Video" onClick={this.showStockList}>
                    <Icon name={'video'} />
                  </li>
              )}
              <li data-tip="From Media Library" onClick={this.showMediaLibrary}>
                <Icon name="photo-video" />
              </li>
            </ul>
          </div>
      );
    }

    return (
        <ul className={styles.new_media_select_wrapper}>
          <li data-tip="Upload Video" onClick={this.setMediaType('file')}>
            <Icon name={'cloud-upload'} size="2x"  />
            <p>Upload a video </p>
          </li>
          <li data-tip="Add Video Url" onClick={this.setMediaType('url')}>
            <Icon name={'link'} size="2x" />
            <p>Add Video From URL</p>
          </li>
          {/* Hide while replacing a video */}
          {!this.props.mediaToReplace && ! (! this.props.user.evolution_pro && this.props.user.parent_user_id ) && (
              <li data-tip="Stock Video" onClick={this.showStockList}>
                <Icon name={'video'} size="2x" />
                <p>Add Stock Video</p>
              </li>
          )}
          <li data-tip="From Media Library" onClick={this.showMediaLibrary}>
            <Icon name="photo-video" size="2x" />
            <p>From Media Library</p>
          </li>
        </ul>
    );
  };

  renderUploadArea = () => {
    const { mediaType } = this.state;

    switch (mediaType) {
      case 'file':
        return this.renderFileUploadArea();
      case 'url':
        return this.renderThirdPartyUploadArea({
          label: 'Mp4 File Url',
          helpUrl: 'http://google.com',
          placeholder: 'ex. https://your/video/file/source.mp4'
        });
      case 'youtube':
        return this.renderYotubeUpload();
      case 'vimeo':
        return this.renderVimeoUpload();
    }
  };

  renderFileUploadArea = () => {
    const { mediaToReplace, project, updateMediaUploadingState, mediaLibraryPage } = this.props;

    let dropzoneParams = {
      projectId: project && project.id
    };
    let uploadUrl = 'media/upload';

    if (mediaToReplace) {
      // override selected proejct from store with specific media project
      dropzoneParams.projectId = mediaToReplace.project_id;
      dropzoneParams.mediaReplacementId = mediaToReplace.id;
    }

    if (mediaLibraryPage) {
      uploadUrl = "user/media/upload";
    }

    return (
      <DropMediaZone
        onError={this.handleUploadError}
        onSuccess={this.handleUploadSuccess}
        uploadSuccessEndpoint={uploadUrl}
        params={dropzoneParams}
        updateMediaUploadingState={updateMediaUploadingState}
      />
    );
  };

  renderYotubeUpload = () => {
    return this.renderThirdPartyUploadArea({
      label: 'Youtube Url',
      helpUrl: 'http://google.com',
      placeholder: 'ex. https://www.youtube.com/watch?v=ayB1wLMmF9c'
    });
  };

  renderVimeoUpload = () => {
    return this.renderThirdPartyUploadArea({
      label: 'Vimeo Url',
      helpUrl: 'http://google.com',
      placeholder: 'ex. https://player.vimeo.com/external/255113017.hd.mp4'
    });
  };

  renderThirdPartyUploadArea = ({ label, helpUrl, placeholder }) => {
    return (
      <form onSubmit={this.handleUrlInputSubmit} style={{ position: 'relative', textAlign: 'left' }}>
        <label>{label} </label>
        <input style={{ marginBottom: '0' }} type="text" ref={ref => (this.urlInput = ref)} placeholder={placeholder} />
        <Button
          style={{
            textAlign: 'right',
            float: 'right',
            fontSize: '85%',
            marginTop: '5px'
          }}
          onClick={this.handleUrlInputSubmit}
          icon="plus"
          primary
          small
        >
          Add
        </Button>
        <video id='video'></video>
        <canvas id="canvas"></canvas>
      </form>
    );
  };

  UploadModal = () => {
    const { uploading, showUploadFileArea } = this.props;
    const { showStockList, mediaType, open } = this.state;
    return (
      <Modal 
        show={open} 
        onClose={this.toggleMediaZone} 
        height={300} 
        width={550}
        heading={
          <>
            <Icon name="cloud-upload" /> Upload
          </>
        }
      >
        <div style={{ paddingTop: 40, position: 'relative', height: 200 }}>
          {uploading ? (
            <div className={styles.uploading}>
              <Icon spin name="circle-notch" />
              <p>Adding To Project</p>
            </div>
          ) : !mediaType ? (
            this.renderMediaType()
          ) : (
            this.renderUploadArea()
          )}
        </div>
      </Modal>
    );
  };
  render() {
    const { open, showStockList, showMediaLibrary } = this.state;
    const {mediaLibraryPage, project} = this.props;
    // const inlineStyles = (showInModal) ? {} : {position:'relative', left: 0, transition: '0.2s ease all'};

    const wrapperClass = cx(styles.addMediaWrapper, {
      [styles.addMediaWrapper_open]: open
    });

    return (
      <div className={this.props.className}>
        <div className={wrapperClass}>
          <Button primary small onClick={this.toggleMediaZone}>
            <Icon name="cloud-upload-alt" /> Upload
          </Button>
        </div>
        <StockListModal
            projectId={project && project.id}
            showStockList={showStockList}
            close={this.hideStockList}
        />
        <MediaLibraryModal
            addMediaUrl={this.addMediaUrl}
            showMediaLibrary={showMediaLibrary}
            close={this.hideMediaLibrary}
            isLegacyProject={this.isLegacyProject()}
        />
        {open && (! showStockList && ! showMediaLibrary) && this.UploadModal()}
      </div>
    );
  }
}

export default _UploadMediaButton;
