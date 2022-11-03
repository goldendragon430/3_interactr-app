import React, {useEffect} from 'react';
import map from 'lodash/map';
import Button from 'components/Buttons/Button';
import {useSetState} from "../utils/hooks";

/**
 * Show the form for a user to set the given integration params
 * @param className
 * @param data
 * @param saving
 * @param onSubmit
 * @param fields
 * @param error
 * @returns {*}
 * @constructor
 */
const SimpleForm = ({className, data, saving = false, onSubmit, fields, error}) => {

  const [state, setState] = useSetState(data);

  useEffect(() => {
      setState(data);
  }, [data]);

  const handleChange = e => {
    const {name, value} = e.target;

    setState({[name]: value});
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(e, state);
  };

  const renderField = (label, name) => {
    let type = 'text';
    if (name === "password") {
      type = 'password';
    }

    return (
      <div key={name} className="form-control">
        <label>{label}</label>
        <input
          name={name}
          type={type}
          value={state[name] || ''}
          onChange={handleChange}
        />
      </div>
    );
  };


  return (
    <form className={className} onSubmit={handleSubmit}>
      {map(fields, renderField)}
      {error && (
          <p style={{
            marginTop: '10px',
            color: 'red',
            fontWeight: 600,
            fontSize: '15px'
          }}>Authorization Failed</p>
      )}
      <Button type="submit" primary loading={saving} icon="save">Validate</Button>
    </form>
  );
};


export default SimpleForm;