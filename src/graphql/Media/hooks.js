import { useParams } from 'react-router-dom';
import {
	addItem,
	createMutationHook,
	createQueryHook,
	createSubscriptionHook,
	deleteItem,
} from '../utils';
import { GET_MEDIA, GET_MEDIAS } from './queries';
import {
	CREATE_MEDIA,
	CREATE_MEDIA_BY_UPLOAD,
	CREATE_MEDIA_BY_URL,
	DELETE_MEDIA,
	UPDATE_MEDIA,
} from './mutations';
import { useMutation } from '@apollo/client';

export const useMediaCommands = () => {
	const [createMedia] = useMutation(CREATE_MEDIA, {
		refetchQueries: [{ query: GET_MEDIAS }],
	});

	const [saveMedia] = useMutation(UPDATE_MEDIA);

	return {
		createMedia,
		saveMedia,
	};
};

export const useMedias = ({
	id = 0,
	page = 1,
	first = 10,
	q = '',
	hidden = 0,
	orderBy = 'created_at',
	sortOrder = 'DESC',
	filterBy = 'all',
	forceProjectId = false,
}) => {
	// If no id is passed we default to "active project" using the
	// projectId in the route
	const { projectId } = useParams();

	if (!id && projectId && !forceProjectId) {
		id = parseInt(projectId);
	}

	const variables = { page, first, search: q, orderBy, sortOrder };

	if (parseInt(id)) {
		variables.project_id = parseInt(id);
	}

	if (filterBy !== 'all') {
		variables.is_image = parseInt(filterBy);
	}

	return createQueryHook({
		typename: 'Media',
		query: GET_MEDIAS,
		variables,
	});
};

export const useMedia = (id) =>
	createQueryHook({
		typename: 'Media',
		query: GET_MEDIA,
		variables: { id: parseInt(id) },
	});

/**
 * Create a single media item by uploading file
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCreateMediaByUpload = (options = {}) =>
	createMutationHook({
		mutation: CREATE_MEDIA_BY_UPLOAD,
		options,
	});

/**
 * Create a single media item by url
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCreateMediaByUrl = (options = {}) =>
	createMutationHook({
		mutation: CREATE_MEDIA_BY_URL,
		options,
	});

/**
 * Update a single media item
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveMedia = (options = {}) =>
	createMutationHook({
		mutation: UPDATE_MEDIA,
		options,
	});

/**
 * Delete a single media item
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useDeleteMedia = (options = {}) =>
	createMutationHook({
		mutation: DELETE_MEDIA,
		options: {
			update(cache, { data: { deleteMedia } }) {
				deleteItem(cache, deleteMedia.id, deleteMedia.__typename);
			},
			...options,
		},
	});
