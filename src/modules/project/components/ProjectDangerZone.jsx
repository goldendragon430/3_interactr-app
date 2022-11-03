import React, {useState} from 'react';
import gql from "graphql-tag";
import MessageBox from "../../../components/MessageBox";
import Button from "../../../components/Buttons/Button";
import * as PropTypes from "prop-types";
import Icon from "../../../components/Icon";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {useNavigate, useParams} from "react-router-dom";
import {confirm, errorAlert} from "../../../utils/alert";
import {projectsPath} from "../routes";


function I(props) {
  return null;
}

I.propTypes = {name: PropTypes.string};
const ProjectDangerZone = ({deleting, handleDelete}) => {



  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Danger Zone</h3>
        <Button red icon={'trash-alt'} onClick={handleDelete} loading={deleting}> Delete Project</Button>
      </div>
      <div className={'col5'}>
        <MessageBox danger>
          <h3>Delete this project</h3>
          <p>
            Once you delete a project, there is no going back. Please be certain.
          </p>
        </MessageBox>
      </div>
    </div>
  )
};
export default ProjectDangerZone;