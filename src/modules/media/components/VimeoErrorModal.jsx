import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
import Icon from 'components/Icon';
import VideoPlayer from 'components/VideoPlayer';

export default function({ show, close, onEditSource }) {
  return (
    <Modal 
      show={show} 
      onClose={close} 
      height={600} 
      width={700}
      heading={
        <>
          <Icon name="exclamation" /> Vimeo API Issue
        </>
      }
      submitButton={
        <Button primary onClick={onEditSource}>
          Enter MP4 Url Now
        </Button>
      }
    >
      <div>
        <p>
          Vimeo does not allow interactive video playback through the Vimeo API. If you have a Vimeo Pro account you
          can still use Vimeo videos by providing the path to your MP4 file hosted on Vimeo. Watch the video below to
          find out how to do this.
        </p>
        <VideoPlayer url="https://vimeo.com/253278931" videoId={1}  />
      </div>
    </Modal>
  );
}
