import React from 'react';

import { Icon } from 'components';
import { LinkButton } from 'components/Buttons';

export const AccountUpgradeMessage = () => {
	return (
		<div className='form-control'>
			<p>Background Animation Customization is only available to Pro Users</p>
			<p>
				<LinkButton to={'/upgrade'} small primary>
					<Icon name={'arrow-up'} /> Click Here to Upgrade
				</LinkButton>
			</p>
		</div>
	);
};
