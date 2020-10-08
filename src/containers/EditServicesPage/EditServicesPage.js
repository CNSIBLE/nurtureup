import React, {useState} from "react";
import {compose} from 'redux';
import {connect} from 'react-redux';
import {propTypes} from "../../util/types";
import {bool, string, func} from 'prop-types';
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
  setAvailabilityPlan,
  createServiceListing,
  getListings
} from "./EditServicesPage.duck";
import {ensureCurrentUser} from "../../util/data";
import {SERVICE_TYPES} from "../../util/NurtureUpLists";
import { formatMoney } from '../../util/currency';

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
    currentUser,
    clearForm,
    onSubmitServiceListing,
    services,
  } = props;

  const [showForm, setShowForm] = useState(false);
  const [selectedServiceListing, setSelectedServiceListing] = useState({});
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
  const {protectedData, publicData} = profile || {};
  const {zip} = protectedData || {};
  const {preferences, experience, educationLevel, travelRadius} = publicData || {};

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
  };

  const onServiceClick = service => {
    console.log("Service " + service.id.uuid + " was clicked");
    setSelectedServiceListing(service);
    onUpdateAvailabilityPlan(service.attributes.availabilityPlan);
    setShowForm(true);
  };

  const listSection = (
    <div className={css.listSection}>
      <div className={css.list}>
        {services.map(service => (
          <div id={service.id.uuid} className={css.service} onClick={() => onServiceClick(service)}>
            {SERVICE_TYPES[service.attributes.publicData.serviceType].icon}
            {service.attributes.title}
            <ul>
              {service.attributes.availabilityPlan.entries.map(entry => (
                <li>
                  {entry.dayOfWeek}: {entry.startTime}-{entry.endTime}
                </li>
              ))}
            </ul>
            {service.attributes.price ? `${formatMoney(intl, service.attributes.price)}` : ''}
          </div>
        ))}
      </div>

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
        currentListing={selectedServiceListing}
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
}

EditServicesPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

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
    services,
  } = state.EditServicesPage;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    updatedPlan,
    updateInProgress,
    availabilityExceptions,
    page,
    currentUser,
    services,
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

EditServicesPage.loadData = getListings;

export default EditServicesPage;
