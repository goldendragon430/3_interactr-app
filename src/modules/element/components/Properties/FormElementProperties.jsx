import {elements, FORM_ELEMENT} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import React from "react";
import {useFormElementCommands} from "../../../../graphql/FormElement/hooks";


const FormElementProperties = ({element}) => {
    const {updateFormElement} = useFormElementCommands(element.id);

    const elementMeta = elements[FORM_ELEMENT];

    return <ElementPropertiesTabs
      meta={elementMeta}
      element={element}
      update={updateFormElement}
    />;
};

export default FormElementProperties;