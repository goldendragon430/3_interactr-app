import axios from 'axios';

const StockVideos = ({fetchImages = false, ...params}) => {
    const endpoint = fetchImages ? '/' : '/videos';

    if(fetchImages){
      params.image_type = 'photo'
    }

    return axios(`${import.meta.env.VITE_PIXABAY_API_URL}${endpoint}` , {
                params: {
                    key: import.meta.env.VITE_PIXABAY_API_KEY,
                    ...params
                }
            }).then(res => res.data)
                .catch(() => {
                    throw new Error('load stock videos.');
                });
};

export default StockVideos;
