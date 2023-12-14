import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

import { ErrorMessage, Icon } from 'components';
import { Button, IconButton } from 'components/Buttons';
import { BooleanInput, Option, TextInput } from 'components/PropertyEditor';
import ManageUserProjects from './ManageUserProjects';
import { useSetState } from 'utils/hooks';
import DropImageZone from 'modules/media/components/DropImageZone';

import styles from 'modules/modal/components/ModalEditor/ModalTabs/ModalTabs.module.scss';
import { errorAlert } from 'utils';
import validator from 'validator';
/**
 * Displays the form for creating or editing user item based on selected type
 * @param onDelete
 * @param onUpdate
 * @param onCreate
 * @param selectedUser
 * @param updateUser
 * @param disableInputs
 * @param reset
 * @returns {*}
 * @constructor
 */
const AgencyUserForm = ({
	onDelete,
	onUpdate,
	onCreate,
	selectedUser,
	updateUser,
	disableInputs,
	reset,
	assignedProjects,
	setAssignedProjects,
}) => {

	const [activeTab, setActiveTab] = useState('access');

	const NEW_USER = {
		id: '',
		name: '',
		email: '',
		password: '',
		company_name: '',
		logo: '',
		read_only: 0,
		projects: [],
	};
	
	const [state, setState] = useSetState(NEW_USER);

	useEffect(() => {
		if(selectedUser) {
			setState({
				id: selectedUser.id,
				name: selectedUser.name,
				email: selectedUser.email,
				password: selectedUser.password,
				company_name: selectedUser.company_name,
				logo: selectedUser.logo,
				read_only: selectedUser.read_only,
				projects: selectedUser.projects,
			}); 
		} else {
			setState(NEW_USER);
		}
	}, [selectedUser]);

	const changeHandler = (key) => (value) => {				
		setState({ [key]: value });
	};

	const handleCreateUser = (user) => {
		const email = user?.email
		const isValid = validator.isEmail(email);
		if(!isValid){
		  errorAlert({text:'Email is invalid.'})
		  return	
		}
		delete user.id;
		user.agency_page = 1;
		onCreate(user);
	};

	const onSubmit = () => {
		if (selectedUser) {
			const { parent, ...userData } = state;

			return onUpdate({ ...userData });
		}

		return handleCreateUser({ ...state });
	};

	return (
		<div>
			<div style={{height: '650px'}}>
				<Headings activeTab={activeTab} setActiveTab={setActiveTab} />
				<ModalBody
					activeTab={activeTab}
					user={state}
					changeHandler={changeHandler}
					disableInputs={disableInputs}
					onCreate={onCreate}
					onDelete={onDelete}
					assignedProjects={assignedProjects}
					setAssignedProjects={setAssignedProjects}
				/>
			</div>
			<div className="modal-footer">
			   <div>
			       <Button
			           icon="save"
			           right
			           loading={disableInputs}
			           primary
			           onClick={() => onSubmit()}
			       >
			           Save
			       </Button>
			   </div>
			   <Button left onClick={reset} icon="arrow-left">
			       Back
			   </Button>
			</div>
		</div>
	);
};

export default AgencyUserForm;

const Headings = ({ activeTab, setActiveTab }) => {
	return (
		<ul className={cx(styles.tabs, 'clearfix')} style={{ paddingLeft: 20 }}>
			<li
				className={cx(styles.tab, { [styles.active]: activeTab === 'access' })}
				onClick={() => setActiveTab('access')}
			>
				{/* <Icon icon="" />  */}
				Access Details
			</li>
			<li
				className={cx(styles.tab, { [styles.active]: activeTab === 'client' })}
				onClick={() => setActiveTab('client')}
			>
				{/* <Icon icon="" />  */}
				Company Details
			</li>
			<li
				className={cx(styles.tab, {
					[styles.active]: activeTab === 'projects',
				})}
				onClick={() => setActiveTab('projects')}
			>
				{/* <Icon icon="" />  */}
				Projects
			</li>
		</ul>
	);
};

const ModalBody = ({
	activeTab,
	changeHandler,
	user,
	disableInputs,
	onDelete,
	assignedProjects,
	setAssignedProjects,
}) => {

	const tabAnimation = {
		animate: { y: 0, opacity: 1 },
		initial: { y: 25, opacity: 0 },
		transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
	};

	switch (activeTab) {
		case 'access':
			return (
				<AccessDetails
					tabAnimation={tabAnimation}
					changeHandler={changeHandler}
					disableInputs={disableInputs}
					user={user}
					onDelete={onDelete}
				/>
			);
		case 'client':
			return (
				<ClientDetails
					tabAnimation={tabAnimation}
					changeHandler={changeHandler}
					disableInputs={disableInputs}
					user={user}
				/>
			);
		case 'projects':
			return (
				<Projects
					tabAnimation={tabAnimation}
					changeHandler={changeHandler}
					user={user}
					assignedProjects={assignedProjects}
					setAssignedProjects={setAssignedProjects}
				/>
			);
	}
};

const AccessDetails = ({
	tabAnimation,
	disableInputs,
	changeHandler,
	user,
	onDelete,
}) => {
	const { name, email, password, read_only, id } = user;
	return (
		<motion.div {...tabAnimation}>
			<div className='grid'>
				<div className='col12'>
					<Option
						label='Name'
						value={name}
						Component={TextInput}
						onChange={changeHandler('name')}
						disabled={disableInputs}
					/>
					<Option
						label='Email'
						value={email}
						Component={TextInput}
						placeholder='me@myemail.com'
						onChange={changeHandler('email')}
						disabled={disableInputs}
					/>
					<Option
						label='Password'
						value={password}
						Component={TextInput}
						onChange={changeHandler('password')}
						disabled={disableInputs}
					/>
					<Option
						label='Read Only'
						value={read_only}
						Component={BooleanInput}
						onChange={changeHandler('read_only')}
						disabled={disableInputs}
					/>
					{id ? (
						<Button
							red
							onClick={() => onDelete(id)}
							style={{ float: 'left', color: '#fff', zIndex: 111 }}
							icon='trash-alt'
						>
							Delete User
						</Button>
					) : null}
				</div>
			</div>
		</motion.div>
	);
};

const ClientDetails = ({
	tabAnimation,
	disableInputs,
	changeHandler,
	user,
}) => {
	const { company_name, logo } = user;

	const handleUpload = ({ src }) => {
		changeHandler('logo')(src);
	};

	const handleError = (error) => {
		return errorAlert({
			title: 'File Upload Error',
			text: error,
		});
	};

	return (
		<motion.div {...tabAnimation}>
			<div className='grid'>
				<div className='col12'>
					<Option
						label='Company Name'
						value={company_name}
						Component={TextInput}
						onChange={changeHandler('company_name')}
						disabled={disableInputs}
					/>
					<div className='form-control'>
						<label>Company Logo</label>
						<div className={'grid'}>
							{/* <div className='vertical-center' style={{ width: '600px', height: '170px', marginTop: '10px', marginBottom: '10px', marginRight: 'auto', marginLeft: 'auto', overflow: 'hidden', borderRadius: '10px'}}>
								<img src={user.logo} className={'img-fluid'} style={{width: '100%', margin: '0 auto', height: 'max-content', maxHeight: 'max-content'}} />
							</div> */}
							<div className={'col12'}>
								<DropImageZone
									directory='companyLogos'
									onSuccess={handleUpload}
									src={user.logo}
									onError={handleError}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const Projects = ({
	tabAnimation,
	changeHandler,
	user,
	assignedProjects,
	setAssignedProjects,
}) => {
	return (
		<motion.div {...tabAnimation}>
			<div className='grid'>
				<div className='col12'>
					<ManageUserProjects
						user={user}
						changeHandler={changeHandler}
					/>
				</div>
			</div>
		</motion.div>
	);
};
