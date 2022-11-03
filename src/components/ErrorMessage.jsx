import React from 'react';
import styles from "./ErrorMessage.module.scss"
import Icon from 'components/Icon';
import cx from 'classnames';


const ErrorMessage = ({ children, error, ...props }) => {
  let text;

  if(error) {
    // IF not in production we display the error, if production we just show a generic message
    text = (import.meta.env.NODE_ENV !== 'production') ?  error.message : "There has been an error loading the data, please contact support." ;
  }else {
    text = children;
  }

  if(text==="Internal server error") {
    // Bit of a hacky way to get the graph QL error
    text = (error.graphQLErrors[0]) ? error.graphQLErrors[0].debugMessage : text;
  }

  return (
    <div className={cx(styles.errorBox, "clearfix")} {...props}>
      <div className={styles.errorText}>
        <h3><Icon name="exclamation-triangle" color="#fff" /> Error</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
