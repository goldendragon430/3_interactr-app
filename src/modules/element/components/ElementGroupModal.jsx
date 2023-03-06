import React from 'react';
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from 'react-router-dom';
import Button from "../../../components/Buttons/Button";
import { EventListener } from "../../../components/EventListener";
import Icon from "../../../components/Icon";
import Modal from "../../../components/Modal";
import { Option, TextInput } from "../../../components/PropertyEditor";
import { useElementGroupCommands } from "../../../graphql/ElementGroup/hooks";
import { errorAlert } from "../../../utils/alert";
import { REFETCH_GROUPS, TOGGLE_ELEMENT_GROUP_MODAL } from "../../../utils/EventEmitter";
import { useSetState } from "../../../utils/hooks";


const PLAYER_QUERY = gql`
    query player {
        player @client { 
            duration
        }
    }
`;

const INITIAL_STATE = {
  name: '',
  show: false,
  loading: false
}
const ElementGroupModal = () => {
  const {nodeId} = useParams();

  const [state, setState] = useSetState(INITIAL_STATE);

  const {createElementGroup} = useElementGroupCommands(nodeId);

  const {data: playerData} = useQuery(PLAYER_QUERY);

  const closeModal = () => setState(INITIAL_STATE)

  const formSubmit = async () => {
    setState({loading: true});

    try {
      const req = await createElementGroup({
        variables: {input: {
            name,
            node_id: parseInt(nodeId),
            timeIn: 0,
            timeOut: playerData.player.duration,
            zIndex: 100
          }},
      });

      const event = new CustomEvent(REFETCH_GROUPS)
      window.dispatchEvent(event);

      closeModal();

    }catch(err){
      setState({loading: false});
      console.error(err);
      errorAlert({text: 'Error creating element group'})
    }
  };

  const {show, name, loading} = state;

  return (
    <>
      <EventListener name={TOGGLE_ELEMENT_GROUP_MODAL} func={()=>setState({show: ! show})}>
        {
          show && 
          <Modal
            show={show}
            height={265}
            onClose={closeModal}
            heading={
              <><Icon name="plus" /> Add New Element Group</>
            }
            submitButton={
              <Button
                icon={'plus'}
                loading={loading}
                onClick={formSubmit}
                primary
              >Create</Button>
            }
          >
            <div className="form-control">
              <Option
                label="Element Group Name"
                value={name}
                Component={TextInput}
                onChange={val=>setState({name: val})}
                disabled={loading}
                onEnter={formSubmit}
                autofocus
              />
            </div>
          </Modal>
        }
      </EventListener>
    </>
  )
};
export default ElementGroupModal;