import React from 'react';
import sunburst from './sunburst';
import find from "lodash/find";


export default class InteractionsChart extends React.Component {
    constructor(props) {
        super(props);
    }

    getNodeName(nodeId){
        const node = find(this.props.nodes, {id: parseInt(nodeId)});
        // Max out at 11 characters so the text don't overflow
        return (node) ? node.name.split('-').join(' ').substring(0, 12) : "Deleted Node";
    }

    async componentDidMount() {
        const { data } = this.props;
        
        if (data) {
            setTimeout(()=>{
                new sunburst(data.interaction.map(interaction=>{
                    const nodes = interaction.view_path.split(',');
                    const nodeNames = nodes.map(node=>this.getNodeName(node));

                    return {
                        count: interaction.count,
                        view_path: nodeNames.join(',')
                    }
                }));
            }, 1000);
        }
    }

    // async componentDidUpdate(nextProps, nextState){
    //     const { data } = nextProps;
    //     if (data) {
    //         document.getElementById('sequence').innerHTML = '';
    //         document.getElementById('legend').innerHTML = '';
    //         document.getElementById('chart').innerHTML = `<div id="explanation"><span id="percentage"></span><br/>of viewers watch this sequence of nodes</div>`;
    //
    //         setTimeout(()=>{
    //             new sunburst(data.interaction);
    //         }, 1000);
    //     }
    // }

    render() {
        const {data}  = this.props;

        if(! data) return null;

        return(
            <div id="container">
                <h3 style={{fontWeight: 500, color: 'black'}}>Project Interactions</h3>
                {
                    (! data.interaction.length) ?
                        <h4 style={{textAlign: 'center', marginTop: '150px'}}>Not Enough Data For Chart</h4>
                    :
                        <div>
                            <div id="main">
                                <div id="sequence"></div>
                                <div id="chart">
                                    <div id="explanation">
                                        <span id="percentage"></span><br/>
                                        of viewers watch this sequence of nodes
                                    </div>
                                </div>
                            </div>
                            <div id="sidebar">
                                <p style={{marginBottom: 0}}><strong>Nodes</strong></p>
                                <div id="legend" ></div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}