import {detect} from 'detect-browser';

export function importScript(scriptUrl) {
    // const scriptId = btoa(scriptUrl) // no unicode here
    // if(document.getElementById(scriptId)) return
    const script = document.createElement("script");
    // script.id = scriptId
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);
}

export function parents(node, limit) {
  let currentNode = node.parentNode;
  let parents = [];
  while (currentNode && currentNode !== document) {
    let ancestorCount = 0;
    parents.push(currentNode);
    currentNode = currentNode.parentNode;
    if(limit > 0 && ancestorCount == limit) break
    ancestorCount+=1
  }
  return parents;
}

/** @param {HTMLElement | SVGElement} node
/** @param  {number} limit number of ancestor to stop at
 *  @returns {[HTMLElement | SVGElement]} */
export function nodeAndParents(node, limit=0) {
  return [node, ...parents(node, limit)];
}

export function appendPlaceholderColorToDom(color, className){
  // Sources
  // http://usefulangle.com/post/39/adding-css-to-stylesheet-with-javascript
  // https://www.npmjs.com/package/detect-browser

  const browser = detect();

  let styleNode = document.getElementById('_'+className);

  if (! styleNode) {
    styleNode = document.createElement('style');
    styleNode.setAttribute('id', '_'+className);
    document.head.appendChild(styleNode);
  }

  let rule = false;

  const browserRules = {
    webkit : '.'+className+'::-webkit-input-placeholder {color: ' + color + '}',
    firefox :  '.'+className+'::-moz-placeholder {color: ' + color + '}',
    ie : '.'+className+':-ms-input-placeholder {color: ' + color + '}',
  };

  switch(browser.name){
    case('chrome') :
      rule = browserRules.webkit;
      break;

    case('opera') :
      rule = browserRules.webkit;
      break;

    case('safari') :
      rule = browserRules.webkit;
      break;

    case('firefox') :
      rule = browserRules.firefox;
      break;

    case('ie') :
      rule = browserRules.ie;
      break;

    case('edge'):
      rule = browserRules.ie;
      break;
  }
  
  if (rule){
    // Delete previous rules before adding new
    if (styleNode.sheet.cssRules.length) {
      styleNode.sheet.deleteRule(0);
    }
    styleNode.sheet.insertRule(rule, 0);
  }else {
    console.warn('Browser not found for placeholder color setting');
  }
}

export function randomString(length) {
  // https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function isBrowserSupported(){
  const browser = detect()
  const unsupported = ['ie']
  console.log('browser', browser)
  if(browser) {
    const isSupported = unsupported.reduce((acc,br)=> {
      if (browser.name === br) acc = false
      return acc
    } , true);
    
    console.log('isSupported', isSupported)
    return isSupported;
  }
} 

/** Switches url to the provided protocol , 'http:' or 'https:' . defaults to current page's protocol.
 * Used to avoid mixed content problems on endpoints that support both .
 * @param {String} url
 */
export function switchToProtocol (url , protocol = window.location.protocol) {
	if(protocol !== 'https:' && protocol !== 'http:') throw Error("switchToProtocol only supports 'http:' or 'https:'")
    return url.replace(/^http(?:|s)\:/, protocol)
}


/** Injects a <style> tag into the Dom with the provided styles (Tip: use es6 template strings for css ) , if  the `id` is already present it doesn't inject it  */
export function injectStyles(id, css){
  if (document.getElementById(id)) return ;
  const tag = document.createElement('style');
  tag.setAttribute('type', 'text/css');
  tag.id = id;
  tag.innerHTML = css ;
  document.head.appendChild(tag);

}

export const browser = detect();

/** Creates new array collected with key/value options for interactr default dropdown(<Option Component={SelectInput} />)
 * First argument takes collection with type of Array.
 * Second argument takes option with type of object by which key/label id should recollect
 * Third argument takes default option as an object with required properties (key, value) for setting as a default option*/
export const recreateSelectOptions = (array, type, defaultOption) => {
    return array.reduce((collection, value, key) => {
        const item = {
            value: value[type.key],
            label: value[type.label]
        };

        return [...collection, item];
    }, [{value: defaultOption.key, label: defaultOption.value}])
};
