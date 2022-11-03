import React, {useEffect} from 'react';
import {BooleanInput, Option, TextInput} from "../../../components/PropertyEditor";
import IconButton from "../../../components/Buttons/IconButton";
import Button from "../../../components/Buttons/Button";
import {useSetState} from "../../../utils/hooks";

/**
 * Displays the form for creating or editing user item based on selected type
 * @param onDelete
 * @param onUpdate
 * @param onCreate
 * @param selectedUser
 * @param updateUser
 * @param disableInputs
 * @param reset
 * @returns {*}
 * @constructor
 */
const AdminUserForm = ({onDelete, onUpdate, onCreate, selectedUser, updateUser, disableInputs, reset}) => {
    const NEW_USER = {
        name: '',
        email: '',
        password: '',
        is_club: 0,
        is_agency: 0,
        is_pro: 0,
        is_agency_club: 0,
    };

    const resetSelectedUser = () => {
        reset();
        setState({ ...NEW_USER });
    };

    const [state, setState] = useSetState(NEW_USER);

    const changeHandler = (key) => (value) => {
        if (selectedUser) {
            updateUser(key, value);
            return;
        }

        setState({[key]: value});
    };

    const handleCreateUser = user => {
        if (!user.advanced_analytics) {
            user.max_projects = 3;
            user.advanced_analytics = 0;
        }

        onCreate(user);
    }

    const onSubmit = user => {
        if (selectedUser)
            return onUpdate({...user});

        return handleCreateUser({...user});
    }

    const user = selectedUser || state;

    const {
        id: userId,
        name,
        email,
        password,
        is_club,
        is_agency,
        is_pro,
        is_agency_club,
    } = user;

    return (
        <div>
            <div className="grid">
                <div className="col6">
                    <Option
                        label="Name"
                        value={name}
                        Component={TextInput}
                        onChange={changeHandler('name')}
                        disabled={disableInputs}
                    />
                    <Option
                        label="Email"
                        value={email}
                        Component={TextInput}
                        placeholder="me@myemail.com"
                        onChange={changeHandler('email')}
                        disabled={disableInputs}
                    />
                    <Option
                        label="Password"
                        type="password"
                        value={password}
                        Component={TextInput}
                        onChange={changeHandler('password')}
                        disabled={disableInputs}
                    />
                </div>
                <div className="col6">
                    <div className="grid">
                        <div className="col12">
                            <h3>New User Access Levels</h3>
                            <Option
                                label="Pro"
                                value={is_pro}
                                Component={BooleanInput}
                                onChange={changeHandler('is_pro')}
                                disabled={disableInputs}
                            />
                            <Option
                                label="Agency Club"
                                value={is_agency_club}
                                Component={BooleanInput}
                                onChange={changeHandler('is_agency_club')}
                                disabled={disableInputs}
                            />
                            <h3>Legacy User Access Levels (Pre Evolution)</h3>
                            <Option
                                label="Club"
                                value={is_club}
                                Component={BooleanInput}
                                onChange={changeHandler('is_club')}
                                disabled={disableInputs}
                            />
                            <Option
                                label="Agency"
                                value={is_agency}
                                Component={BooleanInput}
                                onChange={changeHandler('is_agency')}
                                disabled={disableInputs}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <div>
                    {userId ? (
                        <Button red onClick={() => onDelete(userId)} style={{ float: 'left', color: '#fff', marginRight: 30 }} icon="trash-alt">
                            Delete User
                        </Button>
                    ) : null}
                    <Button
                        icon="save"
                        loading={disableInputs}
                        primary
                        onClick={() => onSubmit(user)}
                    >
                        Save
                    </Button>
                </div>
                <Button left onClick={resetSelectedUser} icon="arrow-left">
                    Back
                </Button>
            </div>
        </div>
    );
}


export default AdminUserForm;