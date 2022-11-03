import React, {useState} from 'react';
import {Option, RangeInput} from "../PropertyEditor";

const RangeInputAfterChange = ({label, value, update, ...props}) => {
  const [_value, setValue] = useState(value);

  return(
    <Option
      label={label}
      value={_value}
      Component={RangeInput}
      onChange={val=>setValue(val)}
      onAfterChange={val=>update(val)}
      {...props}
    />
  )
};
export default RangeInputAfterChange;