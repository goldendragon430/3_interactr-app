import {gql, makeVar} from "@apollo/client";
import {cache} from "../client";



const ACL_DEFAULT_PROPS = {
  // Used like a loading prop the loggedInPage wont load in till this is true
  authUserId: 0,
  hasAgency: null,
  maxProjects: null,
  isSubUser: null,
  canAccessPopupTemplates: null,
  canAccessStockFootage: null,
  canAccessSurveys: null,
  canAccessCustomAnimations: null,
  canAccessExampleTemplates: null,
  canAccessDoneForYouTemplates: null,
  canHideLogoOnSharePage: null,
  canUseCustomLists: null,
  canAccessImageLibrary: null,
  isAdmin: null
};

export const getAcl = makeVar(ACL_DEFAULT_PROPS);

// Define the ACL for the user here, everything should be defined here so it can be easily updated when marketing want to change
// something
export const setAcl = (user) => {
  let newAcl = {
    authUserId: user.id
  };

  // If the user is a sub user most the other permissions are simple
  if(user.parent_user_id) {
    newAcl.isSubUser = true;

    getAcl({
      ...ACL_DEFAULT_PROPS, ...newAcl
    })
    return;
  }

  // Whitelabel / Agency Access
  if(user.is_agency || user.is_agency_club) {
    newAcl.hasAgency = true;
  }

  // Max Projects a user can create
  newAcl.maxProjects = user.maxProjects;

  // Control access to the advanced popup templates
  if(user.is_club || user.is_pro) {
    newAcl.canAccessProTemplates = true;
  }

  // Control access to the stock footage
  if(user.is_pro || user.is_club) {
    newAcl.canAccessStockFootage = true;
  }

  // Can use surveys
  if(user.is_pro) {
    newAcl.canAccessSurveys = true;
  }

  // Can access custom animations
  if(user.is_pro){
    newAcl.canAccessCustomAnimations = true;
  }

  // Control access to the monthly project templates
  if(user.is_club || user.is_agency_club){
    newAcl.canAccessDoneForYouTemplates = true;
  }

  // Control access to the layout templates
  if(user.is_pro || user.is_club) {
    newAcl.canAccessExampleTemplates = true;
  }

  // Is admin user
  if(user.superuser) {
    newAcl.isAdmin = true;
  }

  // Can the user hide the logo on share pages?
  if(user.is_club || user.is_agency || user.is_agency_club){
    newAcl.canHideLogoOnSharePage = true;
  }

  // Access to custom lists
  if(user.is_club || user.is_agency_club) {
    newAcl.canUseCustomLists = true;
  }

  // Can access the image library
  if(user.is_club || user.is_pro) {
    newAcl.canAccessImageLibrary = true;
  }

  getAcl(newAcl);
};

