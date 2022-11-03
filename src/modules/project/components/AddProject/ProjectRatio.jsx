import React, { useState } from 'react'
import cx from "classnames";
import { RatioSelect } from './RatioSelect';

const options = {
    0: 720,
    1: 540,
    2: 228
};

export const ProjectRatio = ({ onChange}) => {
    const [baseWidth, setBaseWidth] = useState(720);
    const handleValueChange = (value) => {
        setBaseWidth(value);
        onChange(value);
    }
	return (
        <>
            <label htmlFor='p'>Project Ratio</label>
            <div className={'grid'}>
                <div className={'col4'}>
                    <RatioSelect
                        value={options[0]}
                        heading={"16:9"}
                        selected={baseWidth == options[0]}
                        onClick={handleValueChange}
                    />
                </div>
                <div className={'col4'}>
                    <RatioSelect 
                        heading={"4:3"}
                        value={options[1]}
                        selected={baseWidth == options[1]}
                        onClick={handleValueChange}
                    />
                </div>
                <div className={'col4'}>
                    <RatioSelect 
                        heading={"9:16"}
                        value={options[2]}
                        selected={baseWidth == options[2]}
                        onClick={handleValueChange}
                    />
                </div>
            </div>
        </>
	)
}