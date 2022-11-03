import React from 'react';
import updatesLog from './updatesLog';

/* Used flashing a global toast that only closes on click and never again , uses localStorage
* @param {String} title 
* @param {String} msgLabel - the key in the updatesLog 
* @param {String} messageComponent
* @param {type} messageComponent 
*
*
*/
 function showUpdateMessage(title, msgLabel, messageComponent, type = 'info') {
  if (typeof msgLabel != 'string' || typeof title != 'string') {
    // console.error('showUpdateMessage method needs a "msgLabel" argument and it must be a string.');
    throw Error('Global message util requires a title and a msgLabel to be strings');
  }
  if (messageComponent === undefined) {
    throw Error('messageComponent must be valid react element');
  }

  const msgInStorage = updatesLog[msgLabel];
  if (msgInStorage === undefined) {
    throw Error('msgLabel must be set in shared/updatesLog.js ');
  }
  // return if already dismissed the update
  if (localStorage.getItem(msgInStorage)) return;

  // ⚡️ Don't forget to update the message itself 👇

  const toastrOptions = {
    timeOut: 0, // by setting to 0 it will prevent the auto close
    // icon: (<myCustomIconOrAvatar />), // You can add any component you want but note that the width and height are 70px ;)
    position: 'top-center',
    // onShowComplete: () => console.log('SHOW: animation is done'),
    onHideComplete: () => localStorage.setItem(msgInStorage, true),
    // onCloseButtonClick: () => console.log('Close button was clicked'),
    // onToastrClick: () => console.log('Toastr was clicked'),
    showCloseButton: false, // false by default
    closeOnToastrClick: true, // false by default, this will close the toastr when user clicks on it
    removeOnHover: false,
    className: 'update-message-toast',
    component: messageComponent,
    status: type,
    icon: type,
  };

  toastr.light(title, toastrOptions);
}

export default showUpdateMessage