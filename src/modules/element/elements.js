import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import mapKeys from 'lodash/mapKeys';

export const HOTSPOT_ELEMENT = 'App\\HotspotElement';
export const BUTTON_ELEMENT = 'App\\ButtonElement';
export const TEXT_ELEMENT = 'App\\TextElement';
export const CUSTOM_HTML_ELEMENT = 'App\\CustomHtmlElement';
export const IMAGE_ELEMENT = 'App\\ImageElement';
export const TRIGGER_ELEMENT = 'App\\TriggerElement';
export const FORM_ELEMENT = 'App\\FormElement';
export const COUNTDOWN_ELEMENT = 'App\\CountdownElement';


export const clickableElementTypes = [BUTTON_ELEMENT, IMAGE_ELEMENT, HOTSPOT_ELEMENT];

// types of elements used in the app
export const elements = {
  [HOTSPOT_ELEMENT]: {
    // name shown to user
    name: 'Hotspot',
    icon: 'hotspot.png',
    description: 'Make an area of the video clickable whilst adding no visual styles',
    properties:['positionable','clickable']
  },

  [BUTTON_ELEMENT]: {
    name: 'Button',
    icon: 'button.png',
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    description: 'Add a clickable button to the video',
    properties:['positionable','clickable',  'styleable', 'animatable']
  },

  [TEXT_ELEMENT]: {
    name: 'Text',
    icon: 'text.png',
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    description: 'Add plain text to the video',
    properties:['positionable','styleable', 'animatable']
  },


  [FORM_ELEMENT]: {
    name: 'Email',
    icon: 'email.png',
    description: 'Capture users emails with a form element',
    buttonHeight: 40,
    buttonPadding: 15,
    inputStyles: {
      height: 40,
      flex: 1
    },
    elementSpacing: 10,
    properties:['positionable','formable','clickable', 'styleable']
  },

  [CUSTOM_HTML_ELEMENT]: {
    name: 'Custom HTML',
    icon: 'html.png',
    styles: {
      overflow: 'hidden'
    },
    description: 'Add html markup to the video .',
    properties: ['positionable', 'customhtmlable']
  },

  [IMAGE_ELEMENT]: {
    name: 'Image',
    icon: 'image.png',
    description: 'Add an image to the video',
    properties: ['positionable', 'imageable', 'clickable', 'animatable']
  },

  // [COUNTDOWN_ELEMENT]: {
  //   name: 'Image',
  //   icon: 'image',
  //   description: 'Image elements allow you to add an image to the video.'
  // },

  [TRIGGER_ELEMENT]: {
    name: 'Event Action',
    icon: 'popup-trigger.png',
    description: 'Add an action to a time on your video. Most commonly used for opening a popup or firing a facebook pixel',
    properties: ['positionable','clickable']
  },
};

export function getElementMeta(element_type) {
  const meta = elements[element_type];
  if (!meta) throw new Error('invalid element_type ' + element_type);
  return meta;
}

/**
 * Receives an element as an object and returns the properties that need to
 * be used to style the element.
 * @param element_type
 * @param element
 * @returns {{alignItems: string, textAlign: string, display: string, justifyContent: string}|{alignItems: string, textAlign: string, display: string, justifyContent: string}|{alignItems: string, display: string, justifyContent: string}|{alignItems: string, display: string, justifyContent: string}|{alignItems: string, display: string, justifyContent: string}|{overflow: string}|*}
 */
export function getStyles(element_type,  element) {
  const meta = getElementMeta(element_type);
  let styles = meta.styles || {};


  styles.width = element.width + 'px';
  styles.height = element.height + 'px';

  // This is handled by the draggable parent
  // styles.top = element.posY;
  // styles.left =  element.posX;

  if(element.background) styles.background = element.background

  styles.borderRadius = element.borderRadius + 'px';
  //styles.zIndex = element.zIndex + 10; // This is set in a different way
  styles.letterSpacing =  element.letterSpacing + 'px'

  if(element.borderWidth > 0) {
    styles.borderWidth = element.borderWidth + 'px';
    styles.borderColor = element.borderColor;
    styles.borderStyle = (element.borderType) ? element.borderType  : 'solid';
  }else {
    // Need to reset to 0
    styles.borderWidth = 0;
  }

  return  styles;
}

export function someElements(...element_types) {
  return pickBy(elements, (element, element_type) => element_types.includes(element_type));
}

// used for pulling out subprops i.e. for prefix 'button':
// {button_html, button_blah, something} => {html, blah}
export function getPrefixedProps(props, prefix) {
  return reduce(
    props,
    (subProps, val, key) => {
      if (key.startsWith(prefix)) {
        subProps[key.substr(prefix.length)] = val;
      }
      return subProps;
    },
    {}
  );
}

export function prefixProps(props, prefix) {
  return mapKeys(props, (val, key) => prefix + key);
}

/** Formats the element type name to readable one  */
export function formatElementTypeName(typeName) {
  typeName = typeof typeName == 'string' ? typeName.replace(/(app\\)|(element)/gi, '') : 'Element';

  // Handle Edge cases 
  if (typeName === 'Trigger') typeName = 'Modal';
  if (typeName === 'CustomHtml') typeName = 'Custom Html';

  return typeName;
}
