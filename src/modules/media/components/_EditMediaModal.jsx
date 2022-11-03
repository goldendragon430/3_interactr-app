import Icon from 'components/Icon';
import React from 'react';
import cx from 'classnames';
// import isEqual from 'lodash/isEqual';
import DocsLink from 'components/DocsLink';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
import IconButton from 'components/Buttons/IconButton';
import VideoPlayer from 'components/VideoPlayer';
import ReplaceMediaModal from './ReplaceMediaModal';
import CopyVideoModal from './CopyVideoModal';
import { confirm } from 'utils/alert';
import styles from './EditMediaModal.module.scss';
import {isYoutubeLink} from 'utils/textUtils';
import PropTypes from 'prop-types';

const _props = {
    /** Data to be filtered , must be an objects */
    media: PropTypes.object.isRequired,
    /** Show video settings modal property(boolean) */
    show: PropTypes.bool.isRequired,
    /** Gets called hideModal */
    close: PropTypes.func.isRequired,
};


class EditMediaModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showVimeoError: false,
      showReplace: false,
      showConfirm: false,
      newName: props.media.name || '',
      newHls_stream: props.media.hls_stream || '',
      newCompressed_mp4: props.media.compressed_mp4 || '',
      showCopyVideoModal: false,
      creating_hls: false,
      creating_mp4: false,
      creating_webm: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.media.name !== this.props.media.name) {
          this.setState({newName: this.props.media.name})
      }
  }

  componentWillUnmount(){
    this.props.updateSelectedMedia(null)
  }

  copyVideoDone = () => {
    this.setState({ showCopyVideoModal: false });
    this.props.close();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { media: { id}, close} = this.props;
    const { newName } = this.state;

    const item = { name: newName };

    this.props.updateMediaItem(id, item);
    close();
  };

  confirmDeleteItem = () => {
    const { id } = this.props.media;
    const { close } = this.props;
    confirm({
      title: 'Are You Sure!',
      text: 'Are You Sure You Want To Delete This Video?',
      confirmButtonText: 'Yes, Delete It!',
      onConfirm: async () => {
        await this.props.attemptDeleteMediaItem(id);
        close();
      }
    });
  };

  createStreamingVideo = () => {
    const { createVideoVersion, media } = this.props;
    this.setState({ creating_hls: true });
    createVideoVersion('hls', media.id);
  };

  createMp4Video = () => {
    const { createVideoVersion, media } = this.props;
    this.setState({ creating_mp4: true });
    createVideoVersion('mp4', media.id);
  };

  createWebmVideo = () => {
    const { createVideoVersion, media } = this.props;
    this.setState({ creating_webm: true });
    createVideoVersion('webm', media.id);
  };


  render() {
    const { media, show, close, user } = this.props;
    if (!media) return null;

    const { url, hls_stream, compressed_url, stream_url, compressed_mp4 } = media;
    const {
      newHls_stream,
      newCompressed_mp4,
      creating_hls,
      creating_mp4,
      creating_webm
    } = this.state;
    const deleteLink = {
      color: 'red',
      cursor: 'pointer',
      lineHeight: '1.8'
    };

    let source = url;
    if (hls_stream) source = hls_stream;
    // if (compressed_mp4) source = compressed_mp4; // React player sometimes doesn't recognised codecs after our compression so best preview with original url until we have better codecs support 

    return (
      <div>
        <Modal 
          show={show} 
          onClose={close} 
          height={550} 
          width={900}
          heading={
            <>
              <Icon name="cog" /> Video Setting
            </>
          }
          enableFooter={false}
        >          
          <div className="grid">
            <div className={cx(styles.leftSide, 'col6')}>
              <div style={{ marginBottom: 30 }}>
                <VideoPlayer url={source||stream_url||''} videoId={media.id} controls />
              </div>
              <div className="form-control">
                <form onSubmit={e=> e.preventDefault()}>
                  <div className="form-control">
                    <label>Name</label>
                    <input
                      placeholder="Your video name"
                      value={this.state.newName}
                      type="text"
                      autoFocus={true}
                      onChange={e => this.setState({ newName: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className={cx(styles.rightSide, 'col6')}>
              {stream_url && !url ? ( // youtube vids
                  <RenderYoutubeVideo {...media} />
              ) : (
                <div>
                  {!user.parent_user_id && ( // docs shouldn't show up for sub users
                    <p style={{ marginTop: '0px' }}>
                      <DocsLink>
                        You can update your update your conversion & compression settings in the My Account Section.
                        For more information{' '}
                        <a
                          href="https://videosuite.zendesk.com/"
                          target="_blank"
                        >
                          check out the docs here
                        </a>
                      </DocsLink>
                    </p>
                  )}
                  {/* ====== Hiding the Stream stuff while we figure it's bug in the player ========= */}
                  {/* {!!user.is_club && ( // Video Streaming section exclusive to Club users
                    <div>
                      <h3 style={{ marginBottom: '5px' }}>Streaming Video Url</h3>
                      {newHls_stream ? (
                        <span>
                          <a href={newHls_stream} target={'_blank'} download>
                            {hls_stream}
                          </a>
                          <br />
                          <a onClick={() => this.setState({ newHls_stream: '' })} style={deleteLink}>
                            Delete
                          </a>
                        </span>
                      ) : creating_hls ? (
                        <Icon spin name="circle-notch" />
                      ) : (
                        <a onClick={() => this.createStreamingVideo()}>Create Streaming Video File</a>
                      )}
                    </div>
                  )} */}
                  <div className="clearfix" />
                  <h3 style={{ marginBottom: '5px', marginTop: '20px' }}>Compressed Video Urls</h3>
                  <p style={{ marginTop: '0px' }}>
                    <strong>MP4</strong>
                    <br />
                    {compressed_mp4 ? (
                      <span>
                        <a href={compressed_mp4} target={'_blank'} download>
                          {compressed_mp4}
                        </a>
                        <br />
                        <a
                          onClick={e => {
                            this.setState({newCompressed_mp4: ''});
                          }}
                          style={deleteLink}
                        >
                          Delete
                        </a>
                      </span>
                    ) : creating_mp4 ? (
                      <Icon spin name="circle-notch" />
                    ) : (
                      <a onClick={this.createMp4Video}>Create Compressed MP4</a>
                    )}
                  </p>
                  <div className={'clearfix'} />
                  <h3 style={{ marginBottom: '5px' }}>{'Original Mp4 File'}</h3>
                  <a href={url} target={'_blank'} download>
                    {url}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <Button primary onClick={this.handleSubmit} icon="save">
              Save
            </Button>
            <Button onClick={() => this.setState({ showCopyVideoModal: true })}>
              Copy Video To Project
            </Button>
            <Button onClick={() => {this.setState({ showReplace: true })}} >
              Replace Video Source
            </Button>
            <IconButton red onClick={() => this.confirmDeleteItem()} style={{ float: 'left' }} icon="trash-alt">
              Delete Video
            </IconButton>
          </div>
        </Modal>
        <CopyVideoModal
          showCopyVideoModal={this.state.showCopyVideoModal}
          media={this.props.media}
          projects={this.props.projects}
          copyVideoDone={this.copyVideoDone}
          close={() => this.setState({ showCopyVideoModal: false })}
        />
        <ReplaceMediaModal
          media={media}
          show={this.state.showReplace}
          close={() => this.setState({ showReplace: false })}
          updateSelectedMedia={this.props.updateSelectedMedia} // not sure this needs to update selected media
        />
      </div>
    );
  }
}

EditMediaModal.propTypes = _props;
export default EditMediaModal;

function RenderYoutubeVideo({stream_url}) {
    return (
        <div>
            <h3 style={{ marginBottom: '5px' }}>Video Link</h3>
            <a href={stream_url} target={'_blank'}>
                {stream_url}
            </a>
        </div>
    );
}