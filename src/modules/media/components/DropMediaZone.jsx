import React from 'react';
import Dropzone from 'react-dropzone-uploader';
import PropTypes from 'prop-types';
import apis from 'utils/apis';

const _proptypes = {
  /** aceepted types */
  accept: PropTypes.array.isRequired,
  /** Relative BE endpoint called with post requests after file succesfully uploaded to S3,
   * params object is passed as body for this request
   */
  uploadSuccessEndpoint: PropTypes.string.isRequired,
  /** Params passed to request on Upload to s3 succesful */
  params: PropTypes.object.isRequired,
  /** s3 child folder inside of the temp folder ie: `temp/media/uniqueFileName.mp4 */
  directory: PropTypes.string.isRequired,
  heading: PropTypes.string,
  /** updates the media uploading state in store */
  updateMediaUploadingState: PropTypes.func
};

export default class DropMediaZone extends React.Component {
  static defaultProps = {
    accept: ['video/mp4'],
    extensions: ['mp4'],
    uploadSuccessEndpoint: 'media/upload',
    directory: 'media',
    heading: 'Drag and drop here',
    params: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      multipartUploading: false,
      multipartUploadProgress: 0
    }
  }

  bigFile = file => file.size >= 80 * 1000 * 1000;

  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  formatDuration = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const dateString = date.toISOString().slice(11, 19);
    if (seconds < 3600) return dateString.slice(3);
    return dateString
  };


  handleError = message => {
    console.error(message);
    this.props.onError && this.props.onError(message);
  };

  startMultipartUpload = async ({file, meta}) => {
    return await apis.startMultipartUpload(meta);
  };

  uploadMultipartFile = async (file, fileName, uploadId) => {
    try {
      // console.log('Inside uploadMultipartFile');
      const FILE_CHUNK_SIZE = 10 * 1000 * 1000; // 10MB
      const fileSize = file.size;
      const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;
      let uploadPartsArray = [];
      let start, end, blob;
      let chunkProgress = 0;

      for (let index = 1; index < NUM_CHUNKS + 1; index++) {
        start = (index - 1) * FILE_CHUNK_SIZE;
        end = (index) * FILE_CHUNK_SIZE;
        blob = (index < NUM_CHUNKS) ? file.slice(start, end) : file.slice(start);

        // (1) Generate pre-signed URL for each part
        const { signedURL } = await apis.presignS3MultipartUrl({
          fileName: fileName,
          partNumber: index,
          uploadId: uploadId
        });
        // console.log('   Presigned URL ' + index + ': ' + signedURL + ' filetype ' + file.type);

        // (2) Puts each file part into the storage server
        const responseHeaderEtag = await apis.uploadFilePart(signedURL, blob, {
          headers: {
            'Content-Type': file.type
          },
          onUploadProgress: e => {
            /**
             * Calc each percent by given file size
             * To get file size chunk part size, we divide file size to the FILE_CHUNK_SIZE, we set file chunk size to 10 MB
             *
             * Example:
             * 50 MB - get chunks length(50 / FILE_CHUNK_SIZE(10) = 5) and set percent as number -> 100 / 5 = 20 -> increase each percent by 20%
             * 0.5 GB = 500 MB - get chunks length(500 / FILE_CHUNK_SIZE(10) = 50) and set percent as number -> 100 / 50 = 1.8 -> increase each percent by 1.8% float number
             * 5 GB = 5000 MB - get chunks length(5000 / FILE_CHUNK_SIZE(10) = 500) and set percent as number -> 100 / 500 = 0.2 -> increase each percent by 0.2% float number
             * ...
             * ...
             */
            let percent = ((e.loaded * 100) / e.total) / NUM_CHUNKS;
            percent = parseFloat(percent);

            let partProgress = chunkProgress;

            // If chunk request has been completed, update chunkProgress by the last time
            // If not just make adjustment for current progress loading
            if (e.loaded === FILE_CHUNK_SIZE || e.loaded === e.total) {
              chunkProgress += percent;
              partProgress = chunkProgress;
            } else {
              partProgress = chunkProgress + percent;
            }

            this.setState({
              multipartUploadProgress: partProgress
            });
          }
        });

        uploadPartsArray.push({
          ETag: responseHeaderEtag,
          PartNumber: index
        });
      }

      // (3) Calls the CompleteMultipartUpload endpoint in the backend server
      let completeUploadResp = await apis.completeMultipartUpload({
        fileName,
        parts: uploadPartsArray,
        uploadId
      });
      
      if (completeUploadResp.hasOwnProperty('Key')) {
        const filePath = completeUploadResp.Key;
        this.completeDropzoneUploading(filePath);
      }
    } catch(err) {
      console.log(err)
    }
  };

  defaultUploadRequest = async ({file, meta}) => {
    const response = await apis.presignS3Url(meta);
    // const { filePath, fields, url } = await response.json();
    const { signedURL, filePath } = await response.json();

    // Dropzone default put request
    return {
      // 👇 required as default is a post which would only be used in multi part uploads and also needs
      // backend signature to adjust for it => @todo
      method: 'PUT',
      url: signedURL,
      // body: file,
      // url: uploadUrl,
      body: file,
      // url,
      // fields,
      // 👇 required to add file path in s3 into the meta object for access later in the status listeners
      meta: { filePath }
    };
  };

  // specify upload params and url for your files
  getUploadParams = async ({ file, meta }) => {
    try {
      // if file size is bigger > 80 MB -> perform multipart uploading by chunks
      if (this.bigFile(file)) {
        this.setState({multipartUploading: true});
        /**
         * STEP 1
         * Start big file multipart uploading
         */
        const {uploadId, filePath} = await this.startMultipartUpload({file, meta});

        /**
         * STEP 2
         * As we successfully get s3 bucket uploadId, we can start uploading file by chunks
         */
        await this.uploadMultipartFile(file, filePath, uploadId);
        return {};
      }
      // make simple uploading by presigned url
      const res = await this.defaultUploadRequest({file, meta});;
      return res;
    } catch (err) {
      if(__DEV__) console.error('signing s3 upload error\n', err)
      this.handleError(
        "We're having problems uploading this file,\n try again later and contact support if problem continues!"
      );
    }
  };

  completeDropzoneUploading = (filePath, remove = null, file) => {
    const { params, onSuccess, uploadSuccessEndpoint, directory, tempUpload } = this.props;
    const updateMediaUploadingState = this.props.updateMediaUploadingState;

    updateMediaUploadingState && updateMediaUploadingState(true);

    if(tempUpload) {
      // Sometimes we don't want to move from the temp uploads folder to the
      // permanent bucket so we use the temp upload prop to keep the file in
      // temporary storage so we mock the response that would normally be returned
      // from the phpApi
      onSuccess(
        {
          src:  "https://interactr-uploads.s3.us-east-2.amazonaws.com/" + filePath,
          success: true
        }, file
      );
      remove && remove();
    }
    else {
      apis.phpApi(uploadSuccessEndpoint, {
        method: 'post',
        body: {
          s3FilePath: filePath,
          ...params
        }
      })
        .then(res => res.json())
        .then(jsonRes => {
          onSuccess(jsonRes, file);
          remove && remove();
        })
        .catch(err => {
          updateMediaUploadingState && updateMediaUploadingState(false);
          if(__DEV__) console.error('problem while uploading new file s3 details to backend\n', err)
          this.handleError('Something went wrong!');
        });
    }
  };

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file, remove, ...restOfData }, status) => {
    const { directory } = this.props;
    switch (status) {
      case 'preparing':
        return { meta: { s3Directory: directory } };
      case 'error_upload':
        this.handleError('There was a problem trying to upload this file.');
        break;
      case 'rejected_file_type':
        this.handleError('Invalid extension');
        break;
      case 'aborted':
        break;
      case 'header_received':
        break;
      case 'done':
        this.completeDropzoneUploading(meta.filePath, remove, file);

        break;
      default:
        break;
    }
    // console.log(status, meta, restOfData);
  };

  renderDropZone() {
    const { accept, heading, initialFiles } = this.props;
    const { multipartUploading, multipartUploadProgress } = this.state;
    return (
      <Dropzone
        getUploadParams={this.getUploadParams}
        onChangeStatus={this.handleChangeStatus}
        accept={accept.join(',')}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        initialFiles={initialFiles}
        inputContent={heading ? (
            <h4 style={{textAlign: 'center', textTransform: 'uppercase', fontWeight:800}}>
              {heading} <br/>
              <small style={{textTransform: 'uppercase',fontWeight:300}}>or click here to browse your computer</small>
            </h4>
        ) : 'Select from picker or drop files here to upload'}
        styles={{
          dropzone: { overflow: 'auto', height: 100, borderStyle: 'dashed' },
          inputLabel: { color: '#8c8e90' }
        }}
        PreviewComponent={multipartUploading ? (({fileWithMeta}) => {
          const { file, meta } = fileWithMeta;
          
          const duration = this.formatDuration(meta.duration);
          const size = this.formatBytes(file.size);
          const sizeAndDuration = `${duration}, ${size}`;
          const title = file.name;

          return (
              <div className="dzu-previewContainer">
                <span className="dzu-previewFileName">
                  {title} <br />
                  {sizeAndDuration}
                </span>
                <div className="dzu-previewStatusContainer">
                  <progress max="100" value={multipartUploadProgress} />
                </div>
              </div>
          );
        }) : undefined}
      />
    );
  }

  render() {
    return <div className={this.props.className}>{this.renderDropZone()}</div>;
  }
}
