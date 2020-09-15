import React, {Component} from "react";
import {compose} from 'redux';
import {propTypes} from "../../util/types";
import {bool, func, string, arrayOf, shape, object} from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import css from './JobListingForm.css';
import {FormattedMessage, injectIntl} from "react-intl";
import {intlShape} from "../../util/reactIntl";
import {ensureCurrentUser, ensureListing} from "../../util/data";
import {EDUCATION_LEVELS, PREFERENCES, SERVICE_TYPES} from './JobListingLists';
import {
  EditListingAvailabilityPanel,
  FieldCheckboxGroup,
  FieldRangeSlider, FieldSelect,
  FieldTextInput,
  Form,
  PrimaryButton
} from "../../components";
import isEqual from "lodash/isEqual";
import classNames from "classnames";
import * as validators from "../../util/validators";
import arrayMutators from 'final-form-arrays';

class JobListingFormComponent extends Component {
  constructor(props) {
    super(props);
    this.submittedValues = {};
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{...arrayMutators}}
        render={fieldRenderProps => {
          const {
            rootClassName,
            className,
            intl,
            handleSubmit,
            formId,
            currentListing,
            values,
            inProgress,
            errors,
            updateInProgress,
            onManageDisableScrolling,
            ready: newListingPublished,
            fetchExceptionsInProgress,
            availabilityExceptions,
            onAddAvailabilityException,
            onDeleteAvailabilityException,
            onUpdateAvailabilityPlan,
            updatedPlan
          } = fieldRenderProps;

          let {
            title,
            description,
            serviceType,
            zip,
            preferences,
            experience,
            educationLevel,
          } = values;

          const listing = ensureListing(currentListing);
          const attributes = listing.attributes || {}
          const {
            title: currentTitle,
            description: currentDescription,
            availabilityPlan: currentAvailabilityPlan,
            publicData,
          } = attributes || {};
          const {
            zip: currentZip,
            preferences: currentPreferences,
            experience: currentExperience,
            educationLevel: currentEducationLevel,
            serviceType: currentServiceType,
          } = publicData || {};

          //Title
          const titleChanged = currentTitle !== title;
          const titleLabel = intl.formatMessage({id: 'JobListingForm.titleLabel'});
          const titlePlaceholder = intl.formatMessage({id: 'JobListingForm.titlePlaceholder'});

          //Job Description
          const jobDescriptionChanged = currentDescription !== description;
          const jobDescriptionLabel = intl.formatMessage({id: 'JobListingForm.jobDescriptionLabel'});
          const jobDescriptionPlaceholder = intl.formatMessage({id: 'JobListingForm.jobDescriptionPlaceholder'});

          //Zip
          const zipChanged = currentZip !== zip;
          const zipLabel = intl.formatMessage({id: 'JobListingForm.zipLabel'});
          const zipPlaceholder = intl.formatMessage({id: 'JobListingForm.zipPlaceholder'});
          const zipInvalidMessage = intl.formatMessage({id: 'SignupForm.addressZipInvalid'});
          const zipValid = validators.addressZipFormatValid(zipInvalidMessage);

          //Preferences
          const preferencesChanged = currentPreferences !== preferences;
          const preferencesLabel = intl.formatMessage({id: 'JobListingForm.preferencesLabel'});

          //Experience
          const experienceChanged = currentExperience !== experience;
          const experienceLabel = intl.formatMessage({id: 'JobListingForm.experienceLabel'});

          //Education Level
          const educationLevelChanged = currentEducationLevel !== educationLevel;
          const educationLevelLabel = intl.formatMessage({id: 'JobListingForm.educationLabel'});
          const educationLevelPlaceholder = intl.formatMessage({id: 'JobListingForm.educationPlaceholder'});

          //Service Type
          const serviceTypeChanged = currentServiceType !== serviceType;
          const serviceTypeLabel = intl.formatMessage({id: 'JobListingForm.serviceTypeLabel'});
          const serviceTypePlaceholder = intl.formatMessage({id: 'JobListingForm.serviceTypePlaceholder'});

          // Availability
          const availabilityChanged = currentAvailabilityPlan !== updatedPlan;

          const handleAvailabilitySubmit = values => {
            onUpdateAvailabilityPlan(values.availabilityPlan);
          }

          const availability = (
            <EditListingAvailabilityPanel
              listing={listing}
              availPlan={updatedPlan}
              errors={errors}
              updateInProgress={updateInProgress}
              ready={newListingPublished}
              onManageDisableScrolling={onManageDisableScrolling}
              fetchExceptionsInProgress={fetchExceptionsInProgress}
              availabilityExceptions={availabilityExceptions}
              onAddAvailabilityException={onAddAvailabilityException}
              onDeleteAvailabilityException={onDeleteAvailabilityException}
              submitButtonText="Save Availability"
              onSubmit={handleAvailabilitySubmit}
            />
          );

          const classes = classNames(rootClassName || css.root, className);
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled = pristineSinceLastSubmit || inProgress ||
            !(titleChanged || jobDescriptionChanged || zipChanged || preferencesChanged || experienceChanged
              || educationLevelChanged || serviceTypeChanged || availabilityChanged);

          const onSelectFieldChange = (value, fieldName, props) => {
            const {form} = props;
            form.change(fieldName, value);
          }

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = {...values, availabilityPlan: updatedPlan};
                handleSubmit(e);
              }}
            >
              <FieldTextInput
                className={css.title}
                id={`${formId}.title`}
                type="text"
                name="title"
                label={titleLabel}
                placeholder={titlePlaceholder}
              />

              <FieldTextInput
                className={css.descriptionInput}
                type="textarea"
                rows='5'
                id={formId ? `${formId}.description` : 'description'}
                name="description"
                label={jobDescriptionLabel}
                placeholder={jobDescriptionPlaceholder}
              />

              <div className={css.belowDescrSection}>
                <FieldSelect
                  id="serviceType"
                  name={`${formId}.serviceType`}
                  label={serviceTypeLabel}
                  value={serviceType}
                  onChange={value => onSelectFieldChange(value, 'serviceType', fieldRenderProps)}
                >
                  <option disabled value="">
                    {serviceTypePlaceholder}
                  </option>
                  {SERVICE_TYPES.map(p => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </FieldSelect>

                <FieldTextInput
                  className={css.zip}
                  type="text"
                  id={formId ? `${formId}.zip` : 'zip'}
                  name="zip"
                  autoComplete="postal-code"
                  label={zipLabel}
                  placeholder={zipPlaceholder}
                  validate={validators.composeValidators(zipValid)}
                />
              </div>

              <FieldCheckboxGroup
                name="preferences"
                id={`${formId}.preferences`}
                label={preferencesLabel}
                twoColumns={true}
                options={PREFERENCES}
              />

              <div className={css.belowPrefsSection}>
                <FieldRangeSlider
                  id={`${formId}.experience`}
                  name="experience"
                  label={experienceLabel}
                  min={0}
                  max={100}
                  step={1}
                  handles={[experience]}
                />

                <FieldSelect
                  id="educationLevel"
                  name={`${formId}.educationLevel`}
                  label={educationLevelLabel}
                  value={educationLevel}
                  onChange={value => onSelectFieldChange(value, 'education', fieldRenderProps)}
                >
                  <option disabled value="">
                    {educationLevelPlaceholder}
                  </option>
                  {EDUCATION_LEVELS.map(p => (
                    <option key={p.level} value={p.level}>
                      {p.label}
                    </option>
                  ))}
                </FieldSelect>
              </div>

              {availability}

              <div className={css.bottomWrapper}>
                <PrimaryButton
                  type="submit"
                  inProgress={inProgress}
                  ready={pristineSinceLastSubmit}
                  disabled={submitDisabled}
                >
                  <FormattedMessage id="JobListingForm.submitJobListing"/>
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  };
}

JobListingFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  formId: null,
  inProgress: false,
  availabilityExceptions: [],
  updatedPlan: {},
};

JobListingFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
  formId: string,
  inProgress: bool,
  updatedPlan: object,

  availabilityExceptions: arrayOf(propTypes.availabilityException),
  fetchExceptionsInProgress: bool.isRequired,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onUpdateAvailabilityPlan: func.isRequired,

  errors: shape({
    addExceptionError: object,
    deleteExceptionError: object,
    showListingError: object,
    fetchExceptionsError: object,
    updateListingError: object,
  }).isRequired,
  updateInProgress: bool.isRequired,
  ready: bool.isRequired,
};

const JobListingForm = compose(
  injectIntl
)(JobListingFormComponent);

export default JobListingForm;
