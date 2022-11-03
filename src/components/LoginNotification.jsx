import React from 'react';

export default class LoginNotifications extends React.Component {
  componentWillMount(){
    const previousPage = window.localStorage.getItem('previousPage');
    const key = '_interactr-' + this.props.name;

    if (previousPage === 'login') {
      // Check local storage and see if they've chosen  not to see welcome again
      const dismissed = window.localStorage.getItem(key);
      if (! dismissed){
        this.props.show();
      }
      window.localStorage.setItem('previousPage', '');
    }
  }

  render(){
    return this.props.children;
  }
}