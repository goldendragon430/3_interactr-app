import React from 'react';

/**
 * Wrapper to go around any help text that will link to the interactr docs page. All this
 * component does is check that the app isn't a whitelabel instance so we don't show the
 * interactr docs to whitelabel users.
 */

export default class DocsLink extends React.Component {
    constructor(){
        super();
    }

    render(){
        if(this.props.whitelabel){
            return <span>For help contact your administrator</span>;
        }

        const {children} = this.props;

        return  children
    }
}
