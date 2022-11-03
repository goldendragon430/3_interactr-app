import React, { useState } from "react";
import gql from "graphql-tag";
import { useParams } from 'react-router-dom'
import { useQuery } from "@apollo/client";

import { Button } from "components/Buttons";
import { OnNodeEndModal } from './OnNodeEndModal';

const QUERY = gql`
  query node($nodeId: ID!) {
    node(id: $nodeId) {
      id
      completeActionTimer
      completeActionSound
      completeActionDelay
      completeAction
      completeActionArg
      completeAnimation
      media_id
      media {
          id
          is_image
      }
    }
  }
`;

export const OnNodeEnd = () => {
  const { nodeId } = useParams();
  const [showOnEndModal, setShowOnEndModal] = useState(false);

  const {data, loading, error}  = useQuery(QUERY, {
    variables: { nodeId },
    fetchPolicy: 'cache-only'
  });

  if(loading || error) return null;

  const { node } = data;

  return(
    <>
      <Button
        icon="arrow-to-right"
        text="On Node End"
        onClick={()=>setShowOnEndModal(true)}
        style={{ marginBottom: 0, marginRight: 0}}
      />
      <OnNodeEndModal 
        node={node} 
        show={showOnEndModal} 
        onClose={() => setShowOnEndModal(false)} 
      />
    </>
  )
}
