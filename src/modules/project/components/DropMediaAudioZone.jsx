import React from 'react';
import DropMediaZone from 'modules/media/components/DropMediaZone';
import Swal from 'sweetalert2';
import AudioPlayer from "react-h5-audio-player";

const ACCEPT = ['audio/mp3'];
const EXTENSIONS = ['mp3'];

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

export default function DropMediaAudioZone({ onSuccess, onError, src, isAudio, directory, children, style }) {
    return (
        <div>
            {(src && isAudio) ? (
                <div style={{marginBottom: '20px'}}>
                    <AudioPlayer
                        src={src}
                        onPlay={e => console.log("onPlay")}
                        // other props here
                    />
                </div>
            ) : null}

            <DropMediaZone
                accept={ACCEPT}
                extensions={EXTENSIONS}
                directory={directory}
                uploadSuccessEndpoint={'file/upload'}
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