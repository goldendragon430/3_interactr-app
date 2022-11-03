import React from 'react';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import times from 'lodash/times';

import { tabAnimation } from './index';

export const MediaLibraryLoading = () => {
	return (
		<motion.div {...tabAnimation}>
			{times(10, () => (
				<div
					style={{
						borderBottom: '2px solid rgb(243, 246, 253)',
						height: '84px',
						position: 'relative',
						marginRight: '15px',
					}}
				>
					<ContentLoader speed={2} width={890} height={84} viewBox='0 0 890 84'>
						{/* Only SVG shapes */}
						<rect x='5' y='10' rx='5' ry='3' width='120' height='65' />
						<rect x='135' y='15' rx='5' ry='3' width='320' height='30' />
						<rect x='135' y='55' rx='5' ry='3' width='320' height='20' />
						<rect x='660' y='20' rx='5' ry='3' width='75' height='50' />
						<rect x='765' y='20' rx='5' ry='3' width='180' height='50' />
					</ContentLoader>
				</div>
			))}
		</motion.div>
	);
};
