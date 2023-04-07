import {motion} from "framer-motion";
import DashboardCard from "./DashboardCard";
import React, {useEffect, useState} from "react";
import {useSetState} from "../../../utils/hooks";
import reduce from 'lodash/reduce';
import moment from "moment";
import analytics from "../../../utils/analytics";
import {percentage} from "../../../utils/numberUtils";

const DashboardCards = ({
                          all_project_impressions_current, all_project_impressions_previous,
                          all_project_plays_current, all_project_plays_previous,
                          all_project_interactions_current, all_project_interactions_previous,
                          all_project_playrate_current, all_project_playrate_previous
                        }) => {
  return(
    <div className="grid" >
      <div className="col3" >
        <DashboardCard
          heading="Total Impressions"
          description="An impression is counted each time a project is loaded on page"
          currentValue={all_project_impressions_current}
          previousValue={all_project_impressions_previous}
          iconPath="/img/img-impressions.png"
        />
      </div>
    <div className="col3" >
      <DashboardCard
        heading="Total Plays"
        description="A play is counted when the viewer clicks play or unmutes the project"
        currentValue={all_project_plays_current}
        previousValue={all_project_plays_previous}
        iconPath="/img/img-total-plays.png"
      />
    </div>
    <div className="col3" >
      <DashboardCard
        heading="Play Rate"
        description="This is the % of viewers that play the project"
        currentValue={all_project_playrate_current}
        previousValue={all_project_playrate_previous}
        suffix="%"
        iconPath="/img/img-play-rate.png"
      />
    </div>
    <div className="col3" >
      <DashboardCard
        heading="Total Interactions"
        description="Counted each time a viewer clicks on a clickable element in your project"
        currentValue={ all_project_interactions_current }
        previousValue={ all_project_interactions_previous }
        style={{'borderRightColor': 'transparent'}}
        iconPath="/img/img-total-interactions.png"
      />
    </div>
  </div>
  )
}
export default DashboardCards;