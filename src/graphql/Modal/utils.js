import client from '../client';
import gql from 'graphql-tag';
import { MODAL_ELEMENT_FRAGMENT, MODAL_FRAGMENT } from './fragments';
import _map from 'lodash/map';
import { cache } from '../client';
import mapValues from 'lodash/mapValues';

export const getModalForSaving = (id, newData) => {
	// Allows us to push a new object to the cache BEFORE we do the save
	// if (newData) {
	// 	const { __typename: type, id, ...restOfNewData } = newData;

	// 	const cacheKey = cache.identify({ id: id, __typename: type });
	// 	cache.modify({
	// 		id: cacheKey,
	// 		fields: mapValues(restOfNewData, (k) => {
	// 			return () => {
	// 				return k;
	// 			};
	// 		}),
	// 	});
	// }
  
	// IMPORT all relations need to be striped out here as for them to update
	// it would need a nested mutation
	const { modal } = client.readQuery({
		query: gql`
			query modal($id: ID!) {
				modal(id: $id) {
					...ModalFragment
				}
			}
			${MODAL_FRAGMENT}
		`,
		variables: { id },
	});

	// Break off any props that can't be saved directly
	// let { __typename, elements, created_at, ...restOfModal } = modal;
	let {
		__typename,
		elements,
		created_at,
		project,
		project_id,
		...restOfModal
	} = modal;

	// Create the elements inside an "update" prop this is
	// how nested mutations work
	restOfModal.elements = {
		update: _map(elements, (modalElement) => {
			// Break off any props we cant save directly
			const {
				__typename,
				element: { __typename: elTypename, created_at, ...restOfElement },
				...restOfModalElement
			} = modalElement;

			return {
				...restOfModalElement,
				[elTypename]: {
					update: restOfElement,
				},
			};
		}),
	};

	return restOfModal;
};

export const getModalElementForSaving = (id) => {
	const { modalElement } = client.readQuery({
		query: gql`
			query modalElement($id: ID!) {
				modalElement(id: $id) {
					...ModalElementFragment
				}
			}
			${MODAL_ELEMENT_FRAGMENT}
		`,
		variables: { id },
	});

	const {
		__typename,
		element: { __typename: elementTypename, created_at, ...restOfElement },
		...restOfModalElement
	} = modalElement;

	restOfModalElement[elementTypename] = {
		update: restOfElement,
	};

	return restOfModalElement;
};
