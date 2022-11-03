import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ElementWizard.module.scss';

// components
import TemplateListComponent from 'modules/template/components/TemplateListComponent';

const templateStepProps = {
  /** Element data that populates the actions  */
  elementWizardData: PropTypes.object.isRequired,
  onUseTemplate: PropTypes.func.isRequired,
  topWizardProps: PropTypes.object
};

const TemplateStep = ({ onUseTemplate }) => {

  const handleSelectTemplate = (templateId) => {
    onUseTemplate && onUseTemplate(templateId);
  };

  return (
    <div className={styles.templates_wrapper}>
      <TemplateListComponent
        resource="modals"
        title="Choose a Template"
        isModal={false}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

TemplateStep.propTypes = templateStepProps;

export default TemplateStep;
