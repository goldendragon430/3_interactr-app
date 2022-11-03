import React, { Component } from 'react';
import { SelectInput } from 'components/PropertyEditor';
import IconButton from 'components/Buttons/IconButton';
import Icon from "components/Icon";
import Modal from 'components/Modal';
import { Option, TextInput } from 'components/PropertyEditor/PropertyEditor';
import Button from 'components/Buttons/Button';
import {useSetState} from "../../../utils/hooks";
import {useCreateCustomList} from "../../../graphql/CustomList/hooks";

/**
 * Show Add New Custom List modal
 * @returns {*}
 * @constructor
 */
const AddCustomListModal = ({onSuccess}) => {
    const [state, setState] = useSetState({
        custom_list_name: '',
        showModal: false
    });
    const options = {
        onCompleted({createCustomList}) {
            setState({custom_list_name: '', showModal: false});
            onSuccess(createCustomList.id);
        }
    };
    const [createCustomList, {loading: creating}] = useCreateCustomList(options);
    const {showModal, custom_list_name} = state;


    const toggle = (value) => {
        return () => setState({
            showModal: value
        });
    };

    const addCustomList = () => {
        const { custom_list_name } = state;

        if (!custom_list_name) {
            return error({ text: 'Please fill the custom list name.' });
        }

        createCustomList({
            custom_list_name
        });
    };

    const renderAddCustomListModal = () => {
        return (
            <Modal
                show={showModal}
                height={220}
                onClose={toggle(false)}
                heading={
                    <>
                        <Icon name="plus" /> Add New Custom List
                    </>
                }
                submitButton={
                    <Button
                        loading={creating}
                        primary
                        onClick={addCustomList}
                    >
                        Create
                    </Button>
                }
            >
                <div className="form-control">
                    <Option
                        label="Custom List Name"
                        value={custom_list_name}
                        Component={TextInput}
                        onChange={val=> setState({custom_list_name: val})}
                    />
                </div>
            </Modal>
        )
    };

    return (
        <div>
            <IconButton primary icon="plus" onClick={toggle(true)}>
                Create
            </IconButton>
            {renderAddCustomListModal()}
        </div>
    )
};

export default AddCustomListModal;