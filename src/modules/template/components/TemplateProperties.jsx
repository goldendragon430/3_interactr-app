import React, {useEffect, useState} from 'react';
import {
  Section,
  Option,
  BooleanInput,
  IntegerInput,
  InlineBooleanInput
} from 'components/PropertyEditor';
import DropImageZone from 'modules/media/components/DropImageZone';
import {useProjectCommands} from "../../../graphql/Project/hooks";
import Button from "../../../components/Buttons/Button";
import {errorAlert} from "../../../utils/alert";
import {toast} from 'react-toastify'
const TemplateProperties = ({item, modalProperties}) => {

  // For performance we write the template name to local state otherwise
  // we can create lag when typing in the text input fields
  const [saving, setSaving] = useState(false)

  const {updateProject, saveProject} = useProjectCommands();

  const {
    id,
    template_name,
    is_template,
    template_image_url,
    template_interactions,
    template_is_dfy,
    template_is_example,
  } = item;

  const handleSave = async () => {
    setSaving(true)

    try {
      if(! modalProperties) {
        await saveProject({
          variables: {
            input: {
              id,
              template_name,
              is_template,
              template_image_url,
              template_interactions,
              template_is_dfy,
              template_is_example,
            }
          }
        })
        toast.success("Success")
      }
      setSaving(false);

    }
    catch(err) {

      setSaving(false);
      console.error(err);
      errorAlert({text: 'Unable to save changes'})
    }
  };

  return (
    <div style={{paddingBottom: 40}}>
      <Section>
        <Option
          label="Is template"
          value={is_template}
          Component={BooleanInput}
          onChange={val => updateProject("is_template", val, id)}
        />

        {
          (!! is_template && <div className={'form-option'}>
            <label>Template Name</label>
            <input
              value={template_name}
              onChange={e => updateProject("template_name", e.target.value, id)}
            />
          </div>)
        }
        
        {modalProperties && <ModalTemplateProperties
          id={item.id}
          isTemplate={is_template}
          templateImageUrl={template_image_url}
          updateProject={updateProject}
        />}
        
        {!modalProperties && <ProjectTemplateProperties
          id={item.id}
          isTemplate={is_template}
          templateImageUrl={template_image_url}
          templateInteractions={template_interactions}
          templateIsDfy={template_is_dfy}
          templateIsExample={template_is_example}
          updateProject={updateProject}
        />}

        <Button loading={saving} onClick={handleSave} primary icon={'save'}>Save Changes</Button>

      </Section>
  </div>
  );
}

export default TemplateProperties;

const ModalTemplateProperties = ({ isTemplate, templateImageUrl, updateProject, id }) => {
  if(! isTemplate) return null;

  return (
    <>

      <DropImageZone
        directory="templateImages"
        onSuccess={src => updateProject("template_image_url", src, id )}
        src={templateImageUrl}
      />
    </>
  );
}

const ProjectTemplateProperties = ({ templateImageUrl, templateInteractions, templateIsDfy, templateIsExample, updateProject, isTemplate, id }) => {
  if(! isTemplate) return null;

  return (
    <>
      <DropImageZone
        directory="templateImages"
        onSuccess={src => updateProject({id,  template_image_url: src })}
        src={templateImageUrl}
      />

      <Option
        label="Template Interactions"
        helpText="How many interaction layers the template has"
        value={templateInteractions}
        style={{ marginTop: 20, width: 250 }}
        Component={IntegerInput}
        onChange={e => updateProject("template_interactions", (e.target.value) ? parseInt(e.target.value) : 0, id)}
      />

      <div className={'grid'}>
        <div className={'col6'}>
          <Option
            label="Dfy Template"
            value={templateIsDfy}
            Component={InlineBooleanInput}
            onChange={val => updateProject("template_is_dfy", (val) ? 1 : 0, id)}
          />
        </div>
        <div className={'col6'}>
          <Option
            label="Example Template"
            value={templateIsExample}
            Component={InlineBooleanInput}
            onChange={val => updateProject("template_is_example", (val) ? 1 : 0, id)}
          />
        </div>
      </div>




    </>
  )
}
