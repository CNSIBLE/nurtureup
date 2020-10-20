import React, {Component, useState} from "react";
import {bool, string, func, arrayOf, shape, object} from 'prop-types';
import {compose} from 'redux';
import {propTypes} from "../../util/types";
import {Form as FinalForm} from 'react-final-form';
import {ensureCurrentUser, ensureListing} from '../../util/data';
import arrayMutators from 'final-form-arrays';
import css from './ServiceForm.css';
import {FormattedMessage, injectIntl} from "../../util/reactIntl";

import {
  EditListingAvailabilityPanel,
  FieldCurrencyInput,
  FieldDateInput,
  FieldSelect,
  Form,
  PrimaryButton
} from '../../components';
import {SERVICE_TYPES} from "../../util/NurtureUpLists";
import {bookingDateRequired, expirationDateRequired} from "../../util/validators";
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
            listingId,
          } = fieldRenderProps;

          const listing = ensureListing(currentListing);

          const attributes = listing.attributes || {}
          const {price, publicData, availabilityPlan} = attributes
          const {expirationDate, serviceType:servType} = publicData || {};

          const [serviceType, setServiceType] = useState(servType);
          const [validDate, setValidDate] = useState(expirationDate ? new Date(expirationDate) : null)

          //Service Type
          //const serviceTypeChanged = currentServiceType !== serviceType;
          const serviceTypeLabel = intl.formatMessage({id: 'JobListingForm.serviceTypeLabel'});
          const serviceTypePlaceholder = intl.formatMessage({id: 'JobListingForm.serviceTypePlaceholder'});

          // Availability
          //const availabilityChanged = JSON.stringify(currentAvailabilityPlan) !== JSON.stringify(updatedPlan);

          // Expiration Date
          const expirationDateLabel = intl.formatMessage({id: 'ServiceForm.expirationDateLabel'});

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

          const onServiceTypeChange = (value, props) => {
            const {form} = props;
            form.change('serviceType', value);
            setServiceType(value);
          }

          const onExpirationDateChange = (value, props) => {
            const {form} = props;
            form.change('expirationDate', value);
            setValidDate(value.date);
          };

          const TODAY = new Date();
          // Date formatting used for placeholder texts:
          const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

          return (
            <Form
              className={css.root}
              onSubmit={handleSubmit}
            >
              <FieldSelect
                id="serviceType"
                name={`${formId}.serviceType`}
                label={serviceTypeLabel}
                value={serviceType}
                defaultValue={serviceType}
                onChange={value => onServiceTypeChange(value, fieldRenderProps)}
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

              <FieldDateInput
                className={css.fieldDateInput}
                id="expirationDate"
                name={`${formId}.expirationDate`}
                label={expirationDateLabel}
                placeholderText={intl.formatDate(TODAY, dateFormattingOptions)}
                useMobileMargins
                showErrorMessage={true}
                validate={expirationDateRequired('Required', validDate)}
                input={{value:{date:validDate}, onChange: () => void(0)}}
                initialDate={validDate}
                onChange={value => onExpirationDateChange(value, fieldRenderProps)}
                onFocus={() => void(0)}
                onBlur={() => void(0)}
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
                <PrimaryButton type="submit">
                  <FormattedMessage id="ServiceForm.save"/>
                </PrimaryButton>
                <PrimaryButton type="button" onClick={onCancel}>
                  <FormattedMessage id="ServiceForm.cancel"/>
                </PrimaryButton>
              </div>
            </Form>
          );
        }}
      />
    );
  };
}

ServiceFormComponent.defaultProps = {
  formId: "",
  inProgress: false,
  availabilityExceptions: [],
  updatedPlan: {},
}

ServiceFormComponent.propTypes = {
  formId: string,
  onCancel: func.isRequired,
  onSubmit: func.isRequired,

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
  listingId:object.isRequired,
};

const ServiceForm = compose(injectIntl)(ServiceFormComponent);

ServiceForm.displayName = 'ServiceForm';

export default ServiceForm;
