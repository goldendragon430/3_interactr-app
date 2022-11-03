import React from 'react';
import Chart from "react-google-charts";
import find from 'lodash/find';

export default class ProjectViewsByDeviceChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes:[
                'AE','AF', 'AL','AM','AO', 'AR', 'AT', 'AU', 'AZ', 'BA', 'BE', 'BF',
                'BG','BI','BJ', 'BN', 'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ','CA',
                'CD','CF','CG','CH','CI','CL', 'CM','CN','CO', 'CR', 'CU', 'CY','CZ',
                'DE', 'DJ', 'DK', 'DO', 'DZ','EC', 'EE', 'EG','ER', 'ES','ET', 'FI',
                'FJ','FK', 'FR', 'GA', 'GB', 'GE', 'GH', 'GL', 'GM', 'GN', 'GQ', 'GR',
                'GT', 'GW', 'GY', 'HN','HR', 'HT', 'HU','ID', 'IE', 'IL', 'IN', 'IQ',
                'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG','KH', 'KP', 'KR', 'KW',
                'KZ', 'LA', 'LB', 'LK', 'LR', 'LS','LT', 'LU','LV', 'LY', 'MA', 'MD',
                'ME','MG', 'MK','ML', 'MM', 'MN', 'MR', 'MW','MX', 'MY','MZ','NA','NC',
                'NE','NG','NI', 'NL', 'NO','NP', 'NZ', 'OM', 'PA', 'PE', 'PG','PH', 'PK',
                'PL','PR', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 'RW','SA', 'SB', 'SD', 'SE',
                'SI','SK', 'SL', 'SN', 'SO', 'SR', 'SV', 'SY', 'SZ', 'TG', 'TH', 'TJ',
                'TL','TM','TN', 'TR', 'TT', 'TZ', 'UG', 'US', 'UY', 'UZ', 'VE', 'VN', 'VU',
                'XK', 'YE', 'ZA', 'ZM', 'ZW'
            ]
        }
    }

    getCodeValue(code){
        const {data}  = this.props;
        const res = find(data.location, (l)=>{
            return (l.country_code === code)
        });

        return (res) ? res.count : 0;
    }

    render(){
        const { height, width} = this.props;
        // var data = {
        //     series: this.state.codes.map(c =>{
        //         return {
        //             code: c,
        //             data: this.getCodeValue(c)
        //         }
        //     })
        // };
        let data = [
            ["Country", "Views"]
        ];
        this.state.codes.forEach(c => {
            data.push([
                c, this.getCodeValue(c)
            ])
        })

        var options = {
            colorAxis: { colors: ["#DDD", "#d84478"] },
            backgroundColor: "#FFF",
            datalessRegionColor: "#DDD",
            defaultColor: "#DDD",
        };
    
        return(
            <>
                <h3>
                    Views By Location
                </h3>
                <Chart
                    chartEvents={[
                        {
                            eventName: "select",
                            callback: ({ chartWrapper }) => {
                                const chart = chartWrapper.getChart();
                                const selection = chart.getSelection();
                                if (selection.length === 0) return;
                                const region = data[selection[0].row + 1];
                                console.log("Selected : " + region);
                            },
                        },
                    ]}
                    chartType="GeoChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </>
        );
    }
}