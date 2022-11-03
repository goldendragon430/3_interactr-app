import moment from 'moment';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import analytics from 'utils/analytics';

export const MODAL_EDITOR_DOM_ID = 'modal-editor';

export const fetchStats = async (modals) => {
	const startDate = moment().subtract(365, 'day');
	const endDate = moment();

	try {
		// 👇 must be an array of queries
		const queries = _reduce(
			modals,
			(result, modal) => {
				let views = {
					name: 'modal_views_' + modal.id,
					collection: 'ModalView',
					api: 'Interactr',
					filters: {
						modal_id: modal.id,
					},
					start_date: startDate,
					end_date: endDate,
				};

				if (!modal.elements.length) return result.concat(views);

				const interactions = {
					name: 'modal_interactions_' + modal.id,
					collection: 'ElementClick',
					api: 'Interactr',
					filters: {
						modal_element_id: _map(
							modal.elements,
							(modalElement) => modalElement.id
						),
					},
					start_date: startDate,
					end_date: endDate,
				};

				return result.concat(views, interactions);
			},
			[]
		);

		const req = await analytics.queries(queries);
		return req.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
