import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload)
};

Object.freeze(Emitter);

export default Emitter;

// Export all events as consts here so it's easier to view and maintain
export const VIDEO_SCRUB = 'VIDEO_SCRUB';
export const TOGGLE_ELEMENT_GROUP_MODAL = 'TOGGLE_ELEMENT_GROUP_MODAL';
export const TOGGLE_INSERT_DYNAMIC_TEXT_MODAL = 'TOGGLE_INSERT_DYNAMIC_TEXT_MODAL';
export const TOGGLE_MANAGE_DYNAMIC_TEXT_MODAL = 'TOGGLE_MANAGE_DYNAMIC_TEXT_MODAL';
export const INSERT_DYNAMIC_TEXT = 'INSERT_DYNAMIC_TEXT';
export const SAVE_NODE_PAGE = 'SAVE_NODE_PAGE';
export const NODE_PAGE_SAVE_COMPLETE = 'NODE_PAGE_SAVE_COMPLETE';
export const NODE_PAGE_SAVE_START = 'NODE_PAGE_SAVE_START';
export const SHOW_SELECT_MODAL_TEMPLATE_MODAL = 'SHOW_SELECT_MODAL_TEMPLATE_MODAL'
export const SAVE_MODAL_PAGE = 'SAVE_MODAL_PAGE';
export const MODAL_PAGE_SAVE_COMPLETE = 'MODAL_PAGE_SAVE_COMPLETE';
export const MODAL_PAGE_SAVE_START = 'MODAL_PAGE_SAVE_START';

export const REFETCH_GROUPS = 'REFETCH_GROUPS';
export const MIGRATION_DONE = 'MIGRATION_DONE';