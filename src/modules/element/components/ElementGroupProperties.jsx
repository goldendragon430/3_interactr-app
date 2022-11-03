import React, {useContext, useState} from "react";
import {motion} from "framer-motion";
import TimelineProperties from "./TimelineProperties";
import {Option, Section, TextInput} from "../../../components/PropertyEditor";
import gql from "graphql-tag";
import {ELEMENT_GROUP_FRAGMENT} from "../../../graphql/ElementGroup/fragments";
import {useQuery} from "@apollo/client";
import ErrorMessage from "../../../components/ErrorMessage";
import {useElementGroupCommands} from "../../../graphql/ElementGroup/hooks";

const QUERY = gql`
    query elementGroup($id: ID!) {
        elementGroup(id: $id) {
            ...ElementGroupFragment
        }
    }
    ${ELEMENT_GROUP_FRAGMENT}
`;
const ElementGroupProperties = ({id}) => {
  const {data, loading, error} = useQuery(QUERY, {
    variables: {id}
  })

  const {updateElementGroup} = useElementGroupCommands(id);

  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };

  const update = (key, value) => {
    updateElementGroup(key, value)
  };

  if(loading) return null;

  if(error) return <ErrorMessage error={error} />

  const {show_at_video_end, timeIn, timeOut, pause_when_shown, name} = data.elementGroup;

  return(
    <>
      <motion.div {...tabAnimation}>
        <Section>
          <div style={{marginBottom: '-30px'}}>
            <Name value={name} update={update} />
          </div>
          <TimelineProperties
            showAtVideoEnd={show_at_video_end}
            timeIn={timeIn}
            timeOut={timeOut}
            pauseWhenShown={pause_when_shown}
            update={update}
          />
        </Section>
      </motion.div>
    </>
  )
}
export default ElementGroupProperties;

const Name = ({value, update}) => {
  const [name, setName] = useState(value);

  return (
    <Option
      label="Name"
      value={name}
      Component={TextInput}
      onBlur={val=>update("name", val)}
      onChange={val=>setName(val)}
    />
  )
};