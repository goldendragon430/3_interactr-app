import React from 'react';
import {getInteractionsGroup, getCollectionName} from 'shared/keen';
import styles from './ProjectStats.module.scss';
import chartStyles from 'modules/stat/components/chartStyles.module.scss';
import Icon from 'components/Icon';

export default class ProjectStatsInteractionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {items:[], base: 0, colors:['#00a2e1', '#00b382', '#f81b84', '#f7882f']};
  }

  componentDidMount() {
    const collectionName = getCollectionName(this.props.project.id);
    getInteractionsGroup(collectionName, (err, results) => {
      if (results && results.result) {
        this.setState({items: results.result, base: this.getTheHighestValue(results.result)});
      }
    });
  }

  renderInteractionItem = (item, key) => {
    const name = item.interaction_name && item.interaction_name.length > 0 ? item.interaction_name : 'Unknown name';
    const style = {
      width: this.workOutWidthFromBase(item.result) + '%',
      backgroundColor: this.getRandomColour(key),
      padding: '5px 10px'
    };

    return (
      <div className={styles.interactionTableRow} key={key}>
        <div className={styles.interactionTableInteraction}>
          <p>{name}</p>
        </div>
        <div className={styles.interactionTableBarHolder}>
          <div style={style}>{item.result} Clicks</div>
        </div>
      </div>
    );
  };

  getRandomColour = (key) => {
    if (key < 4) {
      return this.state.colors[key];
    }

    const sum1 = key / 4;
    const sum2 = 4 * Math.floor(sum1);
    const sum3 = key - sum2;

    return this.state.colors[sum3];
  };

  /**
   * Work out the width of the bar with the heightest result as the base
   */
  workOutWidthFromBase = (result) => {
    if (this.state.base === 0) {
      return 0;
    }

    return ( 100 / this.state.base ) * result;
  };

  getTheHighestValue(items){
    let heighist = 0;

    items.forEach( (item)=>{
      if (item.result > heighist) {
        heighist = item.result;
      }
    } );

    return heighist;
  }

  render() {
    const {project, user, upgradeMessage} = this.props;
    if (project === undefined) {
      return null;
    }

    const {items} = this.state;

    const headerStyles = {backgroundColor: '#00b382'};

    return (
      <div className="col12">
          <div className="col12">
            <div className={styles.headline} id="interactionsBreakdown">
              <h2 ><Icon name="mouse-pointer" />Interactions Breakdown</h2>
              <p>
                Use this table to see which elements are getting the most interaction from your viewers. The table below is a list of all
                of the elements in this project with each elements total clicks.
              </p>
            </div>

            {
              (user.advanced_analytics) ?
                <div className={styles.chartWrapper}>
                  <div className={chartStyles.headerRow} style={headerStyles}>
                    <h3><Icon name="th-list" />Element Clicks</h3>
                  </div>
                  <div className={styles.interactionTableInteractions}>
                    {! items.length && <p style={{textAlign: 'center'}}>No data to display</p>}
                    {items && items.map((item, key) => this.renderInteractionItem(item, key))}
                  </div>
                </div> :
                <div className={styles.chartWrapper}>
                  { upgradeMessage() }
                </div>
            }
          </div>
      </div>
    );
  }
}
