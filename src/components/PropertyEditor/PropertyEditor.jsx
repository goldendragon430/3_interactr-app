import ColorPicker from 'components/ColorPicker';
import Icon from 'components/Icon';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import Toggle from 'react-toggle';
import styles from './PropertyEditor.module.scss';
import ScalarInput from './ScalarInput';
//import 'react-select/dist/react-select.css';
// import ReactTimeInput from 'components/TimeInput';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { secondsFromTime, timeFromSeconds } from 'utils/timeUtils';
//import AsyncPaginate from 'react-select-async-paginate';
// import HelpText from 'components/HelpText';
import cx from 'classnames';
// import { randomString } from 'utils/domUtils';
// import { handleStateChange } from '../../utils/hooks';
import uniqueId from 'lodash/uniqueId';
import Routes from 'react-switch';
import ReactTooltip from 'react-tooltip';
// import debounce from 'lodash/debounce';
import AceEditor from 'react-ace';

import { useReactiveVar } from '@apollo/client';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import { getWhitelabel } from '../../graphql/LocalState/whitelabel';

import { GET_ELEMENT_GROUPS } from '@/graphql/ElementGroup/queries';
import { useQuery } from '@apollo/client';
import { REFETCH_GROUPS } from 'utils/EventEmitter';

const SMALL_STYLES = {
	padding: '5px',
	fontSize: '11px',
};

export const Section = ({
	title,
	children,
	icon,
	className,
	noHeading,
	wrapperStyle,
}) => {
	const whitelabel = useReactiveVar(getWhitelabel);

	const classList =
		title && title.toLowerCase() === 'admin' ? styles.admin : className;
	const whitelabelStyles =
		whitelabel && whitelabel.background_colour
			? {
					borderColor: whitelabel.background_colour,
					color: whitelabel.background_colour,
			  }
			: {};

	return (
		<section className={classList}>
			{!noHeading && title && (
				<div className={styles.header} style={whitelabelStyles}>
					{icon && <Icon name={icon} />}
					{title}
				</div>
			)}
			<div className={styles.content} style={wrapperStyle}>
				{children}
			</div>
		</section>
	);
};

export function Option({
	label,
	Component,
	value,
	id,
	onChange,
	helpText,
	children,
	style,
	className,
	...props
}) {
	// make sure we have an id so label htmlFor works
	id = id || uniqueId();
	value = value || ''; // stop react warnings

	return (
		<div className={cx('form-option', className)} style={style}>
			{!!label && (
				<label htmlFor={id}>
					{!!helpText && (
						<>
							<ReactTooltip id={id} />
							<Icon name='question-circle' data-tip={helpText} data-for={id} />
						</>
					)}
					{label}
				</label>
			)}
			<Component
				id={id}
				value={value}
				onChange={wrapOnChangeWithValue(onChange)}
				{...props}
			/>
			{!!children && children}
		</div>
	);
}

// export class Option extends React.Component{
//   render(){
//     let {label, Component, value, id, onChange, helpText} = this.props;
//     // make sure we have an id so label htmlFor works
//     id = id || label;
//     value = value || ''; // stop react warnings
//
//     return(
//       <div className="form-control">
//         <label htmlFor={id}>{label} <HelpText helpText={helpText} /></label>
//         <Component
//           id={id}
//           value={value}
//           onChange={wrapOnChangeWithValue(onChange)}
//           {...this.props}
//         />
//       </div>
//     )
//   }
// }

// If onChange signature isn't (e, val) makes 2nd argument
// e.target.value
const wrapOnChangeWithValue =
	(onChange) =>
	(e, val, ...args) => {
		if (isUndefined(val) && e && e.target) {
			const { checked, value, type } = e.target;
			val = type == 'checkbox' ? checked : value;
		}

		onChange(e, val, ...args);
	};

export function PositionInput(props) {
	return <ScalarInput labels={['x', 'y']} {...props} />;
}

export function SizeInput(props) {
	return (
		<ScalarInput labels={['Max Width (px)', 'Max Height (px)']} {...props} />
	);
}

/**
 * Text Input for forms
 * @param onChange
 * @param onEnter
 * @param autofocus
 * @param small
 * @param value
 * @param onBlur
 * @param props
 * @returns {*}
 * @constructor
 */
export function TextInput({
	onChange,
	onEnter,
	autofocus = false,
	small,
	value,
	onBlur = null,
	...props
}) {
	// const [focused, setFocused] = useState(false);
	const inputRef = useRef(null);

	const style = small ? SMALL_STYLES : {};

	useEffect(() => {
		// A small delay that allows the input field to mount before autofocus set
		setTimeout(() => {
			if (autofocus && inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}, 1);
	});

	const changeHandler = (e) => {
		const val = e.target.value;
		onChange(val);
	};

	const onBlurHandler = (e) => {
		if (onBlur) {
			const val = e.target.value;
			onBlur(val);
		}
	};

	return (
		<input
			ref={inputRef}
			type='text'
			value={value}
			style={style}
			title={value}
			disabled={props.disabled}
			placeholder={props.placeholder}
			onChange={changeHandler}
			onBlur={onBlurHandler}
			onKeyDown={(e) => e.stopPropagation()}
			onKeyPress={(e) => (e.key === 'Enter' ? onEnter(e.target.value) : null)}
			{...props}
		/>
	);
}

/**
 * Integer form input
 * @param props
 * @returns {*}
 * @constructor
 */
export function IntegerInput(props) {
	const input = <input type='number' {...props} />;

	if (!props.help) return input;

	return (
		<div>
			{input}
			<small>{props.help}</small>
		</div>
	);
}

/**
 * TextArea form input
 * @param value
 * @param props
 * @returns {*}
 * @constructor
 */
export function LargeTextInput({ value, onChange, ...props }) {
	const changeHandler = (e) => {
		onChange(e.target.value);
	};

	return (
		<textarea
			{...props}
			onChange={changeHandler}
			value={value || ''}
			rows={props.rows || 5}
		/>
	);
}

export function HtmlInput({
	value,
	onChange,
	width = '450px',
	height = '500px',
}) {
	const [id] = useState(uniqueId());

	return (
		<AceEditor
			mode='html'
			value={value}
			theme='monokai'
			onChange={onChange}
			name={id}
			width={width}
			height={height}
			editorProps={{ $blockScrolling: true }}
		/>
	);
}

export const ColorInput = ColorPicker;

/**
 * Form input for selecting a number between a max and min value
 * using a slider
 * @param value
 * @param onChange
 * @param min
 * @param max
 * @param step
 * @returns {*}
 * @constructor
 */
export function RangeInput({ value, onChange, min, max, step, onAfterChange }) {
	min = min || 0;

	//  TODO need to debounce this
	const changeHandler = (e) => {
		if(typeof e.target === 'undefined') {
			onChange(e);
			return;
		}
		let value = parseInt(e.target.value);
		value = Math.max(min, Math.min(value, max));
		onChange(value);
	};

	const onAfterChangeHandler = (e) => {
		const val = typeof e.target === 'undefined' ? e : parseInt(e.target.value);

		if (onAfterChange) {
			onAfterChange(val);
		} else {
			onChange(val);
		}
	};

	if (!step) step = 1;

	if (!value) {
		value = 0;
	}
	return (
		<div className='grid' style={{ margin: 0 }}>
			<div style={{ paddingLeft: 0, width: '80%' }}>
				<Slider
					className={styles.slider}
					min={min}
					max={max}
					step={step}
					value={value}
					// defaultValue={value}
					onChange={changeHandler}
					onAfterChange={onAfterChangeHandler}
				/>
			</div>
			<div style={{ paddingRight: 0, width: '15%', marginLeft: '5%' }}>
				<input
					type='text'
					value={isNaN(value) ? 0 : value.toString()}
					onChange={changeHandler}
				/>
			</div>
		</div>
	);
}

/**
 * Multi select form input
 * @param name
 * @param value
 * @param options
 * @param onChange
 * @param multi
 * @param clearable
 * @returns {*}
 * @constructor
 */
export function MultiSelect({
	value,
	options,
	onChange,
	multi,
	clearable = false,
}) {
	// If multiselect we get back an array
	const changeHandler = (selected) => {
		onChange(selected);
	};

	return (
		<Select
			value={value}
			options={options}
			onChange={changeHandler}
			clearable={clearable}
			multi={multi}
		/>
	);
}

/**
 * Select input form component
 * @param value
 * @param onChange
 * @param options - Should be an object with key value pairs for {value:label} for example { optionOne: "Option One", optionTwo: "Option Two"}
 * @param clearable - Controls if the select should be clearable with an X once a value is selected
 * @param disabled
 * @param props
 * @returns {*}
 * @constructor
 */
// eslint-disable-next-line react/display-name
export const SelectInput = ({
	value,
	onChange,
	options,
	clearable = false,
	disabled = false,
	...props
}) => {
	// Uses the react select library
	// https://github.com/JedWatson/react-select
	
	const { nodeId } = useParams();

	const { data, loading, error, refetch } = useQuery(GET_ELEMENT_GROUPS, {
		fetchPolicy: 'cache-only',
		variables: { nodeId: Number(nodeId) },
	});
	
	const handleRefetch = useCallback(async () => {
		const res = await refetch();
		const newGroup = res.data.result.filter(val => !data.result.includes(val))[0];
		onChange(newGroup.id);
	}, [data, refetch, onChange]);

	useEffect(() => {
		window.addEventListener(REFETCH_GROUPS, () => handleRefetch());
    	return window.removeEventListener(REFETCH_GROUPS, handleRefetch);
	}, [handleRefetch, value]);

	const changeHandler = (selected) => {
		onChange(
			typeof selected == 'object' && selected.hasOwnProperty('value')
				? selected.value
				: selected
		);
	};

	if (!Array.isArray(options)) {
		// Format the object to an array for the dropdown component
		options = reduce(
			options,
			(optionsAsArray, label, val) => {
				return [
					...optionsAsArray,
					{
						label,
						value: val,
						clearableValue: false,
					},
				];
			},
			[]
		);
	}

	const customStyles = {
		menu: (provided, state) => ({
			...provided,
			zIndex: 500
		}),

		control: (provided, state) => ({
			...provided,
			borderRadius : 10
		}),
	}

	return (
		<Select
			defaultValue={options.filter(item => item.value == value)}
			options={options}
			onChange={changeHandler}
			// clearable={clearable}
			// this will set high priority to dropdown menu visibility
			styles={customStyles}
			isDisabled={disabled}
			{...props}
		/>
	);
}

/**
 * True false form inputs, currently used as a toggle
 * @param value
 * @param onChange
 * @param id
 * @param name
 * @param rest
 * @returns {*}
 * @constructor
 */
export function BooleanInput({ value, onChange, id, ...rest }) {
	const changeHandler = (e) => {
		const value = e.target.checked ? 1 : 0;
		onChange(value);
	};
	return <Toggle checked={!!value} onChange={changeHandler} {...rest} />;
}

/**
 * Inline version of the boolean toggle
 * @param value
 * @param onChange
 * @param label
 * @returns {*}
 * @constructor
 */
export function InlineBooleanInput({ value, onChange, label }) {
	return (
		<label style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
			<span style={{ paddingRight: '10px' }}>{label}</span>
			<Routes
				onChange={onChange}
				checked={value}
				onColor='#86d3ff'
				onHandleColor='#2693e6'
				handleDiameter={24}
				uncheckedIcon={false}
				checkedIcon={false}
				boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
				activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
				height={16}
				width={38}
			/>
		</label>
	);
}

/**
 * An input that formats the value as seconds before
 * rendering a text input. This gets a lil messy. To
 * keep this editable we need to change the defaultValue
 * on blur but this isn't reactive. The solution is to
 * render a reactive text value which will update whenever
 * the value updates. Then when users clicks to update we
 * replace the text with a uncontrolled thats not bound to
 * anything, then onBlur we update the value and switch back
 * to the text value being shown.
 * @param name
 * @param value
 * @param onChange
 * @param initMount
 * @param interactionId
 * @returns {*}
 * @constructor
 */
export function TimeInput({
	value: _value,
	onChange: _onChange,
	max,
	min = 0,
	fontSize,
	...props
}) {
	const [editing, setEditing] = useState(false);
	const value = timeFromSeconds(_value);

	if (!editing) {
		// Allow the manual override of the size
		const style = {
			fontSize: fontSize ? fontSize : '80%',
		};

		return (
			<>
				<ReactTooltip id='timetip' />
				<div
					style={{ cursor: 'pointer', marginTop: '5px' }}
					data-for='timetip'
					data-tip='Click to Edit'
					onClick={() => setEditing(true)}
				>
					<small style={style}>{value}</small>
				</div>
			</>
		);
	}

	const onBlur = (value) => {
		setEditing(false);
		// Format before save
		const seconds = secondsFromTime(value, min, max);
		_onChange(seconds);
	};

	// Render the usual TextInput and pass through all the props
	return (
		<>
			<TextInput
				autofocus
				{...props}
				// onChange={_onChange}
				onChange={onBlur}
				defaultValue={_value}
			/>
			<small>
				Format Minutes : Seconds : Milliseconds <strong>(01:01:001)</strong>
			</small>
		</>
	);
}

export const TimeRangeInput = ({
	value: _value,
	onChange: _onChange,
	max,
	min = 0,
}) => {
	const [formattedValue, setFormattedValue] = useState('00:00:000');
	const [rawValue, setRawValue] = useState(_value);

	useEffect(() => {
		setRawValue(_value);
		setFormattedValue(timeFromSeconds(_value));
	}, [_value]);

	const changeHandler = (val) => {
		setRawValue(val);
		setFormattedValue(timeFromSeconds(val));
	};

	const afterChangeHandler = (val) => {
		setRawValue(val);
		setFormattedValue(timeFromSeconds(val));
		_onChange(val);
	};

	return (
		<div className='grid' style={{ margin: 0 }}>
			<div style={{ paddingLeft: 0, width: '75%' }}>
				<Slider
					className={styles.slider}
					min={min}
					max={max}
					step={0.1}
					value={rawValue}
					onAfterChange={afterChangeHandler}
					onChange={changeHandler}
				/>
			</div>
			<div style={{ paddingRight: 0, width: '20%', marginLeft: '5%' }}>
				<input
					type='text'
					value={formattedValue}
					disabled={true}
					style={{ paddingRight: 0, paddingLeft: 0, textAlign: 'center' }}
				/>
			</div>
		</div>
	);
};

export const Checkbox = ({ value, onChange }) => {
	const changeHandler = (e) => {
		onChange(e.target.checked ? 1 : 0);
	};

	return <input type='checkbox' checked={value} onChange={changeHandler} />;
};