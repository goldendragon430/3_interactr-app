import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { SourceMedia } from '../SourceMedia';
import { IsStartNodeToggle } from './IsStartNodeToggle';
import { Option, RangeInput, TextInput } from 'components/PropertyEditor';
import { useNodeCommands } from '@/graphql/Node/hooks';

export const NodeProperties = ({ node }) => {
	const { id, name: initialName, duration: initialDuration } = node;
	const { updateNode } = useNodeCommands(id);

	const [name, setName] = useState(initialName);
	useEffect(() => {
		updateNode({ name });
	}, [name]);

	const [duration, setDuration] = useState(initialDuration);
	useEffect(() => {
		updateNode({ duration });
	}, [duration]);

	// if (node?.media && !node?.media?.is_image) return null;
	
	return (
		<div style={{ marginTop: '-15px', textAlign: 'left' }}>
			<Option
				label='Node Name'
				value={name}
				Component={TextInput}
				onChange={(val) => setName(val)}
			/>
			{/* <IsStartNodeToggle  /> */}
			<SourceMedia node={node} />
			{
				(!node.media || node.media?.is_image) ?
					<div className={'form-control'} style={{ marginTop: 60 }}>
						<Option
							label='Node Duration (Secs)'
							value={duration}
							Component={RangeInput}
							onChange={(val) => setDuration(val)}
							onAfterChange={(val) => updateNode({ duration: val })}
							max={200}
						/>
					</div>
					: <></>
			}
		</div>
	);
};

NodeProperties.propTypes = {
	node: PropTypes.element.isRequired,
};
