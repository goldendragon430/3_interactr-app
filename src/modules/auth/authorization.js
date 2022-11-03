/**
 * Define all the access levels of the app inside here so
 * they can easily be explained and used across the app
 */

/**
 * Does the user have access to pro
 * features
 * @param u
 * @returns {boolean|number}
 */
export const isProUser = u => {
  const user = userToCheck(u);

  // If user is not evolution they can't be evolution
  // pro users
  if(! user.evolution) return false;

  return (user.evolution_pro);
};

/**
 * Does this user have access to agency features
 * @param u
 * @returns {number|*}
 */
export const isAgencyUser = u => {
  const user = userToCheck(u);

  if(user.evolution) return (user.evolution_club);

  return (user.is_agency);
};

/**
 * Does this user have access to club
 * features
 * @param u
 */
export const isClubUser = u => {
  const user = userToCheck(u);

  if(user.evolution) return (user.evolution_club);

  return (user.is_club);
};

/**
 * Does this user have access to evolution
 * features
 * @param u
 * @returns {*}
 */
export const isEvolutionUser = u => {
  const user = userToCheck(u);

  return (user.evolution);
};


/**
 * Returns the user object to check
 * for access levels
 * @param user
 * @returns {*}
 */
const userToCheck = user => {
  return (user.parent_user_id) ? user.parent : user;
};