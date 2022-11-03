import React from 'react';
import Chart from 'modules/stat/components/chart';
import styles from './ProjectStats.module.scss';
import Icon from 'components/Icon';
import ProjectStatsInteractionsTable from './ProjectStatsInteractionsTable';
import Upgrade from 'components/Upgrade';

export default class ProjectStatsCharts extends React.Component {
  jumpTo(id){
    const target = document.getElementById(id);

    window.scroll({
      top: target.offsetTop - 100,
      behavior: 'smooth'
    });
  }

  upgradeMessage = ()=>{
    return(<Upgrade />)
  };

  render() {
    const {project} = this.props;
    const user = this.props.user.user;
    if (project === undefined) {
      return null;
    }

    return (
      <div className={styles.projectCharts}>
        <div className="grid" style={{margin: 0}}>

          <div className="col12">
            <div className={styles.headline}>
              <h2><Icon name="chart-line-down" /> Retention chart</h2>
              <p>
                This chart gives you an idea of what Nodes in your project viewers are interacting with the most. Once a node (Video) has started playing if the
                user either watches the video till the end or takes an action (Clicking an element or completing a form) the node will class this as retained behaviour. If a user
                begins watching the node (video) and does not finish the video or click on an element then this will count as not retained.
              </p>
            </div>
          </div>

          <div className="col12">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="retentionChart" {...this.props} title="Retention per video clip" metric="video_" backgroundColor="#6e3667" icon="users" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col12">
            <div  className={styles.headline} id="viewsBreakdown">
              <h2><Icon name="eye" /> Project Views Breakdown</h2>
              <p>
                Get a clear picture of your projects views. You can break them down by date, location or device.
              </p>
            </div>
          </div>

          <div className="col12">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="line" id="viewsByDate" {...this.props} title="Project Views by date" metric="project_view" backgroundColor="#00a2e1" icon="calendar" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="viewsByLocation" {...this.props} title="Project Views By Location" metric="project_view" backgroundColor="#00a2e1" icon="globe" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="viewsByDevice" {...this.props} title="Project Views By device" metric="project_view" backgroundColor="#00a2e1" icon="desktop"/> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <ProjectStatsInteractionsTable project={this.props.project} user={user} upgradeMessage={this.upgradeMessage}/>


          <div className="col12">
            <div  className={styles.headline} id="conversionsBreakdown">
              <h2><Icon name="shopping-cart" />Conversions Breakdown</h2>
              <p>
                Get a clear picture of your conversions. You can break them down by date, location or device. Use the <a onClick={()=> this.jumpTo('conversionPixelBuilder')}>Conversion Pixel Builder</a> at the bottom of this page
                to create conversion pixels for your thank you page and start tracking your conversions.
              </p>
            </div>
          </div>

          <div className="col12">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                    <Chart type="line" id="conversionsByDate" {...this.props} title="Conversions by date" metric="conversion" backgroundColor="#f81b84" icon="calendar" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="conversionsByLocation" {...this.props} title="Conversions By Location" metric="conversion" backgroundColor="#f81b84" icon="globe" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="conversionsByDevice" {...this.props} title="Conversions By device" metric="conversion" backgroundColor="#f81b84" icon="desktop"/> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col12">
            <div className={styles.headline} id="revenueBreakdown">
              <h2><Icon name={ 
                //project && project.currency && (`${project.currency.toLowerCase()}-sign`) 
                'coins'
              }
               /> Revenue Breakdown</h2>
              <p>
                Get a clear picture of the revenue generate by this project. You can break this down by date, location or device.
                Use the <a onClick={()=> this.jumpTo('conversionPixelBuilder')}>Conversion Pixel Builder</a> at the bottom of this page to create conversion pixels for your thank you page and start tracking the revenue generated by this project.
              </p>
            </div>
          </div>

          <div className="col12">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                    <Chart type="line" id="revenuesByDate" {...this.props} title="Revenue by date" metric="conversion" backgroundColor="#f7882f" icon="calendar" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                  <Chart type="bar" id="revenuesByLocation" {...this.props} title="Revenue By Location" metric="conversion" backgroundColor="#f7882f" icon="globe" /> :
                  this.upgradeMessage()
              }
            </div>
          </div>

          <div className="col6">
            <div className={styles.chartWrapper}>
              {
                (user.advanced_analytics) ?
                    <Chart type="bar" id="revenuesByDevice" {...this.props} title="Revenue By device" metric="conversion" backgroundColor="#f7882f" icon="desktop"/> :
                  this.upgradeMessage()
              }
            </div>
          </div>

        </div>
      </div>
    );
  }
}
