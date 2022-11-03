import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Stuff
import { IMAGE_ELEMENT } from 'modules/element/elements';
import styles from './ElementWizard.module.scss';
// Components
// import { Option, TextInput } from 'components/PropertyEditor';
import ErrorMessage from 'components/ErrorMessage';
import DropImageZone from 'modules/media/components/DropImageZone';
import ImageElementModal from 'modules/element/components/Properties/ImageElementModal';

const ImageUploadStepProps = {
  /** Called after updating any element data  */
  updateElement: PropTypes.func.isRequired,
  updateInteraction: PropTypes.func.isRequired,
  /** Element data that populates the actions  */
  element: PropTypes.object.isRequired,
  interaction: PropTypes.object
};

export default function ImageUploadStep({ interaction, element, updateElement }) {
  const [addImageModal, setAddImageModal] = useState(false);


  const handleSuccess = ({ src, height, width }) => {
    // leave as initial values if not greater than 0
    height = Number.isInteger(height) && height > 0 ? height : element.height
    width = Number.isInteger(width) && width > 0 ? width : element.width
    
    updateElement({
      src,
      height,
      width
    });
  };

  const noSupport = interaction.element_type !== IMAGE_ELEMENT;

  return noSupport ? (
    <ErrorMessage msg="This is only supported by Image elments" />
  ) : (
    <div className={styles.step_wrapper}>
      <h3>Select Image Source</h3>
      <div>
        <ImageElementModal
          showStockList={addImageModal}
          close={() => {
            setAddImageModal(false);
          }}
          submit={handleSuccess}
        />
        {/* <YouzignModal
          showMe={addFromYouZign}
          source="youzign"
          close={() => this.setState({ addFromYouZign: false })}
          submit={this.handleSuccess}
        /> */}
        {user.parent_user_id === 0 || user.is_club ? (
          <span style={{ display: 'block', padding: '15px 0px' }}>
            Add From:
            <br />
            <a
              className="link"
              onClick={() => {
                setAddImageModal(true);
              }}
            >
              Image Library
            </a>
            {/* &nbsp;&nbsp;|&nbsp;&nbsp; */}
            {/* {user.parent_user_id === 0 ? (
              <a className="link" onClick={() => this.setState({ addFromYouZign: true })}>
                Youzign
              </a>
            ) : null} */}
          </span>
        ) : null}
        <span>Upload From Computer</span>
        <DropImageZone directory="imageElements" onSuccess={handleSuccess} src={element.src} />
      </div>
    </div>
  );
}

ImageUploadStep.propTypes = ImageUploadStepProps;
