import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _filter from 'lodash/filter';
import _debounce from 'lodash/debounce';
import { useParams } from 'react-router-dom';

import { Icon } from 'components';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';
import { setAddModal } from '@/graphql/LocalState/addPopup';
import { fetchStats } from '../../utils';
import { ModalsList } from './ModalsList';
import filterInputStyles from 'components/FilterInput.module.scss';

export const ModalsPageBody = ({ data }) => {
	const { projectId } = useParams();
	const [searchTerm, setSearchTerm] = useState('');
	const [loadingStats, setLoadingStats] = useState(true);
	const [stats, setStats] = useState(false);

	useEffect(() => {
		fetchStats(modals)
			.then((data) => {
				setStats(data);
				setLoadingStats(false);
			})
			.catch((err) => {
				console.error(err);
				setLoadingStats(false);
			});
	}, []);

	let modals = data.result;

	if (searchTerm) {
		modals = _filter(modals, (modal) => {
			return modal.name.toLowerCase().includes(searchTerm.toLowerCase());
		});
	}

	const handleCreatePopup = () => {
		setAddModal({
			showSelectPopupTypeModal: true,
			projectId: parseInt(projectId),
		});
	};
	
	return (
		<section style={{ width: '1200px' }}>
			<div className={'grid'}>
				<div className={'col6'}>
					<h2 style={{ marginTop: 0, marginBottom: '15px' }}>Your Popups</h2>
				</div>
				<div className={'col4'}>
					<div
						className={filterInputStyles.wrapper}
						style={{ float: 'right', marginRight: '-30px', marginTop: '-10px' }}
					>
						<Option
							Component={TextInput}
							style={{ width: '100%', marginBottom: 0 }}
							value={searchTerm}
							placeholder='Search Popups...'
							onChange={(val) => {
								_debounce(setSearchTerm(val), 50);
							}}
						/>
						<Icon name='search' />
					</div>
				</div>
				<div className={'col2'} style={{ paddingRight: 0 }}>
					<Button
						primary
						right
						style={{ marginTop: '-10px' }}
						icon={'plus'}
						onClick={handleCreatePopup}
					>
						Create Popup
					</Button>
				</div>
			</div>
			<ModalsList modals={modals} loading={loadingStats} stats={stats} />
		</section>
	);
};

ModalsPageBody.propTypes = {
	data: PropTypes.object.isRequired,
};
