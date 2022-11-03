export * from './MediaLibraryFilters';
export * from './MediaLibraryLoading';
export * from './MediaLibraryMediaList';
export * from './MediaLibraryPage';
export * from './NoMedia';

export const tabAnimation = {
	animate: { y: 0, opacity: 1 },
	initial: { y: 50, opacity: 0 },
	transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
};

export const ALL_ACTIVE_TAB = 'all';
export const VIDEOS_ACTIVE_TAB = '0';
export const IMAGES_ACTIVE_TAB = '1';
export const TOGGLE_ON = true;
