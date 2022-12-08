import React from 'react';
import Swal from 'sweetalert2';
import Dropzone from 'react-dropzone-uploader';
import { getToken } from '@/modules/auth/utils';

const ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];
const EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif'];

const handleError = (error) => {
	Swal.fire({
		title: 'Upload failed',
		text: error,
		icon: 'warning',
		confirmButtonColor: '#ff6961',
		confirmButtonText: 'Got it!',
	});
};
const handleSuccess = () => {
	Swal.fire({
		title: 'Success',
		text: 'Upload successful',
		icon: 'success',
		confirmButtonText: 'Got it!',
	});
};

export default function DropImageZone({
	onSuccess,
	onError = null,
	src,
	width = null,
	height = null,
	heading = 'Drag and drop here',
}) {
	
	let imageStyles = {
		height: height ?? height,
		marginBottom: '15px',
		padding: '10px',
		textAlign: 'center',
		width: width ?? width,
		overflow: 'hidden'
	};

	const handleChangeStatus = (
		{ meta, file, remove, xhr, ...restOfData },
		status
	) => {
		switch (status) {
			case 'preparing':
				break;
			case 'error_upload':
				onError ? onError('There was a problem trying to upload this file.') : handleError('There was a problem trying to upload this file.');
				break;
			case 'rejected_file_type':
				onError ? onError('Invalid extension') : handleError('Invalid extension');
				break;
			case 'aborted':
				break;
			case 'header_received':
				break;
			case 'done':
				handleSuccess();
				onSuccess({ src: xhr.response }, remove, file);
				remove();
				break;
			default:
				break;
		}
	};

	const getUploadParams = ({ meta }) => {
		const token = getToken();
		return {
			url: import.meta.env.VITE_API_URL + '/api/upload/image',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
	};

	return (
		<div>
			{src && (
				<div style={imageStyles} className='transparentBackground'>
					<img src={src} style={{ maxWidth: '100%', maxHeight: '150px' }} />
				</div>
			)}

			<Dropzone
				getUploadParams={getUploadParams}
				onChangeStatus={handleChangeStatus}
				accept={'image/*'}
				maxFiles={1}
				multiple={false}
				canCancel={false}
				inputContent={
					heading ? (
						<h4
							style={{
								textAlign: 'center',
								textTransform: 'uppercase',
								fontWeight: 800,
							}}
						>
							{heading} <br />
							<small style={{ textTransform: 'uppercase', fontWeight: 300 }}>
								or click here to browse your computer
							</small>
						</h4>
					) : (
						'Select from picker or drop files here to upload'
					)
				}
				styles={{
					dropzone: { overflow: 'auto', height: 100, borderStyle: 'dashed' },
					inputLabel: { color: '#8c8e90' },
				}}
			/>
		</div>
	);
}
