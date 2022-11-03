import {BooleanInput, Option} from "../../../components/PropertyEditor";
import React, {useState} from "react";
import {useProject, useSaveProject} from "../../../graphql/Project/hooks";
import Icon from "../../../components/Icon";
import Swal from "sweetalert2";
import {errorAlert} from "../../../utils/alert";
import {enableSurveysAlerts} from "../../project/utils";
import {useReactiveVar} from "@apollo/client";
import {getAcl} from "../../../graphql/LocalState/acl";
import LinkButton from "../../../components/Buttons/LinkButton";

const ElementSurveyToggle = ({value, onChange}) => {
  const [project, _, {loading, error}] = useProject();
  const [saveProject, {loading: saving, error: savingError}] = useSaveProject();
  const [showModal, setShowModal] = useState(false);

  const acl = useReactiveVar(getAcl);

  if(! acl.canAccessSurveys){
    return(
      <>
        <label>Save Response As Survey</label>
        <p>You need to upgrade your account to use this feature.</p>
        <LinkButton primary icon={'arrow-up'} to={'/upgrade'} small>Upgrade Now</LinkButton>
      </>
    )
  }

  const changeHandler = async  (val) => {

    if(project.enable_surveys) {
      onChange(val);
    } else {
      if(val) {
        enableSurveysAlerts(onChange, saveProject, project.id);
      }
      onChange(0);
    }
  }

  if(loading || saving) return <Icon loading />;

  return(
    <>
      <Option
        label="Save Response As Survey"
        Component={BooleanInput}
        onChange={changeHandler}
        value={value}
      />
    </>
  )
};
export default ElementSurveyToggle;