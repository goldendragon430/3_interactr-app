import React from 'react';
// import Select from 'react-select';
// import ReactTooltip from 'react-tooltip';
import cx from 'classnames';
// import forEach from 'lodash/forEach';
import Icon from 'components/Icon';
import MediaItem from './MediaItem';
import styles from './MediaLibrary.module.scss';
import { UploadMediaButton } from './UploadMediaButton';
// import HorizontalScroller from 'components/HorizontalScroller';
// import { TextInput } from 'components/PropertyEditor';

export default class MediaLibrary extends React.Component {
	constructor() {
		super();

		this.state = {
			mediaZoneIn: true,
			showMediaFor: 'thisProject',
		};
	}

	get mediaList() {
		const { media, project } = this.props;

		return media.length
			? media.map((mediaItem) => (
					<MediaItem
						media={mediaItem}
						key={mediaItem.id}
						type='media'
						isLegacyProject={project.legacy}
					/>
			  ))
			: null;
	}

	render() {
		const show = this.state.mediaZoneIn;
		const { media, toggleLibrary } = this.props;
		const addMediaZoneClassList = cx(styles.uploadVideoButton, {
			[styles.hideAddMediaZone]: !show,
		});

		return (
			<div className={styles.MediaLibrary}>
				<div className={styles.top_row}>
					<h3 className={styles.heading}>
						<Icon name={'video'} /> Media Library
						<br />
						<small>Drag videos into the canvas.</small>
						{/* <span className={styles.closeButton} onClick={toggleLibrary}>
                  Close <Icon name="arrow-right" />
                </span> */}
					</h3>
				</div>

				<div className={cx(styles.listWrapper)}>{this.mediaList}</div>
				<div style={{ position: 'absolute', bottom: '-70px' }}>
					<div className='grid'>
						<div className='col6'>
							<Button primary icon='plus'>
								Create Node
							</Button>
						</div>
						<div className='col6'>
							<UploadMediaButton
								// className={addMediaZoneClassList}
								show={show}
								toggleMediaZone={() => this.setState({ mediaZoneIn: !show })}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
