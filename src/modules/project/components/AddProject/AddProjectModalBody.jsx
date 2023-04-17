import React from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { LargeTextInput, Option } from 'components/PropertyEditor';
import { AddProjectGroupSelect } from './AddProjectGroupSelect';
import { BlankProjectMessage } from './BlankProjectMessage';
import { PreviewTemplateProject, randomNumberStr } from '../ProjectPreview';
import { ProjectRatio } from './ProjectRatio';
import { getAddProject } from '@/graphql/LocalState/addProject';

export const AddProjectModalBody = ({
	state,
	onClose,
	setState,
	handleSubmit,
	loading,
}) => {
	const { templateId, show } = useReactiveVar(getAddProject);
	const { title, description } = state;
	
	return (
		<Modal
			show={show}
			onClose={onClose}
			height={650}
			width={1300}
			heading={
				<>
					<Icon name='plus' /> Create New Project
				</>
			}
			onBack={onClose}
			submitButton={
				<Button primary icon='plus' onClick={handleSubmit} loading={loading}>
					Create New Project
				</Button>
			}
		>
			<div className={'grid'}>
				<div className={'col7'}>
					{templateId ? (
						<PreviewTemplateProject
							cacheBuster={randomNumberStr()}
							projectId={templateId}
						/>
					) : (
						<BlankProjectMessage />
					)}
				</div>
				<div className={'col5'} style={{ height: '480px', overflow: 'auto'}}>
					<div className='form-control'>
						<label htmlFor='title'>Enter a name for your project</label>
						<input
							id='title'
							type='text'
							name='title'
							value={title}
							onChange={(e) => setState({ title: e.target.value })}
						/>
					</div>
					<div className='form-control'>
						<Option
							label='Add a description if you like'
							name='description'
							value={description}
							Component={LargeTextInput}
							onChange={(val) => setState({ description: val })}
						/>
					</div>
					{
						!templateId ?
						<div className='form-control'>
							<ProjectRatio 
								onChange={(val) => setState({ base_width: val })}
							/>
						</div> : null
					}
					<AddProjectGroupSelect state={state} setState={setState} />
				</div>
			</div>
		</Modal>
	);
};

AddProjectModalBody.propTypes = {
	onClose: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired,
	setState: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};