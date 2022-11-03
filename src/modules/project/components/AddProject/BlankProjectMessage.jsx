import React from 'react';

import { getAsset } from 'utils';

export const BlankProjectMessage = () => {
	return (
		<img
			src={getAsset('/img/img-create-project.jpg')}
			className={'img-fluid'}
			style={{ maxHeight: '400px', marginLeft: '60px' }}
		/>
	);
};
