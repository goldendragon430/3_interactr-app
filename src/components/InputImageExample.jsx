import React from 'react';
import Modal from 'components/Modal';

export default class InputImageExample extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      show: false
    };
  }

  render(){
    let {image,title, height, width} = this.props;

    if (! image) return null;
    if (! title) return null;

    // Add extra height for the heading
    height = height + 60;

    return(
      <div style={{marginTop: '-15px', marginBottom: '15px'}}>
        <p style={{cursor:'pointer'}} onClick={()=>this.setState({show: true})}><small><em>See Example</em></small></p>
        <Modal
          show={this.state.show}
          onClose={() => this.setState({show: false})}
          height={height}
          width={width}
          heading={title}
        >
          <img src={image} className="img-fluid"/>
        </Modal>
      </div>
    )
  }
}