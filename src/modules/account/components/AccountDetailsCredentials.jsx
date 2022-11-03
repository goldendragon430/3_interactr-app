import React, {useState} from 'react';
import CopyToClipboard from 'components/CopyToClipboard';
import PageBody from 'components/PageBody';
import {useAuthUser, useSaveUser} from "../../../graphql/User/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import MessageBox from "../../../components/MessageBox";

const generateKey = () => {
  const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let key = '';
  for (let i = 0; i < range.length; i++) {
    key += range[Math.floor(Math.random() * range.length)];
  }
  return key;
};

const AccountDetailsCredentials = () =>  {
  const [generating, setGenerating] = useState(false);
  const userData = useAuthUser();
  const options = {
    onCompleted() {
      setGenerating(false);
    }
  };
  const [saveUser, {loading: saving, error: mutationError}] = useSaveUser(options);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  const {api_key} = userData;

  if (!generating && !api_key) {
    setGenerating(true);

    saveUser({
      id: userData.id,
      api_key: generateKey()
    })
  }

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">API Keys</h3>
        {saving ? (
          <h3>
            <strong>Generating You a Key...</strong>
          </h3>
        ) : (
          <div style={{ width: '100%', maxWidth: 800 }}>
            <h4>Your API Key</h4>
            <CopyToClipboard rows={1} value={api_key} />
          </div>
        )}
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Using the API</h3>
          <p>The first step is to define the basic information of your agency. This includes the agency name and branding colors.</p>
          <p><u>Primary Color</u> - This is used in the app to replace the interactr branding green color</p>
          <p><u>Secondary Color</u> - This is used in the app to replace the interactr branding blue color</p>
          <p><u>Background Color</u> - This is the sidebar color of the app, it should be a dark color so the navigation text remains readable</p>
        </MessageBox>
      </div>
    </div>
  );
};

export default AccountDetailsCredentials;