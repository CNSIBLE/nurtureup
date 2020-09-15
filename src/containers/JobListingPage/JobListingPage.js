import React from 'react';
import css from './JobListingPage.css';
import {compose} from 'redux';
import {propTypes} from '../../util/types';
import {
  Footer,
  LayoutSingleColumn,
  LayoutWrapperFooter,
  LayoutWrapperMain,
  LayoutWrapperTopbar,
  Page
} from "../../components";
import {TopbarContainer} from "../index";
import {connect} from "react-redux";
import {isScrollingDisabled, manageDisableScrolling} from "../../ducks/UI.duck";
import {bool, func, string} from "prop-types";
import {injectIntl} from "react-intl";
import {intlShape} from "../../util/reactIntl";
import {ensureCurrentUser, ensureOwnListing} from "../../util/data";
import {JobListingForm} from "../../forms";
import {getJobListingsEntities} from "../../ducks/jobListingsData.duck";
import {
  createJobListing,
  updateJobListing,
  requestAddAvailabilityException,
  requestDeleteAvailabilityException, setAvailabilityPlan
} from "./JobListingPage.duck";
import { types as sdkTypes } from '../../util/sdkLoader';

const {UUID} = sdkTypes;

export const JobListingPageComponent = props => {
  const {
    page,
    currentUser,
    getOwnListing,
    onManageDisableScrolling,
    scrollingDisabled,
    intl,
    onSubmitJobListing,
    saveJobListingError,
    updateInProgress,
    id,
    onDeleteAvailabilityException,
    onAddAvailabilityException,
    newListingPublished,
    onUpdateJobListing,
    onUpdateAvailabilityPlan,
    updatedPlan,
  } = props;

  const {
    addExceptionError = null,
    deleteExceptionError = null,
    showListingError = null,
    fetchExceptionsError = null,
    updateListingError = null,
  } = page;

  const errors = {
    addExceptionError,
    deleteExceptionError,
    showListingError,
    fetchExceptionsError,
    updateListingError,
  };

  const user = ensureCurrentUser(currentUser);
  const {profile} = user.attributes || {};
  const {isGiver} = profile.metadata || {};

  const listingId = page.submittedListingId || (id != null ? new UUID(id) : null);
  const listing = getOwnListing(listingId);
  const isNewJobListing = (listing == null);

  const currentListing = ensureOwnListing(listing);
  const attributes = currentListing.attributes || {}
  const {title, description, availabilityPlan, publicData} = attributes || {};
  const {zip, preferences, experience, educationLevel, serviceType} = publicData || {};

  const initValues = {
    title: title,
    serviceType: serviceType,
    description: description,
    zip: zip,
    preferences: preferences,
    experience: experience || 0,
    educationLevel: educationLevel,
  }

  const currentValues = {
    currentTitle: initValues.title,
    currentServiceType: initValues.serviceType,
    currentDescription: initValues.description,
    currentZip: initValues.zip,
    currentPreferences: initValues.preferences,
    currentExperience: initValues.experience,
    currentEducationLevel: initValues.educationLevel,
    currentAvailabilityPlan: availabilityPlan,
  }

  const handleSubmit = values => {
    if(isNewJobListing) {
      return onSubmitJobListing({...values, ...currentValues});
    } else {
      return onUpdateJobListing({...values, ...currentValues});
    }
  };

  const jobListingForm = user.id && isGiver === false ? (
    <JobListingForm
      className={css.form}
      initialValues={initValues}
      updatedPlan={updatedPlan}
      onUpdateAvailabilityPlan={onUpdateAvailabilityPlan}
      onSubmit={handleSubmit}
      saveJobListingError={saveJobListingError}
      updateInProgress={updateInProgress}
      onManageDisableScrolling={onManageDisableScrolling}
      onDeleteAvailabilityException={onDeleteAvailabilityException}
      onAddAvailabilityException={onAddAvailabilityException}
      fetchExceptionsInProgress={page.fetchExceptionsInProgress}
      ready={newListingPublished}

      //errors={errors}
    />
  ) : null;

  const pageTitle = intl.formatMessage({id: 'JobListingPage.title'});

  return (
    <Page title={pageTitle} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />

          <div className={css.heroContainer}>
            <div className={css.hero}/>
          </div>
        </LayoutWrapperTopbar>

        <LayoutWrapperMain>
          <div className={css.content}>
            <h1>{pageTitle}</h1>
            {jobListingForm}
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>

      </LayoutSingleColumn>
    </Page>
  )
}

JobListingPageComponent.defaultProps = {
  currentUser: null,
  id: null,
}

JobListingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  intl: intlShape.isRequired,
  currentUser: propTypes.currentUser,
  getOwnListing: func.isRequired,
  onSubmitJobListing: func.isRequired,
  saveJobListingError: propTypes.error,
  updateInProgress: bool.isRequired,
  onManageDisableScrolling: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onAddAvailabilityException: func.isRequired,
  newListingPublished: bool.isRequired,
  onUpdateJobListing: func.isRequired,
  id: string,
}

const mapStateToProps = state => {
  const page = state.JobListingPage;

  const {
    currentUser,
  } = state.user;

  const {
    saveJobListingError,
    updateInProgress,
    newListingPublished,
    updatedPlan,
  } = state.JobListingPage;

  const getOwnListing = id => {
    const listings = getJobListingsEntities(state, [{ id, type: 'ownListing' }]);

    return listings.length === 1 ? listings[0] : null;
  };

  return {
    page,
    currentUser,
    getOwnListing,
    scrollingDisabled: isScrollingDisabled(state),
    saveJobListingError,
    updateInProgress,
    newListingPublished,
    updatedPlan,
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmitJobListing: values => dispatch(createJobListing(values)),
  onUpdateJobListing: values => dispatch(updateJobListing(values)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onDeleteAvailabilityException: params => dispatch(requestDeleteAvailabilityException(params)),
  onAddAvailabilityException: params => dispatch(requestAddAvailabilityException(params)),
  onUpdateAvailabilityPlan: plan => dispatch(setAvailabilityPlan(plan)),
});

const  JobListingPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  injectIntl
)(JobListingPageComponent);

export default JobListingPage;
