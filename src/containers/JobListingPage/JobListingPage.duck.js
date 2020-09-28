import {denormalisedResponseEntities} from '../../util/data';
import {storableError} from '../../util/errors';
import {fetchCurrentUser} from "../../ducks/user.duck";
import {addJobListingsEntities} from "../../ducks/jobListingsData.duck";
import pick from "lodash/pick";
import {types as sdkTypes} from "../../util/sdkLoader";
import * as log from '../../util/log';

const { UUID } = sdkTypes;
const requestAction = actionType => params => ({ type: actionType, payload: { params } });
const successAction = actionType => result => ({ type: actionType, payload: result.data });
const errorAction = actionType => error => ({ type: actionType, payload: error, error: true });

// ================ Action types ================ //
export const SET_INITIAL_VALUES = 'app/JobListingPage/SET_INITIAL_VALUES';
export const SHOW_JOB_LISTING_ERROR = 'app/JobListingPage/SHOW_JOB_LISTING_ERROR';
export const SHOW_JOB_LISTING_REQUEST = 'app/JobListingPage/SHOW_JOB_LISTING_REQUEST';
export const CREATE_JOB_LISTING_SUCCESS = 'app/JobListingPage/CREATE_JOB_LISTING_SUCCESS';
export const UPDATE_LISTING_SUCCESS = 'app/JobListingPage/UPDATE_LISTING_SUCCESS';
export const UPDATE_LISTING_ERROR = 'app/JobListingPage/UPDATE_LISTING_ERROR';
export const UPDATE_JOB_LISTING = 'app/JobListingPage/UPDATE_JOB_LISTING';
export const DELETE_EXCEPTION = 'app/JobListingPage/DELETE_AVAILABILITY_EXCEPTION';
export const ADD_EXCEPTION = 'app/JobListingPage/ADD_AVAILABILITY_EXCEPTION';
export const FETCH_EXCEPTIONS_REQUEST = 'app/JobListingPage/FETCH_AVAILABILITY_EXCEPTIONS_REQUEST';
export const FETCH_EXCEPTIONS_SUCCESS = 'app/JobListingPage/FETCH_AVAILABILITY_EXCEPTIONS_SUCCESS';
export const FETCH_EXCEPTIONS_ERROR = 'app/JobListingPage/FETCH_AVAILABILITY_EXCEPTIONS_ERROR';
export const SET_AVAILABILITY_PLAN = 'app/JobListingPage/SET_AVAILABILITY_PLAN';

// ================ Reducer ================ //
const initialState = {
  id: null,
  showListingError: null,
  updateInProgress: false,
  listingId: null,
  listing: null,
  updateListingError: null,
  updatedPlan: {},
  availabilityExceptions: [],
  addExceptionError: null,
  addExceptionInProgress: false,
  deleteExceptionError: null,
  deleteExceptionInProgress: false,
  fetchExceptionsError: null,
  fetchExceptionsInProgress: false,
  newListingPublished: false,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };
    case SET_AVAILABILITY_PLAN:
      return {...initialState, updatedPlan: payload};
    case CREATE_JOB_LISTING_SUCCESS:
      return {...state,
        saveJobListingInProgress: false,
        newListingPublished: true,
        listingId: payload,
        listing: payload};
    case SHOW_JOB_LISTING_ERROR:
      return { ...state, showListingError: payload };
    case UPDATE_JOB_LISTING:
      return {...state, updateInProgress: true, updateListingError: null}
    case UPDATE_LISTING_SUCCESS:
      return { ...state, updateInProgress: false };
    case UPDATE_LISTING_ERROR:
      return { ...state, updateInProgress: false, updateListingError: payload };
    case ADD_EXCEPTION:
      return {
        ...state,
        availabilityExceptions: [...state.availabilityExceptions, payload],
        addExceptionInProgress: false,
      };
    case DELETE_EXCEPTION: {
      const deletedExceptionId = payload.id;
      const availabilityExceptions = state.availabilityExceptions.filter(
        e => e.listingId.uuid !== deletedExceptionId.uuid
      );
      return {
        ...state,
        availabilityExceptions,
        deleteExceptionInProgress: false,
      };
    }
    case FETCH_EXCEPTIONS_REQUEST:
      return {
        ...state,
        availabilityExceptions: [],
        fetchExceptionsError: null,
        fetchExceptionsInProgress: true,
      };
    case FETCH_EXCEPTIONS_SUCCESS:
      return {
        ...state,
        availabilityExceptions: payload,
        fetchExceptionsError: null,
        fetchExceptionsInProgress: false,
      };
    case FETCH_EXCEPTIONS_ERROR:
      return {
        ...state,
        fetchExceptionsError: payload.error,
        fetchExceptionsInProgress: false,
      };

    default:
      return state;
  }
};

// ================ Action creators ================ //

export const createJobListingSuccess = successAction(CREATE_JOB_LISTING_SUCCESS);
export const updateListingError = errorAction(UPDATE_LISTING_ERROR);
export const updateJobListingRequest = () => ({type: UPDATE_JOB_LISTING})

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

export const setAvailabilityPlan = plan => ({
  type: SET_AVAILABILITY_PLAN,
  payload: plan,
})

export const showJobListingRequest = id => ({
  type: SHOW_JOB_LISTING_REQUEST,
  payload: { id },
});

export const showJobListingError = e => ({
  type: SHOW_JOB_LISTING_ERROR,
  error: true,
  payload: e,
});

export const addAvailabilityException = e => ({
  type: ADD_EXCEPTION,
  payload: e,
});

export const deleteAvailabilityException = e => ({
  type: DELETE_EXCEPTION,
  payload: e,
});

// SDK method: availabilityExceptions.create
// export const addAvailabilityExceptionSuccess = successAction(ADD_EXCEPTION_SUCCESS);
// export const addAvailabilityExceptionError = errorAction(ADD_EXCEPTION_ERROR);

// SDK method: availabilityExceptions.delete
// export const deleteAvailabilityExceptionSuccess = successAction(DELETE_EXCEPTION_SUCCESS);
// export const deleteAvailabilityExceptionError = errorAction(DELETE_EXCEPTION_ERROR);

// SDK method: availabilityExceptions.query
export const fetchAvailabilityExceptionsRequest = requestAction(FETCH_EXCEPTIONS_REQUEST);
export const fetchAvailabilityExceptionsSuccess = successAction(FETCH_EXCEPTIONS_SUCCESS);
export const fetchAvailabilityExceptionsError = errorAction(FETCH_EXCEPTIONS_ERROR);

// ================ Thunks ================ //

export const showJobListing = (listingId, isOwn = false) => (dispatch, getState, sdk) => {
  dispatch(showJobListingRequest(listingId));
  dispatch(fetchCurrentUser());

  const show = isOwn ? sdk.ownListings.show({id: listingId}) : sdk.listings.show({id: listingId});

  return show
    .then(data => {
      dispatch(addJobListingsEntities(data));
      return data;
    })
    .catch(e => {
      dispatch(showJobListingError(storableError(e)));
    });
};

export const updateJobListing = params => (dispatch, getState, sdk) => {
  dispatch(updateJobListingRequest());
  const {
    values,
  } = params;

  let updateResponse;

  return sdk.ownListings.update(values)
    .then(response => {
      updateResponse = response;

      return response;
    }).catch(e => {
      log.error(e, 'update-listing-failed', {listingData: values});
      dispatch(updateListingError(storableError(e)));
      throw e;
    });
};

export const createJobListing = params => (dispatch, getState, sdk) => {
  const {
    title,
    description,
    serviceType,
    zip,
    preferences,
    experience,
    educationLevel
  } = params;

  //save exceptions
  const exceptions = getState().JobListingPage.availabilityExceptions;
  const availabilityPlan = getState().JobListingPage.updatedPlan;
  console.log("after getting state");

  sdk.ownListings.create({
    title: title,
    description: description,
    availabilityPlan: availabilityPlan,
    publicData: {
      serviceType: serviceType,
      zip: zip,
      preferences: preferences,
      experience: experience,
      educationLevel: educationLevel,
      listingType: "job",
    },
  }, {expand: true}
  ).then(response => {
    const entities = denormalisedResponseEntities(response);
    if(entities.length !== 1) {
      throw new Error('Expected a response from the sdk');
    }

    const respId = entities[0].id;
    for(const exception of exceptions) {
      saveAvailabilityException({...exception, listingId: respId});
    }
  });


};

//TODO do we need this function?
export const removeAvailabilityException = params => (dispatch, getState, sdk) => {
  //dispatch(deleteAvailabilityExceptionRequest(params));

  return sdk.availabilityExceptions
    .delete(params, { expand: true })
    .then(response => {
      const availabilityException = response.data.data;
      return availabilityException;
      //return dispatch(deleteAvailabilityExceptionSuccess({ data: availabilityException }));
    })
    .catch(e => {
      //dispatch(deleteAvailabilityExceptionError({ error: storableError(e) }));
      throw e;
    });
};

export const saveAvailabilityException = params => (dispatch, getState, sdk) => {
  return sdk.availabilityExceptions
    .create(params, { expand: true })
    .then(response => {
      const availabilityException = response.data.data;
      return availabilityException;
      //return dispatch(addAvailabilityExceptionSuccess({ data: availabilityException }));
    })
    .catch(e => {
      //dispatch(addAvailabilityExceptionError({ error: storableError(e) }));
      throw e;
    });
};

export const requestFetchAvailabilityExceptions = fetchParams => (dispatch, getState, sdk) => {
  dispatch(fetchAvailabilityExceptionsRequest(fetchParams));

  return sdk.availabilityExceptions
    .query(fetchParams, { expand: true })
    .then(response => {
      const availabilityExceptions = denormalisedResponseEntities(response);
      return dispatch(fetchAvailabilityExceptionsSuccess({ data: availabilityExceptions }));
    })
    .catch(e => {
      return dispatch(fetchAvailabilityExceptionsError({ error: storableError(e) }));
    });
};
