/**
 * Training Pages
 * @param pathBuilder
 * @param params
 * @returns {*}
 */
const baseTrainingPath = '/training';
const trainingPro = '/pro';
const trainingAgency = '/agency';

export const trainingPath = () => baseTrainingPath;
export const trainingRoute = () => baseTrainingPath + '/*';

export const trainingProPath = () => trainingPath() + trainingPro;
export const trainingProRoute = () => trainingPro;

export const trainingAgencyPath = () => trainingPath() + trainingAgency;
export const trainingAgencyRoute = () => trainingAgency;