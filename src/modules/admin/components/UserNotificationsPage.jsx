import React, { useEffect, useState } from 'react';
// import {cache} from "../../../graphql/client";
import gql from "graphql-tag";
import map from 'lodash/map';
import cx from 'classnames';
import listStyles from '../../dashboard/components/WhatsNew.module.scss';
import Icon from "components/Icon";
import {AnimatePresence, motion} from "framer-motion";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import { useSaveUserNotification, useUserNotificationCommands} from "../../../graphql/UserNotification/hooks";
import {Option, TextInput, LargeTextInput, IntegerInput} from "components/PropertyEditor";
import {animationState, preAnimationState, transition} from "components/PageBody";
import styles from '../../project/components/ProjectSettingsPage.module.scss';
import Button from 'components/Buttons/Button';
import {useSetState} from "../../../utils/hooks";
import {confirm, errorAlert} from "../../../utils/alert";
import moment from "moment";
import {useQuery} from "@apollo/client";
import ErrorMessage from "components/ErrorMessage";
import Modal from "components/Modal";
import ReactTooltip from "react-tooltip";
import closestIndexTo from 'date-fns/esm/fp/closestIndexTo/index.js';
//import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// TODO
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
//import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const QUERY = gql`
    query allUserNotifications {
        result: allUserNotifications(limit: 5) {
            id
            title
            details
            launch_date
            modal_height,
            created_at
        }
    }
`;


const UserNotificationsPage = () => {
  const {data, loading, error} = useQuery(QUERY);

  setBreadcrumbs([
    {text: 'Admin', link: '/admin/dashboard'},
    {text: 'User Notifications'},
  ]);

  setPageHeader('User Notifications');

  if (loading) return <div className={styles.wrapper}><Icon loading /></div>;

  if(error ) return <ErrorMessage error={error} />;

  const userNotifications = data.result;

  return (
      <AnimatePresence>
        <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}
        >
          <UserNotificationsPageBody userNotifications={userNotifications} />
        </motion.div>
      </AnimatePresence>
  )
};

export default UserNotificationsPage;

const UserNotificationsPageBody = ({ userNotifications }) => {  
  const [state, setState] = useSetState({
    showModal: false,
  })

  const { showModal } = state;

  return (
    <>
      <div style={{ paddingLeft: 10 }}>
        <div className="grid">
          <div className="col12" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <h2 className="form-heading" style={{ paddingLeft: 30, marginRight: 30, marginBottom: 0, paddingTop: 5 }}>All Notifications</h2>
            <Button 
              primary 
              icon={'plus'} 
              onClick={() => setState({ showModal: true })}
            >Add Notification</Button>
          </div>
        </div>
        <div className="grid">
          <div className="col8">
            <UserNotificationsList userNotifications={userNotifications} />
          </div>
        </div>
      </div>
      <AddUserNotificationModal
        showModal={showModal}
        closeModal={() => setState({ showModal: false })} 
      />
    </>
  )
}

const UserNotificationsList = ({ userNotifications }) => {
  const [state, setState] = useSetState({
    show: false,
    activeItem: false,
    selectedNotification: null,
  })

  const handleEditModal = (notification) => {
    setState({
        show: true,
        selectedNotification: notification
    })
  };

  const {show, selectedNotification} = state;

  return (
    <>
      <div className={'grid'} style={{ margin: '20px 0 0 5px' }}>
        <div className={'col12'} style={{margin: 0}}>
          <ul className={listStyles.listWrapper}>
            {
              map(userNotifications, (item, idx) => (
                <UserNotification
                  item={item} 
                  key={idx} 
                  onUpdate={() => handleEditModal(item)} />
              ))
            }
          </ul>
        </div>
      </div>
      <EditUserNotificationModal
        showModal={show}
        selectedNotification={selectedNotification}
        closeModal={() => setState({ show: false })} 
      />
    </>
  )
}

const UserNotification = ({ item, onUpdate }) => {
  const [state, setState] = useSetState({
    deleting: false
  })

  const { deleteUserNotification } = useUserNotificationCommands();

  const confirmDeleteMedia = (userNotification) => {
    confirm({
        title: 'Are You Sure!',
        text: 'Are You Sure You Want To Delete This Notification?',
        confirmButtonText: 'Yes, Delete It!',
        onConfirm: async () => {
            try {
                setState({ deleting: true });
                await deleteUserNotification({
                  variables: { id: userNotification.id }
                })
            } catch (err) {
                errorAlert({text: 'Can\'t delete notification item at the moment'});
                console.log(err);
            } finally {
              setState({ deleting: false });
            }
        }
    });
  };

  const { deleting } = state;

  return (
    <li className="grid" style={{borderBottom: '2px solid #f3f6fd',  position: 'relative', padding: '5px 0'}}>
      <ReactTooltip className="tooltip" />
      <div className="col8">
        <h4 style={{marginBottom: 0, marginTop: '10px', color: '#366fe0', fontWeight: 500}} onClick={()=>setState({show: true, activeItem: item})}>
          {item.title}
        </h4>
        <p style={{ margin: '8px 0' }}><small>{item.details}</small></p>
        <small>{moment.utc(item.launch_date).fromNow()}</small>
      </div>
      <div className="col4 text-right" style={{paddingTop: '28px'}}>
        <span style={{cursor: 'pointer', marginRight: '15px'}} data-tip={'Edit'}>
          <Icon name={'edit'} onClick={onUpdate} />
        </span>
        <span 
          style={{cursor: 'pointer'}} 
          data-tip={'Delete'}
          onClick={() => confirmDeleteMedia(item)}
        >
            {(deleting) ? <Icon loading /> : <Icon name={'trash-alt'} />}
        </span>
      </div>
    </li>
  )
}

const AddUserNotificationModal = ({ showModal, closeModal }) => {
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { createUserNotification } = useUserNotificationCommands();

  const [state, setState] = useSetState({
    title: '',
    details: '',
    launchDate: '',
    modalHeight: 500,
    loading: false,
    editorState: EditorState.createEmpty()
  });

  const handleSave = async () => {
    try {
      setState({ loading: true });
      await createUserNotification({ 
        variables: {
          input: {
            title: state.title,
            // TODO
            //details: draftToHtml(convertToRaw(state.editorState.getCurrentContent())),
            launch_date: moment().format(state.launchDate),
            modal_height: state.modalHeight
          }
        }
      });
    } catch(err){
      console.error(err)
      errorAlert({text: 'Unable to save changes'})
    } finally {
      setState({ loading: false });
      closeModal();
    }
  }

  const {title, launchDate, modalHeight, loading, editorState} = state;

  return (
    <Modal 
      width={580} 
      height={660} 
      show={showModal} 
      onClose={closeModal}
      heading={
        <>
          <Icon name="plus" />
          Add User Notification
        </>
      }
      submitButton={
        <Button 
          primary 
          loading={loading} 
          icon={'save'} 
          onClick={handleSave}
        >
          Add
        </Button>
      }
    >
      <div style={{ padding: 10 }}>
        <Option
          label="Title"
          name="title"
          value={title}
          disabled={loading}
          Component={TextInput}
          autofocus={false}
          placeholder="Title"
          onChange={val => setState({ title: val })}
          onEnter={handleSave}
        />

        <label>Details</label>
        <Editor
          editorState={editorState}
          onEditorStateChange={val => setState({ editorState: val })}
          editorStyle={{
            background: '#fff',
            border: '1px solid #d2d6dc',
            color: '#303030',
            fontSize: 14,
            height: 120,
            lineHeight: 1.5,
            outline: 'initial !important',
            padding: '7px 14px',
            width: '100%',
            transition: 'all 0.2s ease',
            borderRadius: 10,
            overflow: 'auto'
          }}
        />

        <div style={{ marginTop: 20 }}>
          <label>Launch Date</label>
          <input
            type="date"
            name="launchDate"
            placeholder="Launch Date"
            value={launchDate}
            onChange={(e) => setState({launchDate: e.target.value})}
          />
        </div>
      
        <Option
          label="Modal Height"
          name="modalHeight"
          value={modalHeight}
          disabled={loading}
          Component={IntegerInput}
          placeholder="Modal Height in Pixels"
          onChange={e => setState({ modalHeight: Number(e.target.value) })}
          style={{ margin: '20px 0' }}
        />
      </div>
    </Modal>
  )
}

const EditUserNotificationModal = ({ showModal, closeModal, selectedNotification }) => {
  const [editorState, setEditorState] = useState();
  const [updateUserNotification, {loading, _}] = useSaveUserNotification();
  const [userNotification, setUserNotification] = useSetState(selectedNotification);
  
  useEffect(() => {
    if(selectedNotification) {
      const contentBlock = htmlToDraft(selectedNotification.details);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setUserNotification(selectedNotification)
    }  
  }, [selectedNotification])
  
  if (!userNotification) return null;

  const handleUpdate = async () => {
    try {
      const { id, title, launch_date, modal_height } = userNotification;
      await updateUserNotification({
        id: Number(id),
        title,
        details: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        launch_date,
        modal_height
      });
    } catch (error) {
      errorAlert({text: error});
    } finally {
      closeModal();
    }
  }

  return (
    <Modal 
      width={580} 
      height={660} 
      show={showModal} 
      onClose={closeModal}
      heading={
        <>
          <Icon name="plus" />
          Edit User Notification
        </>
      }
      submitButton={
        <Button 
          primary 
          loading={loading} 
          icon={'save'} 
          onClick={handleUpdate}
        >
          Save
        </Button>
      }
    >
      <div style={{ padding: 10 }}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={userNotification.title}
          onChange={ e => setUserNotification({ title: e.target.value })}
        />

        <label style={{ marginTop: 20 }}>Details</label>
        <Editor
          editorState={editorState}
          onEditorStateChange={val => setEditorState(val)}
          editorStyle={{
            background: '#fff',
            border: '1px solid #d2d6dc',
            color: '#303030',
            fontSize: 14,
            height: 120,
            lineHeight: 1.5,
            outline: 'initial !important',
            padding: '7px 14px',
            width: '100%',
            transition: 'all 0.2s ease',
            borderRadius: 10,
            overflow: 'auto'
          }}
        />

        <div style={{ marginTop: 20 }}>
          <label>Launch Date</label>
          <input
            type="date"
            name="launchDate"
            placeholder="Launch Date"
            value={userNotification.launch_date}
            onChange={ e => setUserNotification({ launch_date: e.target.value })}
          />
        </div>
      
        <Option
          label="Modal Height"
          name="modalHeight"
          value={userNotification.modal_height}
          disabled={loading}
          Component={IntegerInput}
          placeholder="Modal Height in Pixels"
          onChange={(e) => setUserNotification({ modal_height: Number(e.target.value) })}
          style={{ margin: '20px 0' }}
        />
      </div>
    </Modal>
  )
}