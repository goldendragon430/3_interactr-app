import React from 'react';
import { getViews, getUniqueViews, getUniqueInteractions, getConversions, getCollectionName } from 'shared/keen';

export default class StatItem extends React.Component {
  static defaultProps = {
    type: 'regular'
  };

  constructor(props) {
    super(props);
    this.state = { value: 0, loading: true };
  }

  componentDidMount() {
    var hasStorage = 'sessionStorage' in window && window.sessionStorage,
      storageKey = `${this.props.projectId}_${this.props.type}`,
      now,
      expiration,
      data = false;

    try {
      if (hasStorage) {
        data = sessionStorage.getItem(storageKey);
        if (data) {
          // extract saved object from JSON encoded string
          data = JSON.parse(data);

          // calculate expiration time for content,
          // to force periodic refresh after 30 minutes
          now = new Date();
          expiration = new Date(data.timestamp);
          expiration.setMinutes(expiration.getMinutes() + 30);

          // ditch the content if too old
          if (now.getTime() > expiration.getTime()) {
            data = false;
            sessionStorage.removeItem(storageKey);
          }
        }
      }
    } catch (e) {
      data = false;
    }

    if (data) {
      // load data from session storage
      this.handleResults(false, {
        result: data.content
      });
    } else {
      const collectionName = getCollectionName(this.props.projectId);
      switch (this.props.type) {
        case 'conversions':
          getConversions(collectionName, this.handleResults);
          break;
        case 'unique':
          getUniqueViews(collectionName, this.handleResults);
          break;
        case 'uniqueInteractions':
          getUniqueInteractions(collectionName, this.handleResults);
          break;
        default:
          getViews(collectionName, this.handleResults);
          break;
      }
    }
  }

  handleResults = (err, results) => {
    const { onStatUpdate, type } = this.props;
    if (results) {
      const value = results.result;
      this.setState({ value: value, loading: false });

      onStatUpdate && onStatUpdate(type, value);

      try {
        sessionStorage.setItem(
          `${this.props.projectId}_${this.props.type}`,
          JSON.stringify({
            timestamp: new Date(),
            content: value ? value : 0
          })
        );
      } catch (e) {
        // silently suppress, it doesn't really matter
      }
    }
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return '-';
    }

    return <span>{this.state.value}</span>;
  }
}
