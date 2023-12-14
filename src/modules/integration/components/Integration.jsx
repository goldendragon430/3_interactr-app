import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Buttons/Button';
import SimpleForm from 'components/SimpleForm';
import MessageBox from 'components/MessageBox';
import styles from '../styles/Integration.module.scss';
import { useSetState } from "../../../utils/hooks";
import { useSaveUser } from "../../../graphql/User/hooks";
import { validateIntegration } from "../utils";
import {toast} from 'react-toastify'
/**
 * "Save" button to save integration input values
 * @param integrationData
 * @param buttonClick
 * @param buttonText
 * @param saving
 * @returns {*}
 * @constructor
 */
const SaveButton = ({integrationData, buttonClick, buttonText, saving }) => {
  let isAuthed = false;
  if (integrationData && Object.keys(integrationData).length) {
    isAuthed = true;
  }
  return (
      <span>
        {isAuthed && <p>You are already authenticated with AWeber</p>}
        <Button
            onClick={buttonClick}
            icon="save"
            loading={saving}
        >{buttonText}</Button>
      </span>
  );
}

SaveButton.propTypes = {
  integrationData: PropTypes.object,
  buttonClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired
}

/**
 * Show the single integration for a user to edit their details
 * @param props
 * @returns {*}
 * @constructor
 */
export const Integration = ({ buttonClickURL, integrationType, fields, buttonText, showButton, helpText, imageSrc, name, user }) => {
  const [saveUser, {error: mutationError}]= useSaveUser();
  const [state, setState] = useSetState({
    showButton: showButton || false,
    error: false,
    loading: false
  });

  const integrationData = user[integrationType];

  const handleSubmit = (e, data) => {
    e.preventDefault();
    setState({loading: true});
    const errors = validate(data);
    const errorsKeys = Object.keys(errors);

    if(errorsKeys.length) {
      toast.error('Error', errors[errorsKeys[0]]);
      return;      
    }

    validateIntegration({
      integrationType, data,
      /**
       * If API integration validation response is success, update the user integration field
       */
      onSuccess(res) {
         
        setState({error: false, loading: false});
        saveUser({
          id: user.id,
          [integrationType]: data
        });
        if(res['success'])
          toast.success('Validation Success.')
        else 
          toast.error('Validation Failed')

      },
      /**
       * If API integration validation response is error, show the error message above form
       */
      onFail() {
        toast.error('Validation Error')
        setState({error: true, loading: false});
      }
    });

  };

  const validate = (data) => {
    const errors = {}
    const fields = Object.getOwnPropertyNames(data);
    fields.forEach(field => {
      if(!data[field]) errors[field]= `${field} field is required`;
    })
    return errors;
  }

  const buttonClick = () => {
    buttonClickURL && window.open(buttonClickURL,'_blank');

    setState({showButton: false, loading: true});
  };

  return (
    <div className={styles.Integration}>
      <div className="grid">
        <div className="col6">
          <img src={imageSrc} className={styles.image} />
          <h2 className="form-heading" style={{marginBottom: '30px', marginLeft: '50px', marginTop: '-7px'}}>
            {name}
          </h2>
          <div className={styles.content}>
            {state.showButton && (
                <SaveButton
                  integrationData={integrationData || {}}
                  buttonClick={buttonClick}
                  buttonText={buttonText}
                  saving={state.loading}
                />
            )}
            {!state.showButton && (
                <SimpleForm
                    className={styles.form}
                    fields={fields}
                    data={integrationData || {}}
                    onSubmit={handleSubmit}
                    saving={state.loading}
                    error={mutationError || state.error}
                />
            )}
          </div>
        </div>
        <div className={'col5'}>
          <MessageBox>
            <h4 className="faded-heading" style={{marginBottom: '10px', marginTop: '15px'}}>Help</h4>
            <div style={{textAlign: 'left', display:'block', marginTop:'-10px',  marginBottom: '15px', width: '100%', paddingTop: '10px'}}>
              {helpText}
            </div>
          </MessageBox>
        </div>
      </div>
    </div>
  );
}

Integration.propTypes = {
  buttonClickURL: PropTypes.string,
  integrationType: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  buttonText: PropTypes.string,
  showButton: PropTypes.bool,
  helpText: PropTypes.node.isRequired,
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}