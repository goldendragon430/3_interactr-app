import React, {useEffect} from "react";
import {useMedia} from "../../../../graphql/Media/hooks";
import Player from "react-player";
import client from "../../../../graphql/client";
import {cache} from "../../../../graphql/client";
import gql from "graphql-tag";
import {MEDIA_FRAGMENT} from "../../../../graphql/Media/fragments";
import {useLazyQuery, useQuery, useReactiveVar} from "@apollo/client";
import {getAddNode, setAddNode} from "../../../../graphql/LocalState/addNode";
import {GET_MEDIA} from "../../../../graphql/Media/queries";
import Icon from "../../../../components/Icon";
import ErrorMessage from "../../../../components/ErrorMessage";

/**
 * Show single media preview
 * @param mediaId
 * @returns {null|*}
 * @constructor
 */
const SourceMediaPreview = ({ mediaId, background_color, name, setName }) => {
    if(! mediaId) {
        return <BackgroundColorPreview background_color={background_color} />
    }

    return <MediaPreview
      mediaId={mediaId}
      name={name}
      setName={setName}
    />
};

export default SourceMediaPreview;

const BackgroundColorPreview = ({background_color}) => {
    return <div style={{background: background_color, height: '219px', width: '390px'}}>&nbsp;</div>
};




const MediaPreview = ({mediaId, name, setName}) => {

    const {data, loading, error} = useQuery(GET_MEDIA, {
        variables: {
            id: mediaId
        }
    })

    // const media = client.readFragment({
    //     id: cache.identify({id: mediaId, __typename: "Media"}),
    //     fragment: gql`
    //         fragment Media_Fragment on Media {
    //             id
    //             thumbnail_url
    //             name
    //         }
    //     `,
    // });
    //
    // // If we don't have the media in the cache get it with a lazy query
    // if(! media) {
    //     query({
    //
    //     })
    //}


    // Little trick here to help users by prepopulating
    // the node name with the media name, users can easily
    // change this but it just makes things easier.

    useEffect(()=>{
        if(! name && data && data.result) {
            setName('Node - ' + data.result.name);
        }
    }, [data])

    if (loading) return <Icon loading />;

    if(error) return <ErrorMessage text={'Unable to load media preview' }/>

    return(
      <img src={data.result.thumbnail_url} className="img-fluid"/>
    )
}