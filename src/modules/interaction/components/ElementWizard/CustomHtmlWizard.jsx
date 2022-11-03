import React from 'react';
import PropTypes from 'prop-types';
import ElementWizard from './ElementWizard';
import NameStep from './NameStep';
import AppearanceStep from './AppearanceStep';
import TimelineStep from './TimelineStep';
import { Option, LargeTextInput } from 'components/PropertyEditor';
// import Copy from './Copy';
import styles from './ElementWizard.module.scss'
const stepsMeta = [
  { title: 'Element Name' },
  { title: 'Element Appearance' },
  { title: 'Element Html' },
  // { title: 'Timeline' }
];

function CustomHtmlWizard(props) {
  const updateHtml = (e, html) => {
    console.log(html);
    props.updateElement({ html });
  };

  return (
    <ElementWizard {...props} stepsMeta={stepsMeta}>
      <NameStep {...props} />
      <AppearanceStep {...props} />

      {/* html step for custom html wizard */}
      <div className={styles.step_wrapper}>
        <h3>Write down the HTML</h3>
        <Option value={props.element.html} Component={LargeTextInput} onChange={updateHtml} rows={5} />
      </div>
      {/*<TimelineStep {...props} />*/}
    </ElementWizard>
  );
}

CustomHtmlWizard.propTypes = {
  // element,
  // interaction,
  // mediaItem, // used by timeline Step for preview
  // updateElement,
  // updateInteraction,
  // onSave: handleSaveElement,
  // onSkip: handleSkipWizard,
  // elementTypeName, // adjusted name of element type
  // onStepChange: handleStepChange, // callback to use on the wizard on Step Change
  // activeStep,  // the current active step , updated by onStepChange callback
};

export default CustomHtmlWizard;
