import React, {useEffect, useState} from "react";
import filter from "lodash/filter";
import map from "lodash/map";

import { Icon, Modal} from "components";
import { LinkButton } from "components/Buttons";
import { projectsPath } from "./routes";
import { SourceMedia } from "modules/node/SourceMedia";
import { useSaveNode } from "@/graphql/Node/hooks";
import { errorAlert } from "utils/alert";

/**
 * As youtube is no longer allowed in the player we need to prompt  users to replace the source media of youtube nodes
 * @param nodes
 * @returns {JSX.Element|null}
 * @constructor
 */
const YouTubePrompt = ({ nodes }) => {
  const [show, setShowModal] = useState(false);
  const [ytNodes, setYtNodes] = useState([]);

  useEffect(()=>{
    // Check for any node media that contains a 3rd party stream url (YouTube / Vimeo)
    setYtNodes(filter(nodes, node => {
      return (node.media && node.media.stream_url && ! node.media.url);
    }));

  }, [nodes])

  if(ytNodes.length && ! show) {
    setShowModal(true);
  }

  if(! ytNodes.length && show) {
    setShowModal(false);
  }

  return (
    <Modal 
      width={750} 
      height={800} 
      show={show} 
      onClose={()=>setShowModal(false)}
      heading={
        <>
          <Icon name="exclamation-circle" />
          This project contains YouTube media
        </>
      }
      submitButton={
        <LinkButton to={projectsPath()}><Icon name={'arrow-left'} /> Back to Projects</LinkButton>
      }
    >      
      <div>
        <p>Interactr no longer supports YouTube videos.</p>
        <p>Your projects with YouTube videos will still play but it will no longer be possible to make any changes.</p>
        <p>To make changes to this project please replace the source media of the YouTube nodes below</p>
        <div className={'grid'}>
          {map(ytNodes, node => <YouTubePromptRow node={node} />) }
        </div>
      </div>
    </Modal>
  )
};

export default YouTubePrompt;

const YouTubePromptRow = ({ node }) => {
  const [saveNode, {loading, error}] = useSaveNode(node.id);

  if(error) {
    errorAlert({
      text:'Unable to save changes'
    })
  }

  return(
    <div className={'col4'}>
      <SourceMedia node={node} label={false} updateNode={saveNode} loading={loading} />
    </div>
  )
};