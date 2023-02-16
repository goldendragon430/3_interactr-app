import { useReactiveVar } from "@apollo/client";
import { getAcl } from "../graphql/LocalState/acl";

const AccessControl = ({action, children, cant = null}) => {
  const acl = useReactiveVar(getAcl);

  if(acl[action]){
    return children
  }

  return cant;
};

export default AccessControl;