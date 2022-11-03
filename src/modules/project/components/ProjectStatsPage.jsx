import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'tui-chart/dist/tui-chart.css';
import TuiChart from 'tui-chart';
import ProjectViewsPage from "./Analytics/ProjectViewsPage";
import ProjectImpressionsPage from "./Analytics/ProjectImpressionsPage";
import ProjectEngagementPage from "./Analytics/ProjectEngagementPage";
import {Routes, Route, NavLink, useParams} from 'react-router-dom';
import ProjectStatsSubNav from "./Analytics/ProjectStatsSubnav";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const ProjectStatsPage = () => {
  const [startDate, setStartDate] = useState( moment().subtract(30, 'day')  )
  const [endDate, setEndDate] = useState(moment())
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(()=>{
    var theme = {
      series: {
        colors: [
          '#366fe0', '#41c186', '#ff6961', '#0eb6ac', '#556aff',
          '#7b8bff', '#71a0ee', '#f7882f', '#fcd534', '#6e3667'
        ]
      }
    };

    TuiChart.registerTheme('myTheme', theme);
  }, [])

  const updateDates = (value) => {
    if(value == null)
      return;

    if(startDate!==value[0]){
      setStartDate(value[0]);
    }
    if(endDate!==value[1]){
      setEndDate(value[1]);
    }
  };

  return (
    <div className={'grid'}>
      <div className={'col12'} style={{marginBottom: '15px'}}>
        <ProjectStatsSubNav />
        <div style={{position: 'absolute', left: '1000px', top: '25px'}}>
          <DateRangePicker 
            onChange={updateDates} 
            value={[startDate, endDate]} 
            clearIcon={null}
          />
        </div>
      </div>
      <div className={'col12'}>
        <div style={{marginLeft: '20px'}}>
          <Routes>
            <Route path='/views' element={<ProjectViewsPage startDate={startDate} endDate={endDate} />} />
            <Route path='/engagement' element={<ProjectEngagementPage startDate={startDate} endDate={endDate} />} />
            <Route index element={<ProjectImpressionsPage startDate={startDate} endDate={endDate} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
};
export default ProjectStatsPage;