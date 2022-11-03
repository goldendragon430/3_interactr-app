import React from 'react';
import ChartLoader from "./Charts/ChartLoader";

const DashboardLoader = () => {
  return (
    <>
      <div className="grid" style={{marginTop: '30px'}}>
        <div className="col3" >
          <ChartLoader height={100} width={290}/>
        </div>
        <div className="col3" >
          <ChartLoader height={100} width={290}/>
        </div>
        <div className="col3" >
          <ChartLoader height={100} width={290}/>
        </div>
        <div className="col3" >
          <ChartLoader height={100} width={290}/>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <ChartLoader height={326} width={1250} />
      </div>

      <div className="grid" style={{marginTop: '30px'}}>
        <div className="col7" >
          <div style={{marginBottom: '30px'}}>
            <ChartLoader height={100} width={740}/>
          </div>
          <div style={{marginBottom: '30px'}}>
            <ChartLoader height={100} width={740}/>
          </div>
          <div style={{marginBottom: '30px'}}>
            <ChartLoader height={100} width={740}/>
          </div>
          <div style={{marginBottom: '30px'}}>
            <ChartLoader height={100} width={740}/>
          </div>
        </div>
        <div className="col5" >
          <div style={{marginBottom: '30px', marginLeft: '30px'}}>
            <ChartLoader height={100} width={470}/>
          </div>
          <div style={{marginBottom: '30px',  marginLeft: '30px'}}>
            <ChartLoader height={370} width={470}/>
          </div>
        </div>
      </div>
    </>
  )
}
export default DashboardLoader;