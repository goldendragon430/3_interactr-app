import React from 'react';
import DropMediaZone from 'modules/media/components/DropMediaZone';
import Swal from 'sweetalert2';

const ACCEPT = ["image/*", "video/*", "application/zip", "application/octet-stream", "application/x-zip", "application/x-zip-compressed"];
const EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'zip', 'mp4'];


const handleError = error => {
    Swal.fire({
        title: 'Upload failed',
        text: error,
        icon: 'warning',
        confirmButtonColor: '#ff6961',
        confirmButtonText: 'Got it!',
    });
};

export default function DropFileZone(props) {
    const {
        onSuccess,
        onError,
        src,
        directory,
        children,
        style,
        uploadSuccessEndpoint,
        initialFiles,
    } = props;

    return (
        <div>
            <DropMediaZone
                accept={ACCEPT}
                extensions={EXTENSIONS}
                directory={directory}
                uploadSuccessEndpoint={uploadSuccessEndpoint}
                onSuccess={onSuccess}
                onError={handleError || onError}
                heading={src ? 'Drop here to replace' : 'Drag and drop here'}
                children={children}
                inlineStyles={style}
                initialFiles={initialFiles}
            />
        </div>
    );
}
