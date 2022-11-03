import React from 'react';
import IconButton from 'components/Buttons/IconButton';
import styles from './CopyToClipboard.module.scss';
import Icon from 'components/Icon';

export default class CopyToClipboard extends React.Component {
  state = {
    copied: false,
    height: 1
  };

  handleCopy = () => {
    const { onCopy } = this.props;

    this.select();
    try {
      const success = document.execCommand('copy');
      if (!success) throw new Error('could not copy');
      this.markCopied();
    } catch (e) {
      if (__DEV__) {
        console.error('could not copy text', e);
      }
      // TODO: how should we alert the user that we could not copy?
    }

    onCopy && onCopy();
  };

  // When we mark it as copied, we want to revert the button
  // after a timeout
  markCopied() {
    this.setState({ copied: true });
    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  }

  select = () => {
    this.input.select();
  };

  componentDidMount() {
    this.select();
    this.setState({ height: 10 + this.input.scrollHeight });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { value, rows = 7 } = this.props;
    const { copied, height } = this.state;

    return (
      <div className="form-control">
        <div className={styles.wrapper}>
          <textarea onClick={this.select} readOnly value={value} ref={ref => (this.input = ref)} rows={rows} />
          <Icon
            onClick={this.handleCopy}
            name={copied ? 'check' : 'clipboard'}
            className={styles.icon}
          />
        </div>
      </div>
    );
  }
}
