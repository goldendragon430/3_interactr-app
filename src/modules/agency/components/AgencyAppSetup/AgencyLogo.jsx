import React, {useState} from 'react';
import DropImageZone from "../../../media/components/DropImageZone";
import {cache} from "../../../../graphql/client";
import gql from "graphql-tag";
import {useAgencyCommands} from "../../../../graphql/Agency/hooks";
import {errorAlert} from "../../../../utils/alert";
import Icon from "../../../../components/Icon";
import MessageBox from "../../../../components/MessageBox";

const AgencyLogo = ({id}) => {
  const {saveAgency} = useAgencyCommands(id);

  const [loading, setLoading] = useState(false);

  const agency = cache.readFragment({
    id: `Agency:${id}`,
    fragment: gql`
        fragment AgencyFragment on Agency {
            id
            logo
        }
    `,
  });


  const handleSave = async ({src}) => {
    setLoading(true);

    try {
      await saveAgency({
        variables: {
          input: {
            id, logo: src
          }
        }
      })
    }
    catch(e){
      console.error(e)
      errorAlert({text: 'Unable to save changes'})
    }

    setLoading(false)
  };

  const {logo} = agency;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <div className="form-control">
          <label>Your Company Logo</label>
          {(loading) ? <Icon loading /> : <DropImageZone directory="logos" onSuccess={handleSave} src={logo} />}
        </div>
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Step Two - Your Company Logo</h3>
          <p>Here you can upload your company logo. This will be shown instead of the interactr logo on your share pages and on the bottom left of the screen in the app.</p>
          <p>We recommend using an image with the dimensions <strong>800 x 160</strong></p>
        </MessageBox>
      </div>
    </div>
  )
};
export default AgencyLogo;