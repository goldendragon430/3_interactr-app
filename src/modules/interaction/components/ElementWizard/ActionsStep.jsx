import React , {} from 'react';
import PropTypes from 'prop-types';
import styles from './ElementWizard.module.scss'
// import {Option , SelectInput} from 'components/PropertyEditor'
import ClickableElementProperties from 'modules/element/components/Properties/ClickableElementProperties'

const actionsStepProps = {
    /** Called after updating any element data  */
    updateElement : PropTypes.func.isRequired,
    updateInteraction : PropTypes.func.isRequired,
    /** Element data that populates the actions  */
    element : PropTypes.object.isRequired,
    interaction : PropTypes.object,
}

const ActionsStep = (props) => {
    return (
        <div className={styles.step_wrapper}>
            {/*<h3>Element Timeline Actions</h3>*/}
            <div style={{width:'60%'}}>
                <ClickableElementProperties {...props} />
            </div>
        </div>
    );
};


ActionsStep.propTypes = actionsStepProps;


export default ActionsStep;
