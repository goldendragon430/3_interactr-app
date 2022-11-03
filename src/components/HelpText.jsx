import React from 'react';
import helpText from 'utils/helpText';
import Icon from "components/Icon";
import {info} from 'utils/alert';

export default class HelpText extends React.Component {
  open = () => {
    const text = helpText[this.props.helpText];

    if (! text) return null;

    info({
      title: 'Info',
      text,
    })
  }
  render() {
    if (!this.props.helpText) return null;

    return (
      <span onClick={ ()=> this.open() } style={{ cursor:'pointer'}}>
        <Icon name="info-circle"/>
      </span>
    )

  }
}