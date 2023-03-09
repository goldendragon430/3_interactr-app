import React from 'react';
import { SelectInput } from 'components/PropertyEditor';
import keyBy from 'lodash/keyBy';
import { fonts } from 'utils/fonts';

export default class SelectFont extends React.Component {
  render() {
    const {value} = this.props;
    return (
      <div>
        <SelectInput {...this.props} options={keyBy(fonts, val => val)} />
        <p style={{marginTop: '10px', marginBottom:'30px'}}>
          <span className="faded-text" style={{textTransform: 'uppercase'}}><strong> Font Preview: </strong></span>
          <span style={{fontFamily: value}}> This is my custom font</span>
        </p>
      </div>
    );
  }
}
