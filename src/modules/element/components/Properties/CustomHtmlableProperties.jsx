import {motion} from "framer-motion";
import {HtmlInput, LargeTextInput, Option, Section} from "../../../../components/PropertyEditor";
import React from "react";

const CustomHtmlableProperties = ({tabAnimation, element, update}) => {

  const {html} = element;

  return(
    <motion.div {...tabAnimation}>
      <Section>
        <Option
          label="HTML"
          value={html}
          Component={HtmlInput}
          onChange={val=>update("html", val)}
        />
      </Section>
    </motion.div>
  )
};
export default CustomHtmlableProperties;