import React from 'react';
import { viewStatsListPage } from 'modules/stat/stat';
import { statsListPageSelector } from 'modules/stat/statSelectors';
import styles from './stats.module.scss';
import StatItem from './statItem';
import Button from 'components/Buttons/Button';
import PageBody from 'components/PageBody';
import RelativeDate from '../../../components/date/RelativeDate';
import {projectStatsPath} from "../../project/routes";

export default class StatsListPage extends React.Component {
  componentDidMount() {
    this.props.viewStatsListPage();
  }

  renderProjectsList = () => {
    const { projects, history } = this.props;
    if (projects.length === 0) {
      return <div>You have not yet added any projects.</div>;
    }

    return projects.map(proj => {
      return (
        <div
          className={styles.statList}
          key={proj.id}
          onClick={() => navigate(projectStatsPath({ projectId: proj.id }))}
        >
          <div className={styles.imageHolder}>
            {proj.image_url && <img src={proj.image_url} className={styles.image} />}
            {!proj.image_url && <p className={styles.noThumb}>No Thumbnail For Project</p>}
          </div>
          <div className={styles.titleHolder}>
            <div>
              <div className={styles.projectTitle}>
                <span>{proj.title}</span>
              </div>
              <div>
                <RelativeDate date={proj.created_at} />
              </div>
            </div>
          </div>
          <div className={styles.statHolder}>
            <div className={styles.viewStatWrapper}>
              <div className={styles.statCount}>
                <StatItem projectId={proj.id} />
              </div>
              <div className={styles.statTitle}>VIEWS</div>
            </div>

            <div className={styles.uniqueViewStatWrapper}>
              <div className={styles.statCount}>
                <StatItem projectId={proj.id} type="unique" />
              </div>
              <div className={styles.statTitle}>UNIQUE VIEWS</div>
            </div>

            <div className={styles.conversionStatWrapper}>
              <div className={styles.statCount}>
                <StatItem projectId={proj.id} type="conversions" />
              </div>
              <div className={styles.statTitle}>CONVERSIONS</div>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button onClick={() => navigate(projectStatsPath({ projectId: proj.id }))} primary>
              Go to Analytics
            </Button>
          </div>
        </div>
      );
    });
  };

  render() {
    setTimeout(() => {
      this.props.updatePageLoadingState(false);
    }, 1000);

    return (
      <PageBody heading="Your Project Stats!">
        <div className={styles.analyticsList}>
          <div>{this.renderProjectsList()}</div>
        </div>
      </PageBody>
    );
  }
}
