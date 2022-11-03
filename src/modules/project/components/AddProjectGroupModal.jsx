import React, { useState } from "react";

import { Modal } from "components";
import { useCreateProjectGroup } from "@/graphql/ProjectGroup/hooks";
import { Option, TextInput } from "components/PropertyEditor";
import { Button } from "components/Buttons";
import { errorAlert } from "utils/alert";


/**
 * Open new popup to create new project group
 * @param show
 * @param toggle
 * @returns {*}
 * @constructor
 */
export const AddProjectGroupModal = ({show, toggle}) => {
    const [title, setTitle] = useState("");
    const [createProjectGroup, {loading}] = useCreateProjectGroup();

    const onSubmit = async () => {
        try {
            await createProjectGroup({ title });
            setTitle("");
            toggle(false);
        } catch (error) {
            errorAlert({text: error});
        }
    };

    const onClose = () => {
      setTitle("");
      toggle(false);
    }

    return (
      <Modal 
        heading={'Add New Folder'}
        show={show}
        height={240}
        width={400}
        submitButton={(
          <Button 
            icon="plus" 
            loading={loading} 
            primary onClick={onSubmit}
            small
          >
            Create
          </Button>
        )}
        onClose={onClose}
        onBack={onClose}
      >
        <div className="grid">
          <div className="col12">
            <Option
                label="Enter a name for the folder"
                value={title}
                Component={TextInput}
                onChange={val => setTitle(val)}
            />
          </div>
        </div>
      </Modal>
    );
};