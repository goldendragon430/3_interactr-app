import React, { useEffect, useState } from 'react';
import PageBody, {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import Icon from '../../../../components/Icon';
import ErrorMessage from '../../../../components/ErrorMessage';
import {
	getBreadcrumbs,
	setBreadcrumbs,
} from '../../../../graphql/LocalState/breadcrumb';
import { AnimatePresence, motion } from 'framer-motion';
import { accountPath } from '../../routes';
import { setPageHeader } from '../../../../graphql/LocalState/pageHeading';
import PersonalDetails from './PersonalDetails';
import UserAvatar from './UserAvatar';
import ResetPassword from './ResetPassword';
import styles from '../../../agency/components/AgencyAppSetup/AgencyAppSetupPage.module.scss';
import { ParentUserFields } from './ParentUserFields';
import AccountDetailsCredentials from '../AccountDetailsCredentials';

/**
 * Show the form for a user to edit their account details
 * @returns {*}
 * @constructor
 */
const AccountDetailsPage = () => {
	useEffect(() => {
		setBreadcrumbs([
			{ text: 'Account', link: accountPath() },
			{ text: 'Details' },
		]);

		setPageHeader('Manage Your Account');
	}, []);

	return (
		<Page>
			<UserAvatar />

			<Divider />

			<PersonalDetails />

			<Divider />

			<ResetPassword />

			<Divider />

			<ParentUserFields />

			{/* TODO Update the API so its more useful to users */}
			{/*<Divider />*/}
			{/*<AccountDetailsCredentials />*/}
		</Page>
	);
};

/**
 * The base page for the component
 * @param children
 * @param parent_user_id
 * @returns {*}
 * @constructor
 */
const Page = ({ children }) => {
	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
			>
				<div style={{ paddingLeft: '30px', paddingBottom: '150px' }}>
					{children}
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default AccountDetailsPage;

const Divider = () => {
	return <div className={styles.divider}>&nbsp;</div>;
};
