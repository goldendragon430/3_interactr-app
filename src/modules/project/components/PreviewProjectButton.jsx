import React, { useState } from 'react';
import PreviewButton from 'components/Buttons/PreviewButton';
import ProjectPreview from './ProjectPreview';

function PreviewProjectButton({ projectId, startNodeId, projectTemplate, secondary,  ...props }) {


  return (
    <PreviewButton
      previewTitle={startNodeId ? 'Node Preview' : "Project Preview"}
      secondary={secondary}
      previewContent={
        <ProjectPreview
          projectId={projectId}
          startNodeId={startNodeId}
          // reloader={showModal}
          projectTemplate={projectTemplate}
        />
      }
      {...props}
    />
  );
}


export default PreviewProjectButton;
