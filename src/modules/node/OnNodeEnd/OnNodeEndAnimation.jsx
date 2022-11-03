import React from 'react';
import map from "lodash/map";
import { motion } from "framer-motion";

import { AnimationPreview } from "../components";
import { Option, SelectInput } from "components/PropertyEditor";

export const OnNodeEndAnimation = ({node, update, tabAnimation}) => {
  const { completeAnimation } = node;

  return(
    <motion.div {...tabAnimation}>
      <Option
        label={"Select an Animation"}
        value={completeAnimation}
        onChange={val => update("completeAnimation", val)}
        Component={SelectInput}
        options={map(node_animations, (b,i)=>( {label: b.label, value:i} ) )}
      />
      <AnimationPreview completeAnimation={completeAnimation} />
    </motion.div>
  )
};