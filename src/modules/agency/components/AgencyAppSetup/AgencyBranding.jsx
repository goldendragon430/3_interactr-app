import React, {useState} from 'react'
import {Option, TextInput} from "../../../../components/PropertyEditor";
import ColorPicker from "../../../../components/ColorPicker";
import MessageBox from "../../../../components/MessageBox";
import {useAgencyCommands} from "../../../../graphql/Agency/hooks";
import Button from "../../../../components/Buttons/Button";
import {errorAlert} from "../../../../utils/alert";
import {useQuery} from "@apollo/client";
import gql from "graphql-tag";
import {cache} from "../../../../graphql/client";


const AgencyBranding = ({id}) => {

  const agency = cache.readFragment({
    id: `Agency:${id}`,
    fragment: gql`
        fragment AgencyFragment on Agency {
            id
            name, 
            primary_color, 
            secondary_color, 
            background_colour
        }
    `,
  });


  const {name, primary_color, secondary_color, background_colour} = agency;

  const {updateAgency, saveAgency} = useAgencyCommands(id);

  const [loading, setLoading] = useState(false);


  const handleSave = async () => {

    setLoading(true);

    try {
      await saveAgency({
        variables: {
          input: {
            id, name, primary_color, secondary_color, background_colour
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

  return(
    <div className={'grid'}>

      <div className={'col6'}>
        <Option
          label="Name"
          value={name || ''}
          Component={TextInput}
          placeholder="My Awesome App"
          onChange={val=>updateAgency({name: val})}
          onEnter={handleSave}
        />

        <Option
          label="Primary Color"
          value={primary_color}
          Component={ColorPicker}
          stackOrder={3}
          onChange={val=>updateAgency({primary_color: val})}
          style={{ marginTop: 20 }}
        />

        <Option
          label="Secondary Color"
          value={secondary_color}
          Component={ColorPicker}
          stackOrder={2}
          onChange={val=>updateAgency({secondary_color: val})}
        />

        <Option
          label="Background Colour"
          value={background_colour}
          Component={ColorPicker}
          stackOrder={1}
          onChange={val=>updateAgency({background_colour: val})}
        />

        <Button primary loading={loading} icon={'save'} onClick={handleSave}>Save Changes</Button>
      </div>

      <div className={'col5'}>
        <MessageBox>
          <h3>Step One - Branding</h3>
          <p>The first step is to define the basic information of your agency. This includes the agency name and branding colors.</p>
          <p><u>Primary Color</u> - This is used in the app to replace the interactr branding green color</p>
          <p><u>Secondary Color</u> - This is used in the app to replace the interactr branding blue color</p>
          <p><u>Background Color</u> - This is the sidebar color of the app, it should be a dark color so the navigation text remains readable</p>
        </MessageBox>
      </div>
    </div>
  )
};
export default AgencyBranding;