import React from "react";
import PropTypes from 'prop-types';

import { LinkButton } from "components/Buttons";
import { addProjectPath } from "../routes";

export const AddProjectButton = ({ children }) => {
  return (
    <LinkButton
      to={addProjectPath()}
      primary
      icon={'plus'}
      right
    >
      {children || "Create New Project"}
    </LinkButton>
  );
}

AddProjectButton.propTypes = {
  children: PropTypes.element
}