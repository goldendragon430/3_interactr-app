import React from 'react';
import styles from './ErrorBoundary.module.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  componentDidCatch(error, info) {
    this.setState({
      error,
      info
    });
    // logErrorToMyService(error, info);
  }

  render() {
    const { error, info } = this.state;
    const { renderer: Renderer } = this.props;

    if (error) {
      // You can render any custom fallback UI

      if (__DEV__) {
        return (
          <div className={styles.wrapper}>
            <h1>Error !</h1>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Details</summary>
              {error.toString()}
              <br />
              {info.componentStack}
            </details>
          </div>
        );
      }

      // @todo: Handle this better, have a better looking UI   
      
      return (
        <div className={styles.wrapper}>
          <h1>Something went wrong!</h1>
          <h4>W're experiencing some problems, please try again later. Or contact support of this persists</h4>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
