import React, {useEffect, useState} from 'react';
import map from 'lodash/map';
import Modal from 'components/Modal';
import cardStyles from "../../../components/Card.module.scss";
import styles from './ClientSummary.module.scss';
import cx from 'classnames'
import ClientSummaryStat from "./ClientSummaryStat";
import {Menu, MenuButton, MenuItem, SubMenu} from "@szhsin/react-menu";
import Icon from "../../../components/Icon";
import {motion} from "framer-motion";
import {useSetState} from "../../../utils/hooks";
import reduce from "lodash/reduce";
import DashboardLoader from "../../dashboard/components/DashboardLoader";
import ErrorMessage from "../../../components/ErrorMessage";
import moment from "moment";
import analytics from "../../../utils/analytics";
import {isValidNumber, percentage} from "../../../utils/numberUtils";
import {useNavigate} from "react-router-dom";
import {useAuthUser, useCreateUser, useDeleteUser, useSaveUser, useUser} from "../../../graphql/User/hooks";
import {AgencyClientsPagePath} from "../routes";
import {getClientModal, setClientModal} from "../../../graphql/LocalState/clientModal";
import Button from "../../../components/Buttons/Button";
import AgencyUserForm from "../../user/components/AgencyUserForm";
import {deleteConfirmed} from "../../../graphql/utils";
import {errorAlert} from "../../../utils/alert";
import {gql, useReactiveVar} from "@apollo/client";
import {cache} from "../../../graphql/client";
import {useLoginAsUser} from "../../auth/utils";
import {delay} from "utils/timeUtils";

const ClientSummary = () => {
  const [state, setState] = useSetState({
    loading: true,
    error: false,
    data: {},
  });

  const authUser = useAuthUser();

  useEffect(()=>{
    (async () =>  {
      // A small delay here allows the loader to animate in nicely before we do anything
      await delay(2000);

      try {
        const data = await fetchStats(authUser.subusers);

        setState({
          loading: false,
          data
        })
      }catch(err){
        setState({
          loading: false,
          error: err
        })
      }
    })()

  }, []);

  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -30, scale: 1 },
    show: { opacity: 1, y:0, scale: 1, transition: {type: 'ease-in'} }
  }


  const {loading: stateLoading, data, error} = state;

  const {clientId} = useReactiveVar(getClientModal);

  //return null;
  // TODO need to add an svg loader here
  if(stateLoading) return <Icon loading={stateLoading} />;

  if(error) return <ErrorMessage error={error} />;

  return (
    <motion.div className="clearfix"  initial="hidden" animate="show"  variants={list}>
      {map(authUser.subusers, (client, index) => (
        <motion.div  key={index} variants={item} style={{float: 'left', width: '100%'}}>
          <Client client={client} data={data} />
        </motion.div>
      ))}
      {clientId ? <UserForm  clientId={clientId} /> : ""}
    </motion.div>
  )
};
export default ClientSummary;

const UserForm = ({clientId}) => {
  const {showModal} = useReactiveVar(getClientModal);
  const handleClose = () => {
      setClientModal(false);
  }

  const options = {
      onCompleted() {
          handleClose();
      }
  }

  const [selectedUser, updateUser, {error, loading}] = useUser(clientId);
  const [saveUser, {loading: updateUserLoading, error: mutationError}] = useSaveUser(options);
  const [createUser, {loading: createUserLoading, error: createUserError}] = useCreateUser(options);
  const [deleteUser, {loading: deleteUserLoading, error: deleteUserError}] = useDeleteUser(null, options);

  const disableInputs = loading || updateUserLoading || createUserLoading || deleteUserLoading;
  if(mutationError) {
      console.error(mutationError);
      errorAlert({text: 'Unable to save  user'})
  }

  if(createUserError) {
      console.error(createUserError);
      errorAlert({text: 'Unable to create new user'})
  }

  if(deleteUserError) {
      console.error(deleteUserError);
      errorAlert({text: "Unable to delete user"})
  }

  const handleCreate = async (user) => {
      user.email = user.email.toLowerCase();
      // Create brand new user
      const { data } = await createUser({...user});
      navigate(AgencyClientsPagePath({clientId: data.createUser.id}));
  }

  const handleUpdate = (user) => {
      if (!user.password) {
        delete user.password
      }

      let {subusers, superuser, max_projects, parent_user_id, gravatar, parent, ...userData} = user;

      // Update User
      saveUser({...userData});
  }    

  const handleDelete = async (userId) => {
      await deleteConfirmed(
          'user',
          async () => {
              const { data } = await deleteUser(null, parseInt(userId));
              let subusers = reduce(authUser.subusers, (result, subuser) => {
                  if(subuser.id == userId)
                      return result;
                  return result.concat(subuser);
              }, []);
              navigate(AgencyClientsPagePath({clientId: subusers.length > 0 ? subusers[0].id : 0}));
          }
      );
  }

  const formProps = {
      deleteConfirmed,
      updateUser: () => {console.log("updateUser")},
      onCreate: handleCreate,
      onUpdate: handleUpdate,
      onDelete: handleDelete,
      disableInputs: disableInputs,
      reset: handleClose
  };

  return (
    <Modal
      onClose={handleClose}
      show={showModal}
      width={700}
      height={650}
      heading={
        <><Icon name="pen-square" />Edit User</>
      }
      enableFooter={false}
    >
      <AgencyUserForm {...formProps} selectedUserID={clientId} selectedUser={selectedUser}/>
    </Modal>
  )
};

const Client = ({client, data}) => {
  const [loginAsUser, {loading: userLoading, error}] = useLoginAsUser();
  const onLoginAsUser = (id) => {
    loginAsUser({
      userId: id,
      saveOnStorage: true,
    })
  };
  const navigate = useNavigate();
  
  return (
    <div className={cardStyles.Card} style={{padding: '15px'}}>
      <div style={{position:'absolute', top: '10px', right: '10px'}}>
        <Menu menuButton={<MenuButton><Icon name={'ellipsis-v'} style={{marginRight: 0}} /></MenuButton>}>
          <MenuItem onClick={() => {navigate(AgencyClientsPagePath({clientId: client.id}));}}>View Client</MenuItem>
          <MenuItem onClick={() => {setClientModal({showModal: true, clientId: client.id})}}>Edit Client</MenuItem>
          <MenuItem onClick={() => {onLoginAsUser(client.id)}}>Login as Client</MenuItem>
        </Menu>
      </div>
      <div className={'grid'}>
        <div className={cx(styles.column, 'col2')}>
          <img src={client.logo} className={'img-fluid'}/>
          <p style={{marginTop: '5px', fontSize: '11px'}}>{client.company_name || "No Company Name"}</p>
        </div>
        <div className={cx(styles.column, 'col3')}>
          <p>{client.name}</p>
          <p>
            <small className={'text-muted'}>{client.email}</small>
            <br/>
            <small className={'text-muted'}>{`${client.projects.length} Projects`}</small>
          </p>
        </div>
        <div className={cx(styles.column, 'col7')}>
          <div className={'grid'}>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Impressions'}
                loading={false}
                currentStat={  data['impressions_last_30_'+client.id]  }
                previousStat={  data['impressions_previous_30_'+client.id]  }
              />
            </div>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Plays'}
                loading={false}
                currentStat={  data['views_last_30_'+client.id]  }
                previousStat={  data['views_previous_30_'+client.id]  }
              />
            </div>
            <div className={'col4'}>
              <ClientSummaryStat
                label={'Play Rate'}
                loading={false}
                suffix={"%"}
                currentStat={ percentage( data['views_last_30_'+client.id],  data['impressions_last_30_'+client.id] ) }
                previousStat={ percentage( data['views_previous_30_'+client.id],   data['impressions_previous_30_'+client.id]  ) }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const fetchStats = async (clients) => {

  const previousStart = moment().subtract(61, 'day');
  const previousEnd = moment().subtract(31, 'day');
  const currentStart = moment().subtract(30, 'day');
  const currentEnd = moment()

  const queries = reduce(clients, (result, client)=>{
    if( client.projects.length ){
      return result.concat([
        {
          name: 'views_last_30_' + client.id,
          collection: 'ProjectView',
          api: 'Interactr',
          filters: {
            project_id: client.projects
          },
          start_date: currentStart,
          end_date: currentEnd,
        },
        {
          name: 'views_previous_30_' + client.id,
          collection: 'ProjectView',
          api: 'Interactr',
          filters: {
            project_id: client.projects
          },
          start_date: previousStart,
          end_date: previousEnd,
        },
        {
          name:  'impressions_last_30_' + client.id,
          collection: 'Impression',
          api: 'Interactr',
          filters: {
            project_id: client.projects
          },
          start_date: currentStart,
          end_date: currentEnd,
        },
        {
          name: 'impressions_previous_30_' + client.id,
          collection: 'Impression',
          api: 'Interactr',
          filters: {
            project_id: client.projects
          },
          start_date: previousStart,
          end_date: previousEnd,
        },
      ])
    }else{
      return result;
    }

  }, []);


  let { data } = await analytics.queries(queries);



  return data;
}