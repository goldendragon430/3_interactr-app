import React from 'react';

import ModalCanvas from './ModalCanvas';
import styles from './ModalPreview.module.scss';

/**
 * Creates a static preview of the modal for users to view but
 * not allow edits without being on the modal page
 * @param id
 * @param width
 * @returns {*}
 * @constructor
 */
const ModalPreview = ({ width, height, scale, modal, disabled=false }) => {
	return (
		<div
			style={{
				maxHeight: height + 'px',
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				background: '#eee'
			}}
		>
			{/* We overlay a html element so nothing in the modal can be edited */}
			{
				disabled ? <div className={styles.overlay}
					style={{
						height: height + 'px',
						width: width + 'px',
					}}
				>
					&nbsp;
				</div>
				: null
			}

			<div
				style={{
					position: 'relative',
					transform: `scale(${scale})`,
					transformOrigin: 'top center',
				}}
			>
				<ModalCanvas modal={modal} preview={disabled} canPreview={true} />
			</div>
		</div>
	);
};

export default ModalPreview;
