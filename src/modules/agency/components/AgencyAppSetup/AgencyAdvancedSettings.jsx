import React, {useState} from 'react';
import {Option, TextInput} from "../../../../components/PropertyEditor";
import InputImageExample from "../../../../components/InputImageExample";
import DropImageZone from "../../../media/components/DropImageZone";
import {cache} from "../../../../graphql/client";
import gql from "graphql-tag";
import {useAgencyCommands} from "../../../../graphql/Agency/hooks";
import getAsset from "../../../../utils/getAsset";
import MessageBox from "../../../../components/MessageBox";
import Button from "../../../../components/Buttons/Button";
import {errorAlert} from "../../../../utils/alert";

const AgencyAdvancedSettings = ({id}) => {
  const [loading, setLoading] = useState(false);

  const {saveAgency, updateAgency} = useAgencyCommands(id);

  const agency = cache.readFragment({
    id: `Agency:${id}`,
    fragment: gql`
        fragment AgencyFragment on Agency {
            id
            page_title
            icon
        }
    `,
  });

  const onSave = async (fieldsToUpdate) => {
    setLoading(true);

    try {
      await saveAgency({
        variables: {
          input: {
            ...{id}, ...fieldsToUpdate
          }
        }
      })
    }
    catch(e){
      console.error(e)
      errorAlert({text: 'Unable to save changes'})
    }

    setLoading(false)
  }

  const onUploadComplete = ({src}) => {
    updateAgency({icon: src});
    onSave({icon: src});
  }

  const {page_title, icon} = agency;

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <Option
          label="Page Title"
          value={page_title}
          Component={TextInput}
          placeholder="My App - My Strapline"
          onChange={val=>updateAgency({page_title: val})}
          onEnter={()=>onSave({page_title})}
        />

        <div className="form-control">
          <label>Page Icon</label>
          <DropImageZone directory="icons" onSuccess={onUploadComplete} src={icon} />
        </div>

        <Button icon={'save'} loading={loading} primary onClick={()=>onSave({page_title})}>Save Changes</Button>
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Step Four - Advanced Settings</h3>
          <p>
            <u>Page Title</u> - This is the text that shows in the tab at the top of your browser when clients are logged into your custom branded app
            <InputImageExample
              image={getAsset("/img/pageTitleExample.png")}
              title="Example Page Title"
              height={213}
              width={692}
            />
          </p>
          <p>
            <u>Page Icon</u> - This is the small icon that appears next to the text in the browser tab
            <InputImageExample
              image={getAsset("/img/pageIconExample.png")}
              title="Example Page Icon"
              height={213}
              width={692}
            />
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default AgencyAdvancedSettings;