import {useState, useEffect} from "react";
import {phpApi} from "../../utils/apis";
import _unionBy from "lodash/unionBy";
import StockVideos  from 'utils/stockMediaVideos';

export const DEFAULT_STOCK_VIDEOS_REQUEST_PARAMS = {
    page: 1,
    fetchImages: false
};


/**
 * Fetch integration lists by integrationType
 * @returns {[getProjects, {projects: {}, loadingProjects: boolean, error: string}]}
 */
export const useMediaLibraryProjects = () => {
    const [loadingProjects, setProjectsLoading] = useState(true);
    const [projects, setProjectsData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getProjects('projects');
    }, []);

    const fetchProjects = (url, options = {}) => {
        phpApi(url, options)
            .then(res => res.json())
            .then(nextProjects => {
                const data = _unionBy([...projects, ...nextProjects.data], 'id');

                setProjectsData(data);
                setNextPageUrl(nextProjects.next_page_url);

                return nextProjects;
            })
            .catch(error => {
                setError(error?.data?.message);
            })
            .finally(() => {
                setProjectsLoading(false);
            });
    };

    const getProjects = (url, options = {}) => {
        setProjectsLoading(true);
        setError('');

        return fetchProjects(url, options);
    };

    return [getProjects, {projects, loadingProjects, error, nextPageUrl}];
};

/**
 * Fetch stock list videos from pixabay API
 * @returns {[function(*=): void, {loadingVideos: boolean, videos: *[], page: number, totalCount: number, error: string}]}
 */
export const useStockVideos = () => {
    const [loadingVideos, setVideosLoading] = useState(true);
    const [items, setItemsData] = useState([]);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [isImages, setIsImages] = useState(0);

    useEffect(() => {
        getStockLists(DEFAULT_STOCK_VIDEOS_REQUEST_PARAMS);
    }, []);

    const fetchVideos = (params) => {
        StockVideos(params)
            .then(data => {
                setItemsData(data.hits);
                setTotalCount(data.totalHits);
            })
            .catch(setError)
            .finally(() => {
                setVideosLoading(false);
            });
    };

    const getStockLists = (params) => {
        setVideosLoading(true);
        setError('');
        setIsImages(params.fetchImages);

        if (params.page) {
            setPage(params.page);
        }

        return fetchVideos(params);
    };

    return [getStockLists, {items, page, totalCount, loadingVideos, error, isImages}];
};

export const AcceptedMedia = ['video/mp4', 'image/*']