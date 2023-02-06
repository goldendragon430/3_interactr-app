import React from 'react';
import Button from "components/Buttons/Button";
import LinkButton from "components/Buttons/LinkButton";
import Icon from 'components/Icon';
import stockImages from 'utils/stockImages';
import styles from 'modules/media/components/uploadMedia/StockListModalStyles.module.scss';
import debounce from 'lodash/debounce';
import {Link} from 'react-router-dom';
import {useReactiveVar} from "@apollo/client";
import {getAcl} from "../../../../graphql/LocalState/acl";
import Modal from "../../../../components/Modal";
import {useImageElementCommands} from "../../../../graphql/ImageElement/hooks";
import { ADD_IMAGE_VAR_INITIAL_DATA, setAddImage } from "../../../../graphql/LocalState/addImage";

const PAGINATION_AMOUNT = 12;

export const RenderImageElementModal = ({ showStockList, close, element }) => {
  const {_, saveImageElement} = useImageElementCommands(element.id);

  const handleSuccess = (options) => {
    setAddImage({
      ...ADD_IMAGE_VAR_INITIAL_DATA,
      newImageElement: options.src
    });
    handleUpload({ src: options.src })
    close();
  }
  
  const handleUpload = (options) => {
    saveImageElement({
      variables: {
        input : {
          id: Number(element.id),
          src: options.src,
          height: options.height,
          width: options.width
        }
      }
    })
  }

  return (
    <ImageElementModal 
      showStockList={showStockList}
      submit={handleSuccess}
      close={close}  />
  );
}

export default class ImageElementModal extends React.Component {
  state = {
    availableTags: [],
    searchTerm: '',
    amountToShow: 12,
    selectedTags: [],
    adding: false,
    //StockImages: [],
  };

  componentDidMount() {
    this.debounceSetFilterText = debounce(this.setFilterText, 500);
  }


  addStockItem = (options) => {
    const {submit, close} = this.props;
    const {src, key} = options;
    const size = this.getSize(key);
    
    submit({
      src,
      height: size.height,
      width: size.width
    });

    // close();
  };

  getSize = (key)=>{
      const id = 'stockimage-'+key;
      const el = document.getElementById(id);
      return {
        height: el.offsetHeight,
        width: el.offsetWidth,
      }
  };

  stockItem = (item, key) => {
    const {user} = this.props;

    return (
      <div key={key} className={styles.listItem}>
        <div className={styles.listItemInner}>
          <div className={styles.imageHolder}>
            <div className={styles.inner}>
              <img src={item.src}  id={'stockimage-'+key}/>
            </div>
          </div>
          <div className={styles.textHolder}>
            <span>{item.name}</span>
            <div className={styles.addButton}>
              <SelectButton onSelect={() => this.addStockItem({src: item.src, key})} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  getStockListsFilteredBySearchTerm = () => {
    const {searchTerm, selectedTags} = this.state;

    let filteredStockImages = stockImages;

    if(! filteredStockImages.length) {
      return [];
    }

    if (searchTerm.length > 0) {
      filteredStockImages = filteredStockImages.filter((item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }

    if (selectedTags.length > 0) {
      filteredStockImages = filteredStockImages.filter((item) => {
        let hasFound = false;
        selectedTags.forEach((tag) => {
          if (item.tags.indexOf(tag) !== -1) {
            hasFound = true;
          }
        });
        return hasFound;
      });
    }

    return filteredStockImages;
  };

  renderStockList = () => {
    const {amountToShow} = this.state;

    let filteredStockVideos = this.getStockListsFilteredBySearchTerm().slice(0, amountToShow);
    return filteredStockVideos.map((item, key) => {
      return this.stockItem(item, key);
    });
  };

  loadMoreStockListItems = () => {
    this.setState({amountToShow: this.state.amountToShow + PAGINATION_AMOUNT})
  };

  setFilterText(value) {
    this.setState({searchTerm: value});
  };

  changeTags = (tags) => {
    this.setState({selectedTags: tags});
  };

  render() {
    const isMore = this.state.amountToShow < this.getStockListsFilteredBySearchTerm().length;
    const {close, onBack, showStockList, user} = this.props;
    
    return (
      <Modal
        show={showStockList}
        onClose={close}
        onBack={onBack}
        height={800}
        width={1200}
        heading={
          <><Icon name="list" /> Image Library</>
        }
      >
            <div className={styles.filterWrapper}>
              <div className={styles.filterLeftWrapper}>
                Filter: <input name="filter" className={styles.filterInput} onChange={(e) => this.debounceSetFilterText(e.target.value)} placeholder="Filter by name" />
              </div>
              <div className={styles.filterRightWrapper}>
                {/* May add in image tagging later */}
                {/*Tags:*/}
                {/*<StockListTagsFilter*/}
                  {/*availableTags={this.state.availableTags}*/}
                  {/*onChange={this.changeTags}*/}
                {/*/>*/}
              </div>
            </div>

            <div className={styles.listWrapper}>
              <UpgradeMessage/>
              {this.renderStockList()}
              {
                isMore &&
                <div style={{textAlign: 'center', display:'block', marginTop:'20px', marginBottom: '20px', width: '100%'}}>
                  <Button onClick={this.loadMoreStockListItems} noFloat={true}>Load More</Button>
                </div>
              }
            </div>
      </Modal>
    )
  }
}


// Hack becuase we can't use the reactive var hook in the class so this just
// saves rewritting the whole class
const UpgradeMessage = () => {
  const acl = useReactiveVar(getAcl)

  if(acl.canAccessImageLibrary ) return null;

  return (
    <div style={{textAlign: 'center', display:'block', marginTop:'5px', marginBottom: '5px', width: '100%', backgroundColor: '#f3f3f3', paddingTop: '5px', paddingBottom: '5px'}}>
      <p>You must upgrade your account to access the Image Library <Link to="/upgrade">Upgrade Here</Link></p>
    </div>
  )
};

const SelectButton = ({onSelect}) => {

  const acl = useReactiveVar(getAcl)

  if(!acl.canAccessImageLibrary) return  <LinkButton primary noMarginRight={true} right={true} small to="/upgrade">Upgrade</LinkButton>

  return <Button primary noMarginRight={true} right={true} small onClick={onSelect}>Select</Button>
}