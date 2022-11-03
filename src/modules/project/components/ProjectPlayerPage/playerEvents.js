// @ts-check

export default class PlayerEvents {
  // origins of the player's iframe
  // Backend preview endpoint (most important really since this is supposed to be used only on interactr's Dasboard which only uses player preview endpoint)
  // can also be local player while devin as well as origin of published projects (both s3 and bunny)
  static playerOrigins = [
    import.meta.env.VITE_API_URL,
    //'http://localhost:8000',
    'https://interactr2api.interactr.io',
  ];

  static events = Object.freeze({
    SET_EDITING_MODE: 'player:SET_EDITING_MODE',
    SET_EDITING_STATUS: 'player:SET_EDITING_STATUS',
    UPDATE_SETTINGS: 'player:UPDATE_SETTINGS',
  });
  static editingStatuses = Object.freeze({
    INITIAL: 'initial',
    PLAYING: 'playing',
    CHAPTERS: 'chapters' ,
    SHARING: 'sharing'
  });
  #ICTR_EDITING_PAGE = 'ICTR_EDITING_PAGE';

  /**
   *  @param {HTMLIFrameElement} frame the player ifarme
   *  @param {string} origin origin of the frame
   */
  constructor(frame, origin) {
    this.frame = frame;
    this.origin = origin;
  }

  /**
   * @param {keyof PlayerEvents.events} name event name
   * @param {any} data the player event data  */
  emit(name, data) {
    const messageEvent = JSON.stringify({ name, data, from: this.#ICTR_EDITING_PAGE });
    this.frame.contentWindow.postMessage(messageEvent, "*");

    // console.log('fired from player evens ------> \n', messageEvent )
  }
}
/**
 * @typedef {object} PlayerSettingsEvent
 * @property {string} name
 * @property {string} from
 * @property {any} payload
 */
