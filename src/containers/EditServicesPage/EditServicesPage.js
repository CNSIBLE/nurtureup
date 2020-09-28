import React, {useState} from "react";
import {compose} from 'redux';
import {connect} from 'react-redux';
import {propTypes} from "../../util/types";
import {bool, string} from 'prop-types';
import {isScrollingDisabled, manageDisableScrolling} from "../../ducks/UI.duck";
import {injectIntl} from "react-intl";
import {
  Page,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer, NurtureUpButton,
} from '../../components';
import {TopbarContainer} from "../../containers";
import css from "./EditServicesPage.css";
import {FormattedMessage, intlShape} from "../../util/reactIntl";
import {ServiceForm} from "../../forms";
import uuid from "react-uuid";
import {types as sdkTypes} from "../../util/sdkLoader";
import {
  clearForm,
  addAvailabilityException,
  deleteAvailabilityException,
  setAvailabilityPlan, createServiceListing
} from "./EditServicesPage.duck";
import {ensureCurrentUser, ensureOwnListing} from "../../util/data";
import {getJobListingsEntities} from "../../ducks/jobListingsData.duck";
import {SERVICE_TYPES} from "../../util/NurtureUpLists";

const {UUID} = sdkTypes;

export const EditServicesPageComponent = props => {
  const {
    intl,
    scrollingDisabled,
    onManageDisableScrolling,
    onDeleteAvailabilityException,
    onAddAvailabilityException,
    onUpdateAvailabilityPlan,
    updatedPlan,
    availabilityExceptions,
    page,
    updateInProgress,
    id,
    currentUser,
    clearForm,
    getOwnListing,
    onSubmitServiceListing,
  } = props;

  const [showForm, setShowForm] = useState(false);
  const title = intl.formatMessage({id: 'EditServicesPage.title'});

  const {
    addExceptionError = null,
    deleteExceptionError = null,
    fetchExceptionsError = null,
    updateListingError = null,
  } = page;

  const errors = {
    addExceptionError,
    deleteExceptionError,
    fetchExceptionsError,
    updateListingError,
  };

  const user = ensureCurrentUser(currentUser);
  const {profile} = user.attributes || {};
  const {protectedData, publicData: userPublicData} = profile || {};
  const {zip} = protectedData || {};
  const {preferences, experience, educationLevel} = userPublicData || {};

  const listingId = page.submittedListingId || (id != null ? new UUID(id) : new UUID(uuid()));
  const listing = getOwnListing(listingId);
  const isNewServiceListing = (listing == null);

  const currentListing = ensureOwnListing(listing);
  const attributes = currentListing.attributes || {}
  const {availabilityPlan, publicData} = attributes || {};
  const {serviceType, travelRadius} = publicData || {};

  const initValues = {
    serviceType: serviceType,
  }

  const currentValues = {
    currentServiceType: initValues.serviceType,
    currentAvailabilityPlan: availabilityPlan,
  }

  const onCancel = () => {
    setShowForm(false);
    clearForm();
  }

  const onSubmit = values => {
    const title = SERVICE_TYPES[values.serviceType].label;
    onSubmitServiceListing({
      ...values, title: title, zip: zip, preferences: preferences, experience: experience,
      educationLevel: educationLevel, travelRadius: travelRadius
    });
    console.log("Service Submitted");
    setShowForm(false);
    clearForm();
  }

  const listSection = (
    <div className={css.listSection}>
      <NurtureUpButton onClick={() => setShowForm(true)}>
        <FormattedMessage id="EditServicesPage.addService"/>
      </NurtureUpButton>
    </div>
  );

  const formSection = (
    <div className={css.serviceFormSection}>
      <ServiceForm
        onCancel={onCancel}
        onSubmit={values => onSubmit(values)}
        onDeleteAvailabilityException={onDeleteAvailabilityException}
        onAddAvailabilityException={onAddAvailabilityException}
        onUpdateAvailabilityPlan={onUpdateAvailabilityPlan}
        updatedPlan={updatedPlan}
        availabilityExceptions={availabilityExceptions}
        fetchExceptionsInProgress={page.fetchExceptionsInProgress}
        onManageDisableScrolling={onManageDisableScrolling}
        updateInProgress={updateInProgress}
        listingId={listingId}
      />
    </div>
  );

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer
            currentPage="EditServicesPage"
            desktopClassName={css.desktopTopbar}
            mobileClassName={css.mobileTopbar}
          />
          <div className={css.heroContainer}>
            <div className={css.heroContent}/>
          </div>
        </LayoutWrapperTopbar>

        <LayoutWrapperAccountSettingsSideNav currentTab="EditServicesPage"/>

        <LayoutWrapperMain>
          <div className={css.content}>
            {showForm ? formSection : listSection}
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer/>
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

EditServicesPageComponent.defaultProps = {
  id: null,
}

EditServicesPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  id: string,

  // from injectIntl
  intl: intlShape.isRequired,
}

const mapStateToProps = state => {
  const page = state.EditServicesPage;

  const {
    currentUser,
  } = state.user;

  const {
    updatedPlan,
    availabilityExceptions,
    updateInProgress,
  } = state.EditServicesPage;

  const getOwnListing = id => {
    const listings = getJobListingsEntities(state, [{id, type: 'ownListing'}]);

    return listings.length === 1 ? listings[0] : null;
  };

  return {
    scrollingDisabled: isScrollingDisabled(state),
    updatedPlan,
    updateInProgress,
    availabilityExceptions,
    page,
    getOwnListing,
    currentUser,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onDeleteAvailabilityException: params => dispatch(deleteAvailabilityException(params)),
  onAddAvailabilityException: params => dispatch(addAvailabilityException(params)),
  onUpdateAvailabilityPlan: plan => dispatch(setAvailabilityPlan(plan)),
  clearForm: () => dispatch(clearForm()),
  onSubmitServiceListing: params => dispatch(createServiceListing(params)),
})

const EditServicesPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EditServicesPageComponent);

export default EditServicesPage;
