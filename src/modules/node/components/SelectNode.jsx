import React from 'react';
import {SelectInput} from 'components/PropertyEditor';
import {useProject} from "../../../graphql/Project/hooks";
import {useParams} from 'react-router-dom'
import reduce from 'lodash/reduce';

const SelectNode = ({value, ...props}) => {
  const {projectId} = useParams();
  const [project, _, {loading,error}] = useProject(projectId);

  if(loading || error) return null;

  const options = reduce( project.nodes, function (result, value, key) {
    result[value.id] = value.name;
    return result;
  }, {});

  return (
    <SelectInput {...props} value={value} options={options} />
  );
};
export default SelectNode;
