import merge from 'lodash/merge';
import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess } from '../../ducks/user.duck';

// ================ Action types ================ //

export const SAVE_BACKGROUND_INFO_REQUEST = 'app/ContactDetailsPage/SAVE_BACKGROUND_INFO_REQUEST';
export const SAVE_BACKGROUND_INFO_SUCCESS = 'app/ContactDetailsPage/SAVE_BACKGROUND_INFO_SUCCESS';
export const SAVE_BACKGROUND_INFO_ERROR = 'app/ContactDetailsPage/SAVE_BACKGROUND_INFO_ERROR';
export const SAVE_BACKGROUND_INFO_CLEAR = 'app/ContactDetailsPage/SAVE_BACKGROUND_INFO_CLEAR';

// ================ Reducer ================ //

const initialState = {

  saveBackgroundInfoError: null,
  saveBackgroundInfoInProgress: false,
  contactDetailsChanged: false,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SAVE_BACKGROUND_INFO_REQUEST:
      return {
        ...state,
        saveBackgroundInfoInProgress: true,
        saveBackgroundInfoError: null,
        contactDetailsChanged: false,
      };
    case SAVE_BACKGROUND_INFO_SUCCESS:
      return { ...state, saveBackgroundInfoInProgress: false, contactDetailsChanged: true };
    case SAVE_BACKGROUND_INFO_ERROR:
      return { ...state, saveBackgroundInfoInProgress: false, saveBackgroundInfoError: payload };


    case SAVE_BACKGROUND_INFO_CLEAR:
      return {
        ...state,
        saveBackgroundInfoInProgress: false,
        saveBackgroundInfoError: null,
        contactDetailsChanged: false,
      };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const saveContactDetailsRequest = () => ({ type: SAVE_BACKGROUND_INFO_REQUEST });
export const saveContactDetailsSuccess = () => ({ type: SAVE_BACKGROUND_INFO_SUCCESS });
export const saveBackgroundInfoError = error => ({
  type: SAVE_BACKGROUND_INFO_ERROR,
  payload: error,
  error: true,
});


//export const saveContactDetailsClear = () => ({ type: SAVE_CONTACT_DETAILS_CLEAR });

// ================ Thunks ================ //

/**
 * Make a phone number update request to the API and return the current user.
 */
export const requestSaveBackgroundInfo = params => (dispatch, getState, sdk) => {

  const firstName = params.firstName;
  const lastName = params.lastName;
  const middleName = params.middleName;
  const noMiddleName = params.noMiddleName;
  const dateOfBirth = params.dateOfBirth;
  const ssn =  params.ssn;
  const zip = params.zip;
  const licenseNumber = params.licenseNumber;
  const licenseState =  params.licenseState;

 // window.alert('In BD duck, ssn =' + JSON.stringify(params));
  return sdk.currentUser
    .updateProfile(
      { privateData: { firstName, lastName, middleName, noMiddleName, dateOfBirth, ssn, zip, licenseNumber, licenseState } },
      {
        expand: true,
        include: ['profileImage'],
        'fields.image': ['variants.square-small', 'variants.square-small2x'],
      }
    )
    .then(response => {
      const entities = denormalisedResponseEntities(response);
      if (entities.length !== 1) {
        throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
      }

      const currentUser = entities[0];
      return currentUser;
    })
    .catch(e => {
      dispatch(saveBackgroundInfoError(storableError(e)));
      // pass the same error so that the SAVE_CONTACT_DETAILS_SUCCESS
      // action will not be fired
      throw e;
    });
};


/**
 * Update contact details, actions depend on which data has changed
 */
export const saveContactDetails = params => (dispatch, getState, sdk) => {
  dispatch(saveContactDetailsRequest());

  const { email, currentEmail, phoneNumber, currentPhoneNumber, currentPassword } = params;
  const emailChanged = email !== currentEmail;
  const phoneNumberChanged = phoneNumber !== currentPhoneNumber;


};
