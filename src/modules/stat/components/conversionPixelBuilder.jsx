import React from 'react';
import Button from 'components/Buttons/Button';
import styles from './conversionPixelBuilder.module.scss';
import Icon from 'components/Icon';


export default class ConversionPixelBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pixelCost: 0};
  }

  generatePixelCode = () => {
    const {projectId} = this.props;

    if (this.state.pixelCost > 0) {
      this.props.generatePixelCode(projectId, this.state.pixelCost);
    } else {
      toastr.error("Please specify a value for the pixel.");
    }
  };

  render() {
    const {generatedPixelCode, pixelLoading, currency} = this.props;
    return (
        <div>
          <h4 className={styles.heading}>enter conversion pixel value</h4>

          <div className="form-control-inline" style={{paddingTop:'8px', display:'inline-block'}}>
            {/* <Icon name={currency.toLowerCase()} /> */}
            <Icon name="coins" />
          </div>

          <div className="form-control-inline" style={{display:'inline-block'}}>
            <input type="number" onChange={(e => this.setState({pixelCost: e.target.value}))} />
          </div>

          <div className="form-control-inline" style={{display:'inline-block'}}>
            <Button onClick={this.generatePixelCode} icon="sync-alt">Generate Code</Button>
          </div>

          <div style={{marginTop: '20px'}}>
            {pixelLoading && <span>Loading code...</span>}
            {!pixelLoading && generatedPixelCode &&
            <div>
              <p className={styles.heading}>copy the code below and add to your thank you page</p>
              <textarea defaultValue={generatedPixelCode} rows={8} />
            </div>
            }
          </div>
      </div>
    );
  }
}
