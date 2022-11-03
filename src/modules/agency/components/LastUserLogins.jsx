import React from 'react'
import cardStyles from "../../../components/Card.module.scss";
import map from 'lodash/map';
import moment from "moment";
import styles from './LastUserLogins.module.scss'
import {useQuery} from "@apollo/client";
import {GET_SUBUSERS} from "../../../graphql/User/queries";
import {useAuthUser} from "../../../graphql/User/hooks";
import ErrorMessage from "../../../components/ErrorMessage";
import {avatar} from "../../../utils/helpers";

const LastUserlogins = () => {
  const authUser = useAuthUser();
  const {data, loading, error} = useQuery(GET_SUBUSERS, {
    variables: {
      page: 1,
      first: 4,
      parent_user_id: parseInt(authUser.id)
    }
  });
  if (error)
    return <ErrorMessage error={error} />;
  if (loading)
    return "Loading...";
  return (
    <>
      <h4 style={{marginBottom: '15px'}}><strong>Last User Logins</strong></h4>
      <div className={cardStyles.Card} style={{height: 'auto'}}>
        {map(data?.result.data, user => <ListItem user={user} key={`item-${user.id}`}/>)}
      </div>
    </>
  );
};
export default LastUserlogins;

const ListItem = ({user}) => {
  return (
    <div className={styles.listItem}>
      <div className={'grid'}>
        <div className={'col2'}>
          <img src={avatar(user)} className={'img-fluid'} style={{borderRadius: '50%'}}/>
        </div>
        <div className={'col6'}>
          {user.name}<br/>
          {user.email}
        </div>
        <div className={'col4 vertical-center'}>
          <em style={{opacity: 0.7}}>{user.last_login ? moment.utc(user.last_login).fromNow() : "Never"}</em>
        </div>
      </div>
    </div>
  );
};