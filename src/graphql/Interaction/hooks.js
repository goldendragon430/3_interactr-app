import { GET_INTERACTION, GET_INTERACTIONS } from './queries';
import { addItem, createMutationHook, createQueryHook } from '../utils';
import {
	COPY_INTERACTION,
	CREATE_INTERACTION,
	DELETE_INTERACTION,
	UPDATE_INTERACTION,
} from './mutations';
import { useInteractionRoute } from 'modules/interaction/routeHooks';
import { gql, useMutation } from '@apollo/client';
import { ELEMENT_GROUP_FRAGMENT } from '../ElementGroup/fragments';
import { INTERACTION_FRAGMENT } from './fragments';
import { cache } from '../client';
import mapValues from 'lodash/mapValues';

/**
 * Custom hook for working with a single interaction
 * @param id
 */
export const useInteractionCommands = (id = null) => {
	/**
	 * Delete Interaction
	 */
	const [deleteInteraction] = useMutation(DELETE_INTERACTION, {
		update: (cache, { data }) => {
			// Remove the interaction from the cache
			const { id } = data.deleteInteraction;
			const key = cache.identify({
				id,
				__typename: 'Interaction',
			});
			cache.evict({ id: key });
		},
	});

	/**
	 * Update Interaction in the
	 * cache
	 * @param key
	 * @param value
	 * @param _id
	 * @returns {*}
	 */
	const updateInteraction = (key, value, _id) => {
		const interactionId = _id || id;
		if (!interactionId) {
			console.error('no ID passed to updateInteraction function');
			return;
		}

		// Allows for the func to receive the args
		// as func(key, value) OR
		// func({key:value, key:value})
		// so multiple can be updated at once
		const fields =
			typeof key === 'object'
				? mapValues(key, (k) => {
						return () => {
							return k;
						};
				  })
				: {
						[key]: () => {
							return value;
						},
				  };

		const cacheKey = cache.identify({
			id: interactionId,
			__typename: 'Interaction',
		});
		cache.modify({
			id: cacheKey,
			fields,
		});
	};

	/**
	 * Create a new interaction
	 */
	const [createInteraction] = useMutation(CREATE_INTERACTION, {
		update: (cache, { data }) => {
			// Push the new interaction to the interactions on the node
			const nodeKey = cache.identify({
				id: data.result.node_id,
				__typename: 'Node',
			});
			cache.modify({
				id: nodeKey,
				fields: {
					interactions(currentInteractions) {
						return [
							...currentInteractions,
							{
								__ref: 'Interaction:' + data.result.id,
							},
						];
					},
				},
			});
		},
	});

	/**
	 * Save an interaction
	 */
	const [saveInteraction] = useMutation(UPDATE_INTERACTION);

	/**
	 * Copy and interaction
	 */
	const [copyInteraction] = useMutation(COPY_INTERACTION, {
		update: (cache, { data }) => {
			// Push the new interaction to the interactions on the node
			const nodeKey = cache.identify({
				id: data.result.node_id,
				__typename: 'Node',
			});
			cache.modify({
				id: nodeKey,
				fields: {
					interactions(currentInteractions) {
						return [
							...currentInteractions,
							{
								__ref: 'Interaction:' + data.result.id,
							},
						];
					},
				},
			});
		},
	});

	return {
		updateInteraction,
		deleteInteraction,
		createInteraction,
		saveInteraction,
		copyInteraction,
	};
};

export const useInteraction = (id) => {
	return createQueryHook({
		typename: 'Interaction',
		query: GET_INTERACTION,
		variables: { id },
	});
};

/**
 * Custom hook for
 * @param nodeId
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useInteractions = (nodeId) =>
	createQueryHook({
		typename: 'Interaction',
		query: GET_INTERACTIONS,
		variables: { nodeId },
	});

export const useCreateInteraction = (options = {}) => {
	return createMutationHook({
		mutation: CREATE_INTERACTION,
		options: {
			// Create actions don't auto update the cache so we need to
			// do that manually
			update(cache, { data: { result } }) {
				cache.modify({
					fields: {
						interactions(existingInteractions = []) {
							const newItem = cache.writeFragment({
								data: result,
								fragment: gql`
									${INTERACTION_FRAGMENT}
								`,
								fragmentName: 'InteractionFragment',
							});
							return [...existingInteractions, newItem];
						},
					},
				});
			},
			...options,
		},
	});
};

export const useSaveInteraction = (id, options) =>
	createMutationHook({
		mutation: UPDATE_INTERACTION,
		options,
	});
