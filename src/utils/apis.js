// import isomorphicFetch from 'isomorphic-fetch';
import axios from 'axios';
import { getToken } from '@/modules/auth/utils';

function apiWithRoot(rootApiUrl) {
    return async function _api(url, options = {}, ...args) {
        options.headers = options.headers || {};

        if (options.body && !(options.body instanceof FormData)) {
            options.body = JSON.stringify(options.body);
            options.headers['Content-Type'] = 'application/json';
            options.headers['Accept'] = 'application/json';
        }

        // Add auth token
        const token = getToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            // If needs to customize API ROOT url, set {customRootUrl: true} in options;
            if (!options.customRootUrl) {
                url = rootApiUrl + url;
            }

            const response = await fetch(url, options, ...args);
            if (response.ok) return response ;
            else { // request failed
                const errorResponse = {status: response.status, statusText : response.statusText}
                try {
                    const data = await response.json() // get the potential error json
                    return Promise.reject({...errorResponse, data});

                } catch (error) {
                    // no valid json returned as error , so just return statusText
                    return Promise.reject({...errorResponse, data : {error: response.statusText}})
                }
            }
        } catch (error) {
            // Only reaches here if there's Network error like wrong http method or offline etc...
            if(__DEV__) console.warn('Error from api fetch \n', error)
            return Promise.reject({status: 0, data : { error : 'Network Error'}});
        }
    }

}

export const phpApi = apiWithRoot(import.meta.env.VITE_API_URL + '/api/');
export const nodeApi = apiWithRoot(import.meta.env.VITE_UPLOAD_COMPANION_URL);

export default {
    phpApi,
    nodeApi,
    async presignS3Url(fileMeta) {
        return await nodeApi('s3/sign', {
            method: 'post',
            body: {
                ...fileMeta,
            },
        });
    },
    async startMultipartUpload(fileMeta) {
        const response = await nodeApi('s3/start-multipart-upload', {
            method: 'post',
            body: {
                ...fileMeta,
            },
        });

        return await response.json();
    },

    async presignS3MultipartUrl(params) {
        const response = await nodeApi('s3/sign/multipart-upload', {
            method: 'post',
            body: {
                ...params,
            },
        });

        return await response.json();
    },

    async uploadFilePart(url, file, config) {
        const response = await axios.put(url, file, config);

        return response.headers.etag;
    },

    async completeMultipartUpload(params) {
        const response = await nodeApi('s3/complete-multipart-upload', {
            method: 'post',
            body: {
                ...params,
            },
        });

        return await response.json();
    },
    // added by codecooker
    async uploadFileFromUrl(params) {
        const response = await nodeApi('s3/upload-file-from-url', {
            method: 'post',
            body: {
                ...params,
            },
        });

        return await response.json();
    }
};

export const  uploadBase64 = async (file) => {
    const response = await phpApi(`upload/base64`, {
        method: 'post',
        body: {
            base64String: file
        }
    });

    return await response.json();
}
