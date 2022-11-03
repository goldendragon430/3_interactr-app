import React, {useContext, useEffect, useRef, useState} from 'react';
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import {useSaveUser, useUserCommands} from "../../../graphql/User/hooks";
import PasswordStrengthBar from 'react-password-strength-bar';
import {Option, TextInput} from "../../../components/PropertyEditor";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import Modal from "../../../components/Modal";
import {errorAlert} from "../../../utils/alert";
import cx from "classnames";
import styles from './ResetPasswordModal.module.scss';

/**
 * Show the form for a user to reset their account password
 * @param show
 * @param close
 * @param user
 * @returns {*}
 * @constructor
 */
const ResetPasswordModal = ({show, close, user}) => {
    const [state, setState] = useSetState({
        password: '',
        confirmPassword: '',
        inputError: '',
        saving: false,
        passwordType: 'password',
        confirmPasswordType: 'password',

    });

    const {password, confirmPassword, inputError, passwordType, confirmPasswordType} = state;

    const options = {
        // Func to be fired when the mutation is complete
        onCompleted: () => closeModal()
    };

    const {saveUser} = useUserCommands();

    const updatePassword = async () => {
        if (password !== confirmPassword) {
            setState({inputError: "Password & confirmation don't match"});
            return;
        }

        // Check for whitespace
        if(password.indexOf(' ') >= 0){
            setState({inputError: "Password can't contain spaces"});
            return;
        }

        setState({
            saving: true
        });

        try {
            await saveUser({
                variables: {
                    input: {
                        id: user.id,
                        password
                    }
                }
            })
            close();
        }
        catch(err){
            console.error(e)
            errorAlert({text: 'Unable to save password'})
        }


        setState({
            saving: false,
            inputError: '',
            password: '',
            confirmPassword: ''
        });
    };

    const resetFields = () => {
        setState({
            password: '',
            confirmPassword: '',
            inputError: ''
        });
    };

    const closeModal = () => {
        resetFields();
        close();
    };

    const {saving} = state;

    return (
        <Modal
            show={show}
            height={345}
            onClose={close}
            heading={
                <><Icon name="lock" /> Change Password</>
            }
            submitButton={
                <Button
                  primary
                  onClick={updatePassword}
                  loading={saving}
                  icon={'lock'}
                >Change Password</Button>
            }
        >
            <div className={cx(styles.passwordField, "form-control")}>
                <label>New password</label>
                <input
                    type={passwordType}
                    name="password"
                    className="rounded"
                    // placeholder="Password"
                    onChange={e => setState({password: e.target.value})}
                    onKeyPress={(e) => (e.key === 'Enter' ? updatePassword(e.target.value) : null)}
                    value={password}
                />
                {passwordType === 'password' && (
                    <small onClick={() => setState({passwordType: 'text'})}>SHOW</small>
                )}
                {passwordType === 'text' && (
                    <small onClick={() => setState({passwordType: 'password'})}>HIDE</small>
                )}
            </div>
            <div className={cx(styles.passwordField, "form-control")}>
                <label>Confirm new password</label>
                <input
                    type={confirmPasswordType}
                    name="confirmPassword"
                    className="rounded"
                    // placeholder="Password"
                    onChange={e => setState({confirmPassword: e.target.value})}
                    onKeyPress={(e) => (e.key === 'Enter' ? updatePassword(e.target.value) : null)}
                    value={confirmPassword}
                />
                {confirmPasswordType === 'password' && (
                    <small onClick={() => setState({confirmPasswordType: 'text'})}>SHOW</small>
                )}
                {confirmPasswordType === 'text' && (
                    <small onClick={() => setState({confirmPasswordType: 'password'})}>HIDE</small>
                )}
                <p style={{
                    color: '#ff6961',
                }}>{inputError}</p>
            </div>
            
        </Modal>
    )
};
export default ResetPasswordModal;