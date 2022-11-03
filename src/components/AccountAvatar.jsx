import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AccountAvatar.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
import Button from 'components/Buttons/Button';
import getAsset from "../utils/getAsset";
import {motion} from "framer-motion";
import UploadUserAvatarModal from "../modules/account/components/UpdateUserAvatarModal";
import {setUserAvatar} from "../graphql/LocalState/userAvatar";

const _propTypes = {
  user: PropTypes.object.isRequired
};
function Avatar({ user, users, loginAsUser, parentData }) {
  // const [showAvatarModal, setShowAvatarModal] = useState(false);
  // const isAgency = !!user.is_agency;
  // const isntSubUser = !user.parent_user_id;
  // const parentName = parentData ? parentData.name : '';
  const userAvatar = user.avatar_url ? user.avatar_url : getAsset('/img/avatar-logo.png');
  // Upload button will be occurred only when user has not uploaded yet
  const showUploadIcon = !user.avatar_url;


  const animate = {
    opacity: 1
  };

  const transition = { type: "spring", duration: 0.3, bounce: 0.2, damping: 15}

    return (
        <motion.div className={styles.my_account_dropdown} animate={animate} transition={transition} >
          <div className={styles.user_info}>
            <article className={cx(styles.avatar, { [styles.avatarHover]: user.is_agency})}>
                <img src={userAvatar + "?height=250"} alt="avatar picture" />
                {showUploadIcon && (
                    <Button primary className={styles.uploadAvatarIcon}  onClick={()=>setUserAvatar({showUserAvatarModal: true})}>
                      <Icon name="plus" style={{marginRight: 0}}/>
                    </Button>
                )}

                {/*{isAgency && (*/}
                {/*    <DropdownMenu*/}
                {/*        user={user}*/}
                {/*        usersList={users}*/}
                {/*        isntSubUser={isntSubUser}*/}
                {/*        loginAsUser={loginAsUser}*/}
                {/*    />*/}
                {/*)}*/}
            </article>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.email}><small>{user.email}</small></span>
          </div>
        </motion.div>
    );
}

Avatar.propTypes = _propTypes;
export default Avatar;