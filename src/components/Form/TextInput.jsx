import React from 'react';

const TextInput = ({label, value, update}) => {

  return(
    <div className={'form-control'}>
      <label>{label}</label>
      <input
        value={value}
        onChange={e => update(e.target.value)}
      />
    </div>
  )
}

export default TextInput;