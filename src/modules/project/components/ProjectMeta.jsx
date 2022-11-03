import React from "react";
import formatDistance from "date-fns/formatDistance";
import ReactTooltip from "react-tooltip";
import Icon from "../../../components/Icon";
import {numberWithCommas, percentage} from "../../../utils/numberUtils";
import {DifferenceSpan} from "../../agency/components/ClientSummaryStat";

// TODO might be changed to get analytic data directly in this component
/**
 * Render single project views information from analytics API
 * @param project
 * @param gotMetaData
 * @param metaData
 * @returns {*}
 * @constructor
 */
const ProjectMeta = ({ project, currentImpressions, previousImpressions, currentPlays, previousPlays }) => {

  const currentPercentage = percentage( currentPlays, currentImpressions );
  const lastPercentage = percentage( previousPlays, previousImpressions );

  return (
        <ul>
            <ReactTooltip id='project-page' />
            {/* Todo: Handle these use a util for the time and fix stat item */}
            {/*<li>{label}</li>*/}
            <li title="Impressions" data-tip={'Impressions'}>
              <Icon name={'eye'} /> {(currentImpressions) ? numberWithCommas(currentImpressions) : 0}
              <br/>
              <DifferenceSpan currentStat={currentImpressions}  previousStat={previousImpressions} loading={false} />
            </li>
            <li title="Plays" data-tip={'Plays'}>
              <Icon name={'play'} /> {(currentPlays) ? numberWithCommas(currentPlays) : 0}
              <br/>
              <DifferenceSpan currentStat={currentPlays}  previousStat={previousPlays} loading={false} />
            </li>
            <li title="Play Rate" data-tip={'Play Rate'}>
              {(currentPercentage!=='NaN') ? currentPercentage : 0}<Icon name={'percent'} />
              <br />
              <DifferenceSpan
                currentStat={currentPercentage}
                previousStat={lastPercentage}
                loading={false} />
            </li>
        </ul>
    );
}

export default ProjectMeta;