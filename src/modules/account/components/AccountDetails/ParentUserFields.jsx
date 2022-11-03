import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { MessageBox } from 'components';
import { Button, LinkButton } from 'components/Buttons';
import { errorAlert, useSetState } from 'utils';
import { BooleanInput, Option, TextInput } from 'components/PropertyEditor';
import DropImageZone from 'modules/media/components/DropImageZone';
import { useAuthUser, useUserCommands } from '@/graphql/User/hooks';
import { getAcl } from '@/graphql/LocalState/acl';

/**
 * The account fields that can only be edited by the
 * parent user, these will be hidden for sub users.
 * @param parent_user_id
 * @param user
 * @param update
 * @param disableInputs
 * @returns {null|*}
 * @constructor
 */
export const ParentUserFields = () => {
	const acl = useReactiveVar(getAcl);

	if (acl.isSubUser) return null;

	return (
		<div className={'grid'}>
			<div className={'col6'}>
				<h3 className='form-heading'>Company Details</h3>
				<Form />
			</div>
			<div className={'col5'}>
				<MessageBox>
					<h3>Share Page Details</h3>
					<p>These settings allow you to customise your share pages</p>
					<p>
						<u>Hide Interactr Branding</u> - Remove the interactr logo from the
						heading of your share pages
					</p>
					<p>
						<u>Company Name</u> - This is shown at the bottom of the share page
						where we show the text "More Videos From 'Company Name'"
					</p>
					<p>
						<u>Company Icon</u> - Next to the company name mentioned above we
						also show a small icon or logo. Size (50px x 50px)
					</p>
				</MessageBox>
			</div>
		</div>
	);
};

const Form = () => {
	const user = useAuthUser();

	const [state, setState] = useSetState({
		// Need to save the company name to local state for performance on the text input
		company_name: user.company_name,
		loading: false,
	});

	const { saveUser, updateUser } = useUserCommands();

	const { company_name } = state;

	const handleSave = async () => {
		setState({ loading: true });

		try {
			await saveUser({
				variables: {
					input: {
						id: user.id,
						company_name,
						hide_logo_on_share_page: user.hide_logo_on_share_page,
						logo: user.logo,
					},
				},
			});
		} catch (e) {
			console.error(e);
			errorAlert({ text: 'Unable to save changes' });
		}
		setState({ loading: false });
	};

	// Save the user changes in the cache
	const handleUpload = ({ src }) => {
		updateUser({
			id: user.id,
			logo: src,
		});
	};

	const handleError = (error) => {
		return errorAlert({
			title: 'File Upload Error',
			text: error,
		});
	};

	return (
		<>
			<HideLogoOnSharePage update={updateUser} user={user} />

			<Option
				label='Company Name'
				name='company_name'
				value={company_name}
				Component={TextInput}
				onChange={(val) => setState({ company_name: val })}
				onEnter={handleSave}
			/>

			<div className='form-control'>
				<label>Company Logo</label>
				<div className={'grid'}>
					<div className={'col4'}>
						<img src={user.logo} className={'img-fluid'} />
					</div>
					<div className={'col8'}>
						<DropImageZone
							directory='companyLogos'
							onSuccess={handleUpload}
							onError={handleError}
						/>
					</div>
				</div>
			</div>

			<Button
				primary
				icon={'save'}
				loading={state.loading}
				onClick={handleSave}
			>
				Save Changes
			</Button>
		</>
	);
};

/**
 * If user has permissions show a toggle that allows them to hide the
 * interactr logo at the top of the share page.
 * @param user
 * @param setUser
 * @returns {null|*}
 * @constructor
 */
const HideLogoOnSharePage = ({ user, update, disableInputs }) => {
	// Can the user hide the interactr logo on the share page?
	const acl = useReactiveVar(getAcl);

	if (!acl.canHideLogoOnSharePage)
		return (
			<p style={{ marginTop: '30px' }}>
				<strong>Hide Interactr branding on share page</strong>
				<br />
				<em>
					You must upgrade your account to use this feature{' '}
					<LinkButton to={'/upgrade'}>upgrade here</LinkButton>.
				</em>
			</p>
		);

	return (
		<div className='form-control' style={{ marginTop: '30px' }}>
			<Option
				label='Hide Interactr branding'
				name='hide_logo_on_share_page'
				Component={BooleanInput}
				value={user.hide_logo_on_share_page}
				onChange={(val) =>
					update({ id: user.id, hide_logo_on_share_page: val })
				}
			/>
		</div>
	);
};
