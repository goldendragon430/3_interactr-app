import React from "react";
// import 'react-select/dist/react-select.css'
//import 'react-virtualized/styles.css'
// import 'react-virtualized-select/styles.css'
// import VirtualizedSelect from "react-virtualized-select";
import Select from 'react-select';

/**
 * Get dropdown items list on mouse scroll / lazy loading
 * @param value
 * @param options
 * @param onChange
 * @param onLazyLoad
 * @param valueKey
 * @param props
 * @returns {*}
 * @constructor
 */
const SelectAsyncInput = ({value, options, onChange, onLazyLoad, valueKey = 'value',  ...props}) => {
    return (
        <Select
            {...props}
            // valueKey={valueKey}
            options={options}
            onOpen={() => { return null; }}
            onChange={({[valueKey]: value}) => onChange(value)}
            defaultValue={value}
            // onMenuScrollToBottom={onLazyLoad}
            // clearable={false}
            // searchable={false}
        />
    )
};

export default SelectAsyncInput;