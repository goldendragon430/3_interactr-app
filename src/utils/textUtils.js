/** Hacky way to detect youtube video urls */
export function isYoutubeLink(url){
  return !!~url.search(/(youtu\.be\/)|(youtube\.com\/watch\?)/)
}


/**
 * Uppercase first letter of string
 * @param str
 * @returns {string}
 */
export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);


export function randomString  (length=10)  {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};