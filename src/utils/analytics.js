
import axios from 'axios';
import TuiChart from "tui-chart";

/** Hits the Videosuite analytics service
 * @param {String} endpoint the endpoint
 * @param {String} method the http method , defaults to post method
 * @param {Object} data the request payload , ie query details or data to insert etc...
 */
function service(endpoint, method = 'post', data) {
  return axios[method](`${import.meta.env.VITE_ANALYTICS_URL}/${import.meta.env.VITE_ANALYTICS_PROJECT_KEY}/${endpoint}`, data);
}

/** Hits analytics service with queries object like so 
 * example 
 * ```
  [
    {
        "name": "Custom name #1",
        "collection": "ProjectView",
        "api": "Interactr",
        "filters": {
            "project_id": 2
        },
        "start_date": "30-10-2019",
        "end_date": "30-11-2019",
        "group_by": "day"
    }
]

 ```
 */
function queries(queriesArray) {
  return service('query', 'post', queriesArray);
}

function insert(collection, data) {
  return service(`interactr/${collection}`, 'post', data);
}

export default {
  queries,
  getCategoriesFromQuery,
  getSeriesFromQuery,
  registerTheme,
  getThemeColors,
  getBorderColors
  // insert
};


function getCategoriesFromQuery(query, group) {
    switch(group){
        case('day') :
            return getDayGrouping(query)
    }
}

function getSeriesFromQuery(query) {
    return query.map(a => parseInt(a.count));
}

function getDayGrouping(query){
    return query.map(a => a.start_date);
}

/**
 * Run this before drawing the chart to use the apps theme colours
 */
function registerTheme(){
    let theme = {
        series: {
            colors: [
                '#366fe0', '#41c186', '#ff6961', '#0eb6ac', '#556aff',
                '#7b8bff', '#71a0ee', '#f7882f', '#fcd534', '#6e3667'
            ]
        }
    };

    TuiChart.registerTheme('myTheme', theme);
}

function getThemeColors() {
    return [
        'rgb(54, 111, 224, 0.5)', 'rgb(65, 193, 134, 0.5)', 'rgb(255, 105, 97, 0.5)', 'rgb(14, 182, 172, 0.5)', 'rgb(85, 106, 255, 0.5)',
        'rgb(123, 139, 255, 0.5)', 'rgb(113, 160, 238, 0.5)', 'rgb(247, 136, 47, 0.5)', 'rgb(252, 213, 52, 0.5)', 'rgb(110, 54, 103, 0.5)'
    ];
}

function getBorderColors() {
    return [
        'rgb(54, 111, 224)', 'rgb(65, 193, 134)', 'rgb(255, 105, 97)', 'rgb(14, 182, 172)', 'rgb(85, 106, 255)',
        'rgb(123, 139, 255)', 'rgb(113, 160, 238)', 'rgb(247, 136, 47)', 'rgb(252, 213, 52)', 'rgb(110, 54, 103)'
    ];
}