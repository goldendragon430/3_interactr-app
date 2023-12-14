import React from 'react';
import {SketchPicker} from 'react-color';
import onClickOutside from 'react-onclickoutside';

@onClickOutside
export default class ColorPicker extends React.Component {
  state = {
    shown: false,
    value: false
  };

  show = () => {
    this.setState({ shown: true});
  };

  handleClickOutside = () => {
    this.setState({shown: false});
  };

  handleInputChange = e => {
    this.props.onChange(e);
  };

  handleColorChange = (data, e) => {
    // data.rgb contains a channel - Color requires it to be called
    // alpha for some backwards reason.
    const {r, g, b, a} = data.rgb;

    this.props.onChange(this.makeRgbaString(r, g, b, a));
  };

  makeRgbaString(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // react-color requires value to be in a very specific format
  // for alpha to work - an object of {r,g,b,a}
  // parsedValue() {
  //   const {value} = this.props;
  //   const {color, valpha: a} = Color(value).rgb();
  //   const [r, g, b] = color;

  //   return {
  //     r,
  //     g,
  //     b,
  //     a
  //   };
  // }

  render() {
    const {value, stackOrder, disabled} = this.props;

    const zIndex = 100 + (stackOrder) ? stackOrder : 0;
    // Z Index is used to make sure the colour picker appears over the
    // top of the stuff below
    return (
      <div style={{position: 'relative', zIndex, width: '100%'}} className={'clearfix'}>
        <div style={{float:'left', width: '80%'}}>
          <input
              value={value}
              onFocus={this.show}
              onChange={this.handleInputChange}
              disabled={disabled}
          />
        </div>
        <div style={{float:'left', width: '15%', marginLeft: '5%',marginTop: '0', height: '37px'}}>
          {value && <div onClick={this.show} style={{
            background: value,
            height: '100%',
            width: '37px',
            borderRadius: '50%',
            // boxShadow: '0 5px 15px -5px rgba(0, 0, 0, 0.4)',
            border: '1px solid #d2d6dc',
            cursor:'pointer'}
          }>&nbsp;</div>}
        </div>

        {this.state.shown && (
          <div style={{position: 'absolute'}}>
            <SketchPicker color={value} onChange={this.handleColorChange} />
          </div>
        )}
      </div>
    );
  }
}
