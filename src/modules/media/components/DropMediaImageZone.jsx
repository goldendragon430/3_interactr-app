import React from 'react';
import DropMediaZone from 'modules/media/components/DropMediaZone';
import Swal from 'sweetalert2';
import VideoPlayer from 'components/VideoPlayer';

const ACCEPT = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
const EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif'];

const handleError = error => {
    Swal.fire({
        title: 'Upload failed',
        text: error,
        icon: 'warning',
        confirmButtonColor: '#ff6961',
        confirmButtonText: 'Got it!'
    });
};
const handleSuccess = () => {
    Swal.fire({
        title: 'Success',
        text: 'Upload successful',
        icon: 'success',
        confirmButtonText: 'Got it!'
    });
};

export default function DropMediaImageZone({ onSuccess, onError, src, isVideo, directory, children, style }) {
    return (
        <div>
            {(src && !isVideo) ? (
                <div style={{ marginBottom: '15px' }} className="transparentBackground">
                    <img src={src} style={{ maxWidth: '100%' }} />
                </div>
            ) : null}

            {(src && isVideo) ? (
                <div style={{ marginBottom: '15px' }} className="transparentBackground">
                    <VideoPlayer
                        url={src}
                        videoId={1}
                        volume={0}
                        muted
                        loop
                        playing
                    />
                </div>
            ) : null}

            <DropMediaZone
                accept={ACCEPT}
                extensions={EXTENSIONS}
                directory={directory}
                uploadSuccessEndpoint={'image/upload'}
                onSuccess={onSuccess || handleSuccess}
                onError={onError || handleError}
                heading={src ? 'Drop here to replace' : 'Drag and drop here'}
                inlineStyles={style}
            >
                {children}
            </DropMediaZone>
        </div>
    );
}
