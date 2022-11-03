/** Prefixes assets with bucket url in prodcution to correctly resolve the assets from the bucket in the 
 * node environment
 */

export default function getAsset(path){
  if(typeof path !== 'string') throw `${path} isn't a string , please input valid path`;
  return path;
  //return process.env.ENV === 'production' ? process.env.FE_PATH + '/' + config.FE_VERSION + path : path;
}