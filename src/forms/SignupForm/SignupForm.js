import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';
import * as validators from '../../util/validators';
import {Form, PrimaryButton, FieldTextInput, FieldDateInput} from '../../components';

import css from './SignupForm.css';

// import {
//   nextMonthFn,
//   prevMonthFn,
//   timeOfDayFromLocalToTimeZone,
//   timeOfDayFromTimeZoneToLocal
// } from "../../util/dates";
// import {bookingDateRequired} from "../../util/validators";

const KEY_CODE_ENTER = 13;

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        onOpenTermsOfService,
      } = fieldRenderProps;

      // email
      const emailLabel = intl.formatMessage({
        id: 'SignupForm.emailLabel',
      });
      const emailPlaceholder = intl.formatMessage({
        id: 'SignupForm.emailPlaceholder',
      });
      const emailRequiredMessage = intl.formatMessage({
        id: 'SignupForm.emailRequired',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailInvalidMessage = intl.formatMessage({
        id: 'SignupForm.emailInvalid',
      });
      const emailValid = validators.emailFormatValid(emailInvalidMessage);

      // phone
      const phoneLabel = intl.formatMessage({
        id: 'SignupForm.phoneLabel',
      });
      const phonePlaceholder = intl.formatMessage({
        id: 'SignupForm.phonePlaceholder',
      });
      const phoneRequiredMessage = intl.formatMessage({
        id: 'SignupForm.phoneRequired',
      });
      const phoneRequired = validators.required(phoneRequiredMessage);
      const phoneInvalidMessage = intl.formatMessage({
        id: 'SignupForm.phoneInvalid',
      });
      const phoneValid = validators.phoneFormatValid(phoneInvalidMessage);

      // birth date
      const birthDateLabel = intl.formatMessage({
        id: 'SignupForm.birthDateLabel',
      });
      const birthDatePlaceholder = intl.formatMessage({
        id: 'SignupForm.birthDatePlaceholder',
      });
      const birthDateRequiredMessage = intl.formatMessage({
        id: 'SignupForm.birthDateRequired',
      });
      const birthDateRequired = validators.required(birthDateRequiredMessage);

      // state
      const stateLabel = intl.formatMessage({
        id: 'SignupForm.stateLabel',
      });
      const statePlaceholder = intl.formatMessage({
        id: 'SignupForm.statePlaceholder',
      });
      const stateRequiredMessage = intl.formatMessage({
        id: 'SignupForm.stateRequired',
      });
      const stateRequired = validators.required(stateRequiredMessage);
      const stateInvalidMessage = intl.formatMessage({
        id: 'SignupForm.stateInvalid',
      });
      const stateValid = validators.emailFormatValid(stateInvalidMessage);

      const passwordLabel = intl.formatMessage({
        id: 'SignupForm.passwordLabel',
      });
      const passwordPlaceholder = intl.formatMessage({
        id: 'SignupForm.passwordPlaceholder',
      });
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      // firstName
      const firstNameLabel = intl.formatMessage({
        id: 'SignupForm.firstNameLabel',
      });
      const firstNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.firstNamePlaceholder',
      });
      const firstNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.firstNameRequired',
      });
      const firstNameRequired = validators.required(firstNameRequiredMessage);

      // lastName
      const lastNameLabel = intl.formatMessage({
        id: 'SignupForm.lastNameLabel',
      });
      const lastNamePlaceholder = intl.formatMessage({
        id: 'SignupForm.lastNamePlaceholder',
      });
      const lastNameRequiredMessage = intl.formatMessage({
        id: 'SignupForm.lastNameRequired',
      });
      const lastNameRequired = validators.required(lastNameRequiredMessage);

      // street address 1
      const streetAddress1Label = intl.formatMessage({
        id: 'SignupForm.streetAddress1Label',
      });
      const streetAddress1Placeholder = intl.formatMessage({
        id: 'SignupForm.streetAddress1Placeholder',
      });
      const streetAddress1RequiredMessage = intl.formatMessage({
        id: 'SignupForm.streetAddress1Required',
      });
      const streetAddress1Required = validators.required(streetAddress1RequiredMessage);

      // street address 2
      const streetAddress2Label = intl.formatMessage({
        id: 'SignupForm.streetAddress2Label',
      });
      const streetAddress2Placeholder = intl.formatMessage({
        id: 'SignupForm.streetAddress2Placeholder',
      });


      // city
      const addressCityLabel = intl.formatMessage({
        id: 'SignupForm.addressCityLabel',
      });
      const addressCityPlaceholder = intl.formatMessage({
        id: 'SignupForm.addressCityPlaceholder',
      });
      const addressCityRequiredMessage = intl.formatMessage({
        id: 'SignupForm.addressCityRequired',
      });
      const addressCityRequired = validators.required(addressCityRequiredMessage);

      // zip
      const addressZipLabel = intl.formatMessage({
        id: 'SignupForm.addressZipLabel',
      });
      const addressZipPlaceholder = intl.formatMessage({
        id: 'SignupForm.addressZipPlaceholder',
      });
      const addressZipRequiredMessage = intl.formatMessage({
        id: 'SignupForm.addressCityRequired',
      });
      const addressZipRequired = validators.required(addressZipRequiredMessage);

      const addressZipInvalidMessage = intl.formatMessage({
        id: 'SignupForm.addressZipInvalid',
      });
      const addressZipValid = validators.addressZipFormatValid(addressZipInvalidMessage);

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;

      const handleTermsKeyUp = e => {
        // Allow click action with keyboard like with normal links
        if (e.keyCode === KEY_CODE_ENTER) {
          onOpenTermsOfService();
        }
      };
      const termsLink = (
        <span
          className={css.termsLink}
          onClick={onOpenTermsOfService}
          role="button"
          tabIndex="0"
          onKeyUp={handleTermsKeyUp}
        >
          <FormattedMessage id="SignupForm.termsAndConditionsLinkText" />
        </span>
      );

      return (
        <Form className={classes} onSubmit={handleSubmit}>

            <div className={css.name}>
              <FieldTextInput
                className={css.firstNameRoot}
                type="text"
                id={formId ? `${formId}.fname` : 'fname'}
                name="fname"
                autoComplete="given-name"
                label={firstNameLabel}
                placeholder={firstNamePlaceholder}
                validate={firstNameRequired}
              />
              <FieldTextInput
                className={css.lastNameRoot}
                type="text"
                id={formId ? `${formId}.lname` : 'lname'}
                name="lname"
                autoComplete="family-name"
                label={lastNameLabel}
                placeholder={lastNamePlaceholder}
                validate={lastNameRequired}
              />
            </div>
          <div>
            <FieldTextInput
              type="phone"
              id={formId ? `${formId}.phone` : 'phone'}
              name="phone"
              autoComplete="phone"
              label={phoneLabel}
              placeholder={phonePlaceholder}
              validate={validators.composeValidators(phoneRequired, phoneValid)}
            />
            <FieldTextInput
              type="email"
              id={formId ? `${formId}.email` : 'email'}
              name="email"
              autoComplete="email"
              label={emailLabel}
              placeholder={emailPlaceholder}
              validate={validators.composeValidators(emailRequired, emailValid)}
            />
            <FieldTextInput
              type="text"
              id={formId ? `${formId}.streetAddress1` : 'streetAddress1'}
              name="streetAddress1"
              autoComplete="streetAddress1"
              label={streetAddress1Label}
              placeholder={streetAddress1Placeholder}
              validate={validators.composeValidators(streetAddress1Required)}
            />
            <FieldTextInput
              type="text"
              id={formId ? `${formId}.streetAddress2` : 'streetAddress2'}
              name="streetAddress2"
              autoComplete="streetAddress2"
              label={streetAddress2Label}
              placeholder={streetAddress2Placeholder}
            />
          </div>
          <div>
            <FieldTextInput
              type="text"
              id={formId ? `${formId}.city` : 'city'}
              name="city"
              autoComplete="city"
              label={addressCityLabel}
              placeholder={addressCityPlaceholder}
              validate={validators.composeValidators(addressCityRequired)}
            />
            <FieldTextInput
              id={formId ? `${formId}.state` : 'state'}
              name="state"
              className={css.stateField}
              type="text"
              autoComplete="state"
              label={stateLabel}
              placeholder={statePlaceholder}
            />
            <FieldTextInput
              type="text"
              id={formId ? `${formId}.zip` : 'zip'}
              name="zip"
              autoComplete="zip"
              label={addressZipLabel}
              placeholder={addressZipPlaceholder}
              validate={validators.composeValidators(addressZipRequired, addressZipValid)}
            />
          </div>
          <div>
            {/*<FieldDateInput*/}
            {/*  className={css.fieldDateInput}*/}
            {/*  name="birthDate"*/}
            {/*  id={formId ? `${formId}.birthDate` : 'birthDate'}*/}
            {/*  label={birthDateLabel}*/}
            {/*  placeholderText={birthDatePlaceholder}*/}
            {/*  format={v =>*/}
            {/*    v && v.date ? { date: timeOfDayFromTimeZoneToLocal(v.date) } : v*/}
            {/*  }*/}
            {/*  parse={v =>*/}
            {/*    v && v.date ? { date: timeOfDayFromLocalToTimeZone(v.date) } : v*/}
            {/*  }*/}
            {/*  //isDayBlocked={isDayBlocked}*/}
            {/*  //onChange={this.onBookingStartDateChange}*/}
            {/*  onPrevMonthClick={() => this.onMonthClick(prevMonthFn)}*/}
            {/*  onNextMonthClick={() => this.onMonthClick(nextMonthFn)}*/}
            {/*  //navNext={<Next currentMonth={this.state.currentMonth} timeZone={timeZone} />}*/}
            {/*  //navPrev={<Prev currentMonth={this.state.currentMonth} timeZone={timeZone} />}*/}
            {/*  useMobileMargins*/}
            {/*  showErrorMessage={false}*/}
            {/*  validate={birthDateRequired('Required')}*/}
            {/*/>*/}
          </div>
          <div>
            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.password` : 'password'}
              name="password"
              autoComplete="new-password"
              label={passwordLabel}
              placeholder={passwordPlaceholder}
              validate={passwordValidators}
            />
          </div>

          <div className={css.bottomWrapper}>
            <p className={css.bottomWrapperText}>
              <span className={css.termsText}>
                <FormattedMessage
                  id="SignupForm.termsAndConditionsAcceptText"
                  values={{ termsLink }}
                />
              </span>
            </p>
            <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
              <FormattedMessage id="SignupForm.signUp" />
            </PrimaryButton>
          </div>
        </Form>
      );
    }}
  />
);

SignupFormComponent.defaultProps = { inProgress: false };

const { bool, func } = PropTypes;

SignupFormComponent.propTypes = {
  inProgress: bool,

  onOpenTermsOfService: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SignupForm = compose(injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
