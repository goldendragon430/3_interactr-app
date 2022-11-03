import React from 'react';
import debounce from 'lodash/debounce';




export default class TimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};

    this.debouncedUpdate = debounce(this.props.onChange, 800);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.state.value !== nextProps.value && this.props.interactionId !== nextProps.interactionId) || window.forceTimeInputUpdate) {
      this.setState({value: nextProps.value});
      window.forceTimeInputUpdate = false;
    }
  }

  handleChange = (e) => {
    e.preventDefault();

    let value = e.target.value;

    const colonOccurences = (value.match(/:/g) || []).length;
    if (colonOccurences !== 2) {
      return;
    }

    const [m, s, ms] = value.split(':').map(str => parseInt(str, 10));
    const [mString, sString, msString] = value.split(':');
    if (m < 0 || m > 60) {
      return;
    }

    if (s < 0 || s > 60) {
      return;
    }

    if (mString.length > 2 || sString.length > 2 || (msString && msString.length > 3)) {
      return;
    }

    this.setState({value: value});
    this.debouncedUpdate(value);
  };

  render() {
    const {value} = this.state;
    const {name, style} = this.props;

    return (
      <input name={name} type="text" value={value} onChange={this.handleChange}  style={style}/>
    );
  }
}
