import React from 'react';
import Button from 'components/Buttons/Button';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import styles from 'modules/media/components/uploadMedia/StockListModalStyles.module.scss';
import axios from 'axios';
import FilterInput from 'components/FilterInput'


export default class YouzignModal extends React.Component {
  state = {
    amountToShow: 12,
    adding: false,
    images: [],
    filteredImages: [],
    filtering: false,
    gotImages: false,
    gotImagesError: false,
  };

  youZignCheck = () => {
    const { user } = this.props;
    return user.integration_youzign && user.integration_youzign.key;
  };

  componentDidMount() {
    const { user } = this.props;
    if (this.youZignCheck()) {
      const params = new URLSearchParams();
      params.append('key', user.integration_youzign.key)
      params.append('token', user.integration_youzign.hash)

      axios
        .post('https://www.youzign.com/api/designs/', params )
        .then(({data}) => {
            if (data.error){
              console.log(data);
              this.setState({gotImagesError:true});
            } else {
              this.setState({images: data});
              console.log('data from youzign: ', data);
            }
        }).catch(error =>{
            console.log('Youzign error: ' ,error);
            this.setState({gotImagesError:true});
        }).then(() => {
          this.setState({gotImages:true});
        })

      // let jqxhr = $.post( "https://www.youzign.com/api/designs/", {
      //   key: this.props.user.integration_youzign.key,
      //   token: this.props.user.integration_youzign.hash
      // },(response)=> {
      //   if (response.error){
      //     console.log(response);
      //     this.setState({gotImagesError:true});
      //   } else {
      //     this.setState({images:response});
      //     console.log('response from youzign: ',response);
      //   }
      // })
      //   .fail((response)=> {
      //     console.log(response);
      //     this.setState({gotImagesError:true});
      //   })
      //   .always(()=> {
      //     this.setState({gotImages:true});
      //   });
    }
  }

  addItem = item => {
    const { submit, close } = this.props;
    const sizes = this.getSize({
      height: item.image_src[2],
      width: item.image_src[1]
    });

    submit({
      src: item.image_src[0],
      height: sizes.height,
      width: sizes.width
    });
    close();
  };

  getSize(options) {
    let { height, width } = options;
    const maxHeight = 400;
    const maxWidth = 710;

    if (height <= maxHeight && width <= maxWidth) {
      // No resizing needed
      return { height, width };
    }
    // debugger;
    // Scale on width first
    if (width > maxWidth) {
      const scale = width / maxWidth;
      width = width / scale;
      height = height / scale;
    }
    // debugger;
    // If height is still over we scale again on width
    if (height > maxHeight) {
      const scale = height / maxHeight;
      width = width / scale;
      height = height / scale;
    }

    // debugger;
    return { height, width };
  }

  item = (item, key) => {
    const { image_sizes, title } = item;
    return (
      <div key={key} className={styles.listItem}>
        <div className={styles.listItemInner}>
          <div className={styles.imageHolder}>
            <div className={styles.inner}>{image_sizes.thumbnail && <img src={image_sizes.thumbnail[0]} />}</div>
          </div>
          <div className={styles.textHolder}>
            <span>{title}</span>
            <div className={styles.addButton}>
              <Button primary noMarginRight={true} right={true} small onClick={() => this.addItem(item)}>
                Select
              </Button>{' '}
              :
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderItems = () => {
    let { filteredImages, filtering, images, gotImagesError } = this.state;

    if (!this.youZignCheck()) {
      return (
        <div
          style={{
            display: 'block',
            marginTop: '5px',
            marginBottom: '5px',
            width: '100%',
            backgroundColor: '#f3f3f3',
            padding: '30px',
            height: '300px'
          }}
        >
          <h2>Interactr Youzign Integration</h2>
          <p>
            Youzign is a cloud based design app that will let you create everything from video backgrounds through to fb
            ads, offline designs and everything in between
          </p>
          <p>
            <strong>Existing Users</strong>
            <br />
            Set up the API Keys in your integrations page:{' '}
            <a href="/account/details">http://interactrapp.com/account/details</a>
          </p>
          <p>
            <strong>Not a Youzign User? </strong>
            <br />
            Grab our special discounted membership{' '}
            <a href="https://jvz7.com/c/474085/286725" target="_blank">
              here
            </a>
          </p>
        </div>
      );
    }

    if (gotImagesError) {
      return (
        <div
          style={{
            textAlign: 'center',
            display: 'block',
            marginTop: '5px',
            width: '100%',
            backgroundColor: '#f3f3f3',
            height: '50px'
          }}
        >
          <p style={{ lineHeight: '25px' }}>Error connecting to Youzign's API, Please check your API Keys</p>
        </div>
      );
    }

    filteredImages = filtering ? filteredImages : images ; 
    return  filteredImages.map(this.item) ;
  };

  handleFilter = ({filteredData, filtering}) => {
    this.setState({filteredImages : filteredData , filtering})
  }

  render() {
    const { close, showMe, user } = this.props;
    const {images} = this.state;
    return (
      <Modal 
        show={showMe}
        onClose={close}
        height={675}
        width={1000}
        heading={
          <>
            <Icon name="list" /> Your Youzign Library
          </>
        }
      >
        <div>
          <div className={styles.filterWrapper}>
            <FilterInput data={images} filterKey="title" onFilter={this.handleFilter} placeholder="Filter by titles..."/>
          </div>
          <div className={styles.listWrapper}>{this.renderItems()}</div>
        </div>
      </Modal>
    );
  }
}
