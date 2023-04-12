import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import cx from 'classnames';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';

import {
	Section,
	Option,
	SelectInput,
	TextInput,
	BooleanInput,
	TimeRangeInput,
} from 'components/PropertyEditor';
import {
	setAddModal,
	getAddModal,
	ADD_MODAL_VAR_INITAL_DATA,
} from '@/graphql/LocalState/addPopup';
import {
	ButtonElementClickFacebookToggle,
	FormSubmitFacebookToggle,
	HotspotElementClickFacebookToggle,
	ImageElementClickFacebookToggle,
} from '../ElementClickFacebookToggles';
import SelectNode from 'modules/node/components/SelectNode';
import { SelectModal } from 'modules/modal/components/SelectModal/SelectModal';
import { Button } from 'components/Buttons';
import { ErrorMessage, Icon } from 'components';
import { InteractionFacebookToggle } from 'modules/integration/components';
import ElementSurveyToggle from '../ElementSurveyToggle';
import { SAVE_NODE_PAGE } from 'utils/EventEmitter';
import InteractionTime from 'modules/interaction/components/InteractionTime';

/**
 * Validate the inputs for the component
 * @type {{update: (shim|(function(*, *, *, *, *, *): (undefined))), loading: {new(...args: A): R} | ((...args: A) => R) | OmitThisParameter<T> | T | any | {new(...args: AX[]): R} | ((...args: AX[]) => R), element}}
 * @private
 */
const _props = {
	element: PropTypes.shape({
		action: PropTypes.string.isRequired,
		actionArg: PropTypes.any,
	}),
	update: PropTypes.func.isRequired,
};

/**
 * Properties for elements that are clickable
 * @param element
 * @param update
 * @param loading
 * @returns {*}
 * @constructor
 */
const ClickableElementProperties = ({
	element,
	update,
	actionTitle,
	options,
	meta,
	tabAnimation,
	actionLabel = 'action',
	actionArgLabel = 'actionArg',
	wrapperStyle,
	onSave,
}) => {
	if (!element) return null;
	const { id, action, send_survey_click_event, __typename } = element;

	const save = onSave
		? onSave
		: (data) => {
			const event = new CustomEvent(SAVE_NODE_PAGE, {
				detail: {
					__typename,
					id,
					...data,
				},
			});
			window.dispatchEvent(event);
		};
	
	return (
		<motion.div {...tabAnimation}>
			<Section wrapperStyle={wrapperStyle}>
				{!!meta && meta}
				<Option
					label={actionTitle || 'On Click'}
					value={action}
					onChange={(val) => {
						save({
							[actionLabel]: val,
							[actionArgLabel]: '',
						});
					}}
					Component={SelectInput}
					options={options}
				/>
				<ActionArgsSwitch
					update={update}
					save={save}
					element={element}
					label={actionArgLabel}
				/>

				{__typename === 'Node' ||
				__typename === 'FormElement' ||
				__typename === 'TriggerElement' ? null : (
					<ElementSurveyToggle
						value={send_survey_click_event}
						onChange={(val) => update('send_survey_click_event', val)}
					/>
				)}

				{__typename === 'ButtonElement' && (
					<ButtonElementClickFacebookToggle
						updateContext={update}
						element={element}
					/>
				)}
				{__typename === 'ImageElement' && (
					<ImageElementClickFacebookToggle
						updateContext={update}
						element={element}
					/>
				)}
				{__typename === 'HotspotElement' && (
					<HotspotElementClickFacebookToggle
						updateContext={update}
						element={element}
					/>
				)}
				{__typename === 'FormElement' && (
					<FormSubmitFacebookToggle updateContext={update} element={element} />
				)}

				<div style={{ width: '100%', float: 'left' }}>
					<InteractionFacebookToggle />
				</div>
			</Section>
		</motion.div>
	);
};

ClickableElementProperties.propTypes = _props;

export default ClickableElementProperties;

/**
 * Render the argument select conditionally based on action
 * type selected
 * @param update
 * @param element
 * @param label
 * @returns {*}
 * @constructor
 */
export const ActionArgsSwitch = ({ update, element, label, save }) => {
	switch (element.action) {
		case 'playNode':
			return (
				<NodeSelect value={element.actionArg} update={save} label={label} />
			);
		case 'openModal':
			return (
				<ModalSelect
					element={element}
					update={update}
					save={save}
					label={label}
				/>
			);
		case 'openUrl':
			return (
				<UrlSelect
					value={element.actionArg}
					open_in_new_tab={element.open_in_new_tab}
					update={update}
					label={label}
				/>
			);
		case 'skipToTime':
			return (
				<TimeSelect value={element.actionArg} update={update} label={label} />
			);
		default:
			return null;
	}
};

/**
 * Render all the nodes that can be selected as a dropdown
 * @param value
 * @param update
 * @param key
 * @returns {*}
 * @constructor
 */
const NodeSelect = ({ value, update, label }) => {
	return (
		<div className={'mb-2'}>
			<Option
				label='Node'
				value={value}
				Component={SelectNode}
				onChange={(val) => update({ [label]: val })}
				className='w-100'
			/>
			{!!value && <PreviewNode id={value} />}
		</div>
	);
};

/**
 * Show the user a preview of the node so they can easily see
 * which node has been selected
 * @param id
 * @returns {null|*}
 * @constructor
 */
const QUERY = gql`
	query node($nodeId: ID!) {
		node(id: $nodeId) {
			id
			background_color
			media {
				id
				thumbnail_url
				is_image
			}
		}
	}
`;
const PreviewNode = ({ id }) => {
	const { data, error, loading } = useQuery(QUERY, {
		variables: {
			nodeId: parseInt(id),
		},
	});

	const width = 460;
	const height = 259;

	if (loading)
		return (
			<ContentLoader
				speed={3}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				backgroundColor='#f3f6fd'
			>
				{/* Only SVG shapes */}
				<rect x='0' y='0' rx='3' ry='3' width={width} height={height} />
			</ContentLoader>
		);

	if (error) return <ErrorMessage error={error} />;

	const { node } = data;

	// This is to catch if the node has been deleted. It would be good to add in a
	// background function to change the action arg here later
	if (!node) return null;

	return (
		<>
			<label>Node Thumbnail</label>
			{node.media ? (
				<div style={{position: 'relative', maxHeight: '380px', paddingBottom: '56.25%', display: 'flex', justifyContent: 'center', backgroundColor: '#eee'}}>
					<img src={node.media.thumbnail_url} className={'img-fluid'} style={{position: 'absolute', top: 0, height: '100%'}} />
				</div>
			) : (
				<div
					style={{
						height: '259px',
						width: '460px',
						background: node.background_color,
						border: '1px solid #d2d6dc',
					}}
				>
					&nbsp;
				</div>
			)}
		</>
	);
};

/**
 * Render all the modals from the project as a dropdown select list
 * @param element
 * @param update
 * @param label
 * @returns {*}d
 * @constructor
 */
const ModalSelect = ({ element: { actionArg }, update }) => {
	const { newModalObject, currentModalId } = useReactiveVar(getAddModal);

	const handleModalCreate = useCallback(async () => {
		try {
			await update({
				actionArg: currentModalId,
			});
		} catch (error) {
			console.log(error.message);
		}
	}, [currentModalId, update]);

	const handleModalSelect = useCallback(async () => {
		try {
			await update({
				actionArg: newModalObject.id,
			});
		} catch (error) {
			console.log(error.message);
		}
	}, [newModalObject, update]);

	useEffect(() => {
		// If the element popup is selected and it's not a template or blank
		// update current element's action arg to selected modal's id
		if (newModalObject && !newModalObject.is_template) {
			(async () => {
				await handleModalSelect();
				setAddModal({
					...ADD_MODAL_VAR_INITAL_DATA,
				});
			})();
		}

		// If the element popup is blank, update current element's
		// action arg with the newly craeted popups' id
		if (currentModalId) {
			(async () => {
				await handleModalCreate();
				setAddModal({
					...ADD_MODAL_VAR_INITAL_DATA,
				});
			})();
		}
	}, [handleModalCreate, handleModalSelect, currentModalId, newModalObject]);

	return (
		<div className={cx('clearfix')} style={{ marginBottom: '30px' }}>
			<Option
				label='Select a Popup'
				value={actionArg}
				update={update}
				Component={SelectModal}
				preview={true}
			/>
		</div>
	);
};

/**
 * Render the URL select text input with the toggle to  open url
 * in a new tab
 * @param value
 * @param update
 * @param open_in_new_tab
 * @returns {*}
 * @constructor
 */
const UrlSelect = ({ value, update, open_in_new_tab, label }) => {
	return (
		<React.Fragment>
			<Option
				label='Url'
				name='actionArg'
				value={value}
				Component={TextInput}
				onChange={(val) => update(label, val)}
				placeholder='ex. http://google.com'
			/>
			{
				// We only show this option when it's from a click element or the viewer will get popup blocked
				!!open_in_new_tab && (
					<Option
						label='Open the url in a new tab'
						name='open_in_new_tab'
						Component={BooleanInput}
						onChange={(val) => update('open_in_new_tab', val)}
						value={open_in_new_tab}
					/>
				)
			}
		</React.Fragment>
	);
};

/**
 * Render a time input to select the time to jump to
 * @param value
 * @param update
 * @returns {*}
 * @constructor
 */
const PLAYER_QUERY = gql`
	query player {
		player @client {
			duration
			playedSeconds
		}
	}
`;
const TimeSelect = ({ value, update, label }) => {
	const { data, loading, error } = useQuery(PLAYER_QUERY);

	if (loading || error) return null;

	// Catch loading and error states here
	if (!data) return null;

	const { duration, playedSeconds } = data.player;

	const handleChange = (val) => {
		update(label, val + "");
	}

	return (
		<div className={cx('clearfix', 'mb-2')}>
			<InteractionTime
				label='Select Time'
				fontSize={'100%'}
				value={value}
				component={TimeRangeInput}
				onChange={handleChange}
				max={duration}
				actions={
					<div>
						<Button
							small
							primary
							tooltip='Skip to video start'
							onClick={() => update(label, 0)}
						>
							<Icon name={'arrow-to-left'} style={{ marginRight: 0 }} />
						</Button>
						<Button
							small
							primary
							tooltip='Skip To Current Video Time'
							onClick={() => update(label, playedSeconds)}
						>
							<Icon name={'stopwatch'} style={{ marginRight: 0 }} />
						</Button>
						<Button
							small
							primary
							tooltip='Skip to video end'
							onClick={() => update(label, duration)}
						>
							<Icon name={'arrow-to-right'} style={{ marginRight: 0 }} />
						</Button>
					</div>
				}
			/>
		</div>
	);
};
