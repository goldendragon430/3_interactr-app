import React, {useEffect} from 'react';
import {useSetState} from "../../../../utils/hooks";
import reduce from "lodash/reduce";
import moment from "moment";
import analytics from "../../../../utils/analytics";
import {percentage} from "../../../../utils/numberUtils";
import ProjectViewsMap from "../../../project/components/Charts/ProjectViewsMap";

const ProjectViewsByLocationChart = ({data}) => {
  return  <ProjectViewsMap width={500} height={380} data={data}/>
}
export default ProjectViewsByLocationChart;
