import React, { useState, useEffect } from 'react';
import format from 'date-fns/format';
import axios from 'axios';
import styles from './PrivacyPolicy.module.scss';
import { error as errorAlert } from '@/utils/alert';
import utilsHelpText from '@/utils/helpText';

export default function PrivacyPolicy({ match }) {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        params: { userId }
      } = match;
      const url = `${import.meta.env.VITE_API_URL}privacy-policy/${userId}`;
      updatePageLoadingState(true);

      try {
        const res = await axios.get(url);
        const {
          data: { userInfo }
        } = res;
        if (userInfo) setUserInfo(userInfo);
        updatePageLoadingState(false);
      } catch (err) {
        updatePageLoadingState(false);
        errorAlert('Problem fetching the Data, please try again later!');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  let { privacy_policy_text: __html, updated_at } = userInfo;
  if (!__html) {
    __html = utilsHelpText.privacyPolicyDefaultText;
  }
  const updateDate = updated_at ? format(new Date(updated_at), 'MMMM do, yyyy') : null;

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <b>Privacy Policy</b>
        </div>
        {updated_at ? <div className={styles.update}>Last updated on {updateDate} </div> : null}
        <div className={styles.line}> </div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html }} />
      </div>
    </div>
  );
}
