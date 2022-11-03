import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'

import { useProject } from '@/graphql/Project/hooks';
import { ErrorMessage } from "components";
import { BooleanInput, Option } from 'components/PropertyEditor';

export const IsStartNodeToggle = ({node}) => {
  // Remove this option for now as handling it in the new graphQL setup is tricky
  const [project, updateProject, {error, loading}] = useProject();
  const [isStartNode, setIsStartNode] = useState(false);
  
  useEffect(()=>{
    if(project) {
      setIsStartNode((project?.start_node_id === node.id));
    }
  }, [project, node]);
  
  if(loading) return null;
  
  if(error) return <ErrorMessage error={error} />;
  
  const update = () => {
    if(isStartNode) {
      updateProject('start_node_id', node.id);
    }
    else {
      updateProject('start_node_id', 0);
    }
  };
  
  return(
    <Option
      label="Is Start Node"
      value={isStartNode}
      Component={BooleanInput}
      onChange={update}
    />
  )
};

IsStartNodeToggle.propTypes = {
  node: PropTypes.element.isRequired
}