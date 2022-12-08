import React, {useState, useEffect} from 'react';
import {useMedias} from "../../../../graphql/Media/hooks";
import map from "lodash/map";
import SelectAsyncInput from "../../../../components/SelectAsyncInput";
import {useQuery} from "@apollo/client";
import {GET_MEDIAS} from "../../../../graphql/Media/queries";
import {MEDIA_LIBRARY_QUERY_PARAMS} from "./MediaLibraryTabs";
import {useMediaLibraryRoute} from "../../routeHooks";
import Icon from "../../../../components/Icon";

/**
 * List media items in dropdown by lazy scroll loading
 * @param projectId
 * @param mediaId
 * @param onChange
 * @returns {*}
 * @constructor
 */
const MediaSelectorDropdown = ({ projectId, mediaId, onChange }) => {
    const [{isOpen, activeTab, page, q}] = useMediaLibraryRoute();

    const variables = {...MEDIA_LIBRARY_QUERY_PARAMS, ...{
            page: parseInt(page),
            q,             project_id: parseInt(projectId)
        }}


    const {data, loading, error, fetchMore} = useQuery(GET_MEDIAS, {variables});

    if(loading) return <Icon loading />;

    if(error){
        console.error(error);
        return null;
    }

    const medias = data.result.data || [];
    const mediaPaginator = data.result.paginatorInfo || {};

    const mediasSelectList = () => {
        const defaultOption = [{ label: 'No Media', value: "0"}];

        const mediaOptions = map(medias, media => ({
            value: media.id,
            label: media.name,
        }));
        
        return  [...defaultOption, ...mediaOptions];
    };

    const handleProjectsLazyLoad = async () => {
        // List more projects on mouse scroll if pagination is still not over
        if (mediaPaginator.hasMorePages) {
            let currentPage = mediaPaginator.currentPage;
            const nextPage = ++currentPage;

            await fetchMore({
                variables: {id: projectId, page: nextPage, first: 12, filterBy: 0},
                updateQuery: (prevItems, { fetchMoreResult: nextItems, ...rest }) => {
                    if (!nextItems) return prevItems;

                    return {
                        result: {
                            ...nextItems.result,
                            data: [...prevItems.result.data, ...nextItems.result.data]
                        }
                    };
                },
            });
        }
    };

    return (
        <SelectAsyncInput
            options={mediasSelectList()}
            value={parseInt(mediaId)}
            onChange={onChange}
            onLazyLoad={handleProjectsLazyLoad}
        />
    )
};

export default MediaSelectorDropdown;