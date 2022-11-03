import React from 'react';
import {useSetState} from "../../../utils/hooks";
import {useCreateComment} from "../../../graphql/Comment/hooks";
import Modal from 'components/Modal';
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import {useSharePageRoute} from "../routeHooks";

/**
 * Render popup to create new comment for the project
 * @param project_id
 * @param show
 * @param close
 * @param refetch
 * @returns {*}
 * @constructor
 */
const NewCommentModal = ({project_id, show, close, refetch}) => {
    const defaultState = {
        name: '',
        email: '',
        text: ''
    };
    const [state, setState] = useSetState(defaultState);
    const cleanState = () => setState(defaultState);

    const [_, __, {page}] = useSharePageRoute();
    const options = {
        onCompleted() {
            close();
            cleanState();

            refetch({
                project_id,
                page,
                first: 25
            });
        }
    };
    const [createComment, {loading, error}] = useCreateComment(options);

    const {name, email, text} = state;

    const handleCreate = async () => {
        if (!validateInputs()) return;

        createComment({
            name,
            email,
            text,
            project_id
        });
    };

    const handleClose = () => {
        cleanState();
        close();
    };

    const validateInputs = () => {
        if (!name.length) {
            error({ text: 'Please enter your name' });
            return false;
        }

        if (!email.length) {
            error({ text: 'Please enter your email' });
            return false;
        }

        if (!text.length) {
            error({ text: 'Please enter a comment' });
            return false;
        }

        return true;
    };

    return (
        <Modal
            show={show}
            onClose={handleClose}
            customStyles={{overflow: 'inherit'}}
            height={600}
            width={460}
            heading={
                <>
                    <Icon name="plus" /> Add A New Comment
                </>
            }
            submitButton={
                <Button primary onClick={handleCreate} loading={loading} icon={'save'}>
                    Create
                </Button>
            }
        >
            <div style={{marginTop: '10px'}}>
                <div className="form-control">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setState({name: e.target.value})}
                    />
                </div>
                <div className="form-control">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setState({email: e.target.value})}
                    />
                </div>
                <div className="form-control">
                    <label>Comment</label>
                    <textarea
                        value={text}
                        rows={10}
                        onChange={e => setState({text: e.target.value})}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default NewCommentModal;