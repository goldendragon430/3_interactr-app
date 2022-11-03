import React from 'react';
import { useParams } from "react-router-dom";

import { SaveButton } from "components/Buttons";
import { NodeSettings } from '../NodeSettings'
import { OnNodeEnd } from '../OnNodeEnd';
import PreviewProjectButton from 'modules/project/components/PreviewProjectButton';
import PublishButton from 'modules/project/components/PublishButton';

export const NodeActions = () => {
  const { nodeId, projectId } = useParams();

  return (
    <div className="d-flex justify-end align-center">
        <NodeSettings />
        <OnNodeEnd  />
        <PreviewProjectButton startNodeId={nodeId} projectId={projectId} >
          Preview Node
        </PreviewProjectButton>
        <PublishButton />
        <SaveButton />
    </div>
  );
};
