import apis from "../../utils/apis";
import axios from "axios";

export const uploadFileToS3 = async (base64, contenttype = 'image/png') => {

  const meta = {
    name: 'chris.png',
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  }

  const presignReq = await apis.presignS3Url(meta)
  const { signedURL, filePath } = await presignReq.json();

  const file = dataURItoBlob(base64);

  const req = await axios.put(signedURL, file, {
    headers: {
      'Content-Type': "image/png",
    }
  });

  return "https://interactr-uploads.s3.us-east-2.amazonaws.com/" + filePath
};

function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}