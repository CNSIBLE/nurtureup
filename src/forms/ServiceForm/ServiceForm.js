import React, {Component} from "react";
import {bool, string, func, arrayOf, shape, object} from 'prop-types';
import {compose} from 'redux';
import {propTypes} from "../../util/types";
import {Form as FinalForm} from 'react-final-form';
import {ensureCurrentUser, ensureListing} from '../../util/data';
import arrayMutators from 'final-form-arrays';
import css from './ServiceForm.css';
import classNames from "classnames";
import {FormattedMessage, injectIntl} from "../../util/reactIntl";

import {
  EditListingAvailabilityPanel, FieldCurrencyInput, FieldDateInput,
  FieldSelect, FieldTextInput,
  Form,
  NurtureUpButton
} from '../../components';
import {SERVICE_TYPES} from "../../util/NurtureUpLists";
import {nextMonthFn, prevMonthFn} from "../../util/dates";
import {bookingDateRequired} from "../../util/validators";
import config from "../../config";
import {types as sdkTypes} from "../../util/sdkLoader";
import uuid from "react-uuid";

const {UUID} = sdkTypes;

class ServiceFormComponent extends Component {
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
            onCancel,
            values,
            handleSubmit,
            formId,
            intl,
            errors,
            updateInProgress,
            onManageDisableScrolling,
            fetchExceptionsInProgress,
            availabilityExceptions,
            onAddAvailabilityException,
            onDeleteAvailabilityException,
            onUpdateAvailabilityPlan,
            updatedPlan,
            currentListing,
          } = fieldRenderProps;

          const listing = ensureListing(currentListing);
          const listingId = listing.id || new UUID(uuid());
          const attributes = listing.attributes || {}
          const {price, publicData, availabilityPlan} = attributes
          let {expirationDate, serviceType} = publicData || {};

          const validDate = expirationDate ? new Date(expirationDate) : {};

          //Service Type
          //const serviceTypeChanged = currentServiceType !== serviceType;
          const serviceTypeLabel = intl.formatMessage({id: 'JobListingForm.serviceTypeLabel'});
          const serviceTypePlaceholder = intl.formatMessage({id: 'JobListingForm.serviceTypePlaceholder'});

          // Availability
          //const availabilityChanged = JSON.stringify(currentAvailabilityPlan) !== JSON.stringify(updatedPlan);

          const handleAvailabilitySubmit = values => {
            onUpdateAvailabilityPlan(values.availabilityPlan);
          }

          const availability = (
            <EditListingAvailabilityPanel
              listing={listing}
              availPlan={updatedPlan}
              errors={errors}
              updateInProgress={updateInProgress}
              onManageDisableScrolling={onManageDisableScrolling}
              fetchExceptionsInProgress={fetchExceptionsInProgress}
              availabilityExceptions={availabilityExceptions}
              onAddAvailabilityException={onAddAvailabilityException}
              onDeleteAvailabilityException={onDeleteAvailabilityException}
              submitButtonText="Save Availability"
              onSubmit={handleAvailabilitySubmit}
              listingId={listingId}
            />
          );

          const onSelectFieldChange = (value, fieldName, props) => {
            const {form} = props;
            form.change(fieldName, value);
          }

          const TODAY = new Date();
          // Date formatting used for placeholder texts:
          const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

          return (
            <Form
              className={css.root}
              onSubmit={e => {
                this.submittedValues = {...values, availabilityPlan: updatedPlan};
                handleSubmit(e);
              }}
            >
              <FieldSelect
                id="serviceType"
                name={`${formId}.serviceType`}
                label={serviceTypeLabel}
                value={serviceType}
                input={{value:serviceType}}
                onChange={value => onSelectFieldChange(value, 'serviceType', fieldRenderProps)}
              >
                <option disabled value="">
                  {serviceTypePlaceholder}
                </option>
                {SERVICE_TYPES.map(p => (
                  <option key={p.key} value={p.key} selected={serviceType === p.key}>
                    {p.label}
                  </option>
                ))}
              </FieldSelect>

              <FieldDateInput
                className={css.fieldDateInput}
                name="expirationDate"
                id={`${formId}.expirationDate`}
                label={intl.formatMessage({
                  id: 'ServiceForm.expirationDateLabel',
                })}
                placeholderText={intl.formatDate(TODAY, dateFormattingOptions)}
                useMobileMargins
                showErrorMessage={false}
                validate={bookingDateRequired('Required')}
                input={{value:{date:validDate}}}
              />

              <FieldCurrencyInput
                id={`${formId}.rate`}
                name="rate"
                className={css.rate}
                label={intl.formatMessage({id: 'ServiceForm.rateLabel'})}
                currencyConfig={config.currencyConfig}
                defaultValue={price}
              />

              {availability}

              <div className={css.buttonGroup}>
                <NurtureUpButton
                  type="submit"
                >
                  <FormattedMessage id="ServiceForm.save"/>
                </NurtureUpButton>
                <NurtureUpButton onClick={onCancel}>
                  <FormattedMessage id="ServiceForm.cancel"/>
                </NurtureUpButton>
              </div>
            </Form>
          );
        }}
      />
    );
  };
}

ServiceFormComponent.defaultProps = {
  formId: null,
  inProgress: false,
  availabilityExceptions: [],
  updatedPlan: {},
}

ServiceFormComponent.propTypes = {
  formId: string,
  onCancel: func.isRequired,

  availabilityExceptions: arrayOf(propTypes.availabilityException),
  fetchExceptionsInProgress: bool.isRequired,
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onUpdateAvailabilityPlan: func.isRequired,
  updatedPlan: object,

  errors: shape({
    addExceptionError: object,
    deleteExceptionError: object,
    showListingError: object,
    fetchExceptionsError: object,
    updateListingError: object,
  }).isRequired,
  updateInProgress: bool.isRequired,
  listingId: object.isRequired,
};

const ServiceForm = compose(injectIntl)(ServiceFormComponent);

ServiceForm.displayName = 'ServiceForm';

export default ServiceForm;

