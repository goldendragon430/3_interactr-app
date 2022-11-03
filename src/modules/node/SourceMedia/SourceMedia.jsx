import {useMedia, useMedias} from "../../../graphql/Media/hooks";
import { useReactiveVar } from "@apollo/client";
import React, {useEffect, useState} from "react";
import Button from "../../../components/Buttons/Button";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {errorAlert} from "../../../utils/alert";
import map from 'lodash/map';
import styles from './SourceMedia.module.scss';
import CardStyles from 'components/Card.module.scss';
import cx from 'classnames';
import {useParams} from 'react-router-dom'
import { useNodeCommands } from "@/graphql/Node/hooks";
import {Option} from "../../../components/PropertyEditor";
import ColorPicker from "../../../components/ColorPicker";
import {useQuery} from "@apollo/client";
import gql from "graphql-tag";

import { 
  getNodeSettings,
  setNodeSettings, 
  SHOW_CHANGE_SOURCE_MEDIA_MODAL } from "@/graphql/LocalState/nodeSettings";

const QUERY = gql`
    query node($nodeId: ID!) {
        node(id: $nodeId) {
            id
            name
            media_id
            media {
                id
                name
                thumbnail_url
            }
            background_color
        }
    }
`;

export const SourceMedia = ({label = 'Node Source Media', node}) => {
  const { activeModal } = useReactiveVar(getNodeSettings);
  const {updateNode} = useNodeCommands(node.id);
  const [showModal, setShowModal] = useState(false);
  const {media, media_id, background_color} = node;

  return(
    <>
      <div className={styles.mediaWrapper}>
        {(label) && <label>Node Background </label>}
        {
          (media_id) ?
            (
              <div className={styles.mediaCard}>
                <CurrentMedia setShowModal={setShowModal} media={media} label={label} />
              </div>
            ) :
            <div 
              className={styles.emptyMediaCard} 
              style={{ background: background_color }}>
                &nbsp;
            </div>
        }
      </div>
      <Button
        small 
        secondary
        onClick={() => {
          setNodeSettings({
            activeModal: SHOW_CHANGE_SOURCE_MEDIA_MODAL
          })
        }}
        icon="image"
        style={{marginTop: '10px'}}
      >
        Change Source
      </Button>
    </>
  );
};



const CurrentMedia = ({media}) => {
  if(! media) return null;

  const {name, thumbnail_url} = media;

  return(
    <>
      <p style={{marginTop: '5px', marginBottom: '5px'}} className={'ellipsis'}>
        <small>{name}</small>
      </p>
      <img src={thumbnail_url}  className="img-fluid" />
    </>
  )
};



