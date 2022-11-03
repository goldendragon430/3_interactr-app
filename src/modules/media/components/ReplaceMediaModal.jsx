import React, { Component } from 'react';
import cx from 'classnames';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
// import IconButton from 'components/Buttons/IconButton';
import { UploadMediaButton } from './UploadMediaButton';
import styles from './MediaLibrary.module.scss';

class ReplaceMediaModal extends Component {
	state = {
		showMediaZone: false,
	};

	onDone = () => {
		const {
			updateSelectedMedia,
			close,
			media: { id },
		} = this.props;
		updateSelectedMedia(id);
		close();
	};

	render() {
		const { media, show, close } = this.props;
		const { showMediaZone } = this.state;
		const addMediaZoneClassList = cx(styles.uploadVideoButton, {
			[styles.hideAddMediaZone]: !showMediaZone,
		});
		return (
			<Modal 
				show={show} 
				onClose={close} 
				height={300} 
				width={450}
				heading={
					<>
						<Icon name='cloud-upload' /> Replace your video's Source
					</>
				}
			>
				<div
					style={{ paddingTop: 40, position: 'relative', height: 200 }}
				>
					<UploadMediaButton
						show={showMediaZone}
						mediaToReplace={media}
						className={addMediaZoneClassList}
						onDone={this.onDone}
						toggleMediaZone={() =>
							this.setState({ showMediaZone: !showMediaZone })
						}
					/>
				</div>				
			</Modal>
		);
	}
}

export default ReplaceMediaModal;
