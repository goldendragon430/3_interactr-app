import React from 'react';
import styles from './Card.module.scss';

export default class SimpleCard extends React.Component{
    render(){
        const {children, content, style} = this.props;

        return(
            <div className={styles.Card} style={{borderRadius: '15px', ...style}}>
                {children}
                {(content) ?
                    <div className={styles.body}>
                        {content}
                    </div>
                    : null
                }
            </div>
        )
    }
}
