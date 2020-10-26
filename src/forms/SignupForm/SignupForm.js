import React, {Component} from 'react';
import PropTypes, {shape} from 'prop-types';
import {compose} from 'redux';
import {FormattedMessage, injectIntl, intlShape} from '../../util/reactIntl';
import {Form as FinalForm} from 'react-final-form';
import classNames from 'classnames';
import * as validators from '../../util/validators';
import PhoneInput, { format, normalize } from "react-phone-input-auto-format";
import { withRouter } from 'react-router-dom';

import css from './SignupForm.css';
import {PaymentMethodsForm} from "../index";
import {ensureCurrentUser} from "../../util/data";
import {isScrollingDisabled, manageDisableScrolling} from "../../ducks/UI.duck";
import {
  chargeProFee,
  createStripeSetupIntent,
  stripeCustomer
} from "../../containers/PaymentMethodsPage/PaymentMethodsPage.duck";
import {handleCardSetup} from "../../ducks/stripe.duck";
import {deletePaymentMethod, savePaymentMethod} from "../../ducks/paymentMethods.duck";
import {connect} from "react-redux";
import FieldTextInput from "../../components/FieldTextInput/FieldTextInput";
import {NamedLink, NamedRedirect, PrimaryButton} from "../../components";
import {authenticationInProgress, signup, updateMetadata} from "../../ducks/Auth.duck";
import {sendVerificationEmail} from "../../ducks/user.duck";
import BackgroundDisclosures from "../../components/BackgroundDisclosures/BackgroundDisclosures";

const KEY_CODE_ENTER = 13;


export class SignupFormComponent extends Component {
  constructor(props) {
    super(props);
    const {history} = this.props;
    console.log(history);
    this.state = {
      showPaymentDiv: false,
      showDisclosures: false,
      lastName: 'tempLast',
      firstName: 'tempFirst',
      middleName: '',
      phone: 'tempPhone',
      email: 'tempEmail',
      address1: '',
      address2: '',
      state: '',
      city: '',
      zip: '',
      password: '',
      ssn: '',
      licenseNumber: '',
      licenseState: '',
      accountType:''
    };
  }

  render() {
    return (
      <FinalForm
        {...this.props}
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
            currentUser,
            onCreateSetupIntent,
            onUpdateUserProfile,
            onChargeProFee,
            onHandleCardSetup,
            onSavePaymentMethod,
            fetchStripeCustomer,
            submitSignup,
          } = fieldRenderProps;


          const setIsSubmitting = false;
          const setCardState = null;

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

          // middleName
          const middleNameLabel = intl.formatMessage({
            id: 'SignupForm.middleNameLabel',
          });
          const middleNamePlaceholder = intl.formatMessage({
            id: 'SignupForm.middleNamePlaceholder',
          });

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

          // ssn
          const ssnLabel = intl.formatMessage({
            id: 'SignupForm.ssnLabel',
          });
          const ssnPlaceholder = intl.formatMessage({
            id: 'SignupForm.ssnPlaceholder',
          });
          const ssnRequiredMessage = intl.formatMessage({
            id: 'SignupForm.ssnRequired',
          });
          const ssnRequired = validators.required(ssnRequiredMessage);

          // drivers license number
          const licenseNumberLabel = intl.formatMessage({
            id: 'SignupForm.licenseNumberLabel',
          });
          const licenseNumberPlaceholder = intl.formatMessage({
            id: 'SignupForm.licenseNumberPlaceholder',
          });
          const licenseNumberRequiredMessage = intl.formatMessage({
            id: 'SignupForm.licenseNumberRequired',
          });
          const licenseNumberRequired = validators.required(licenseNumberRequiredMessage);

          // drivers license state
          const licenseStateLabel = intl.formatMessage({
            id: 'SignupForm.licenseStateLabel',
          });
          const licenseStatePlaceholder = intl.formatMessage({
            id: 'SignupForm.licenseStatePlaceholder',
          });
          const licenseStateRequiredMessage = intl.formatMessage({
            id: 'SignupForm.licenseStateRequired',
          });
          const licenseStateRequired = validators.required(licenseStateRequiredMessage);


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
          <FormattedMessage id="SignupForm.termsAndConditionsLinkText"/>
        </span>
          );


          const getClientSecret = setupIntent => {
            return setupIntent && setupIntent.attributes ? setupIntent.attributes.clientSecret : null;
          };
          const getPaymentParams = (currentUser, formValues) => {
            const {name, addressLine1, addressLine2, postal, state, city, country} = formValues;
            const addressMaybe =
              addressLine1 && postal
                ? {
                  address: {
                    city: city,
                    country: country,
                    line1: addressLine1,
                    line2: addressLine2,
                    postal_code: postal,
                    state: state,
                  },
                }
                : {};
            const billingDetails = {
              name,
              email: ensureCurrentUser(currentUser).attributes.email,
              ...addressMaybe,
            };

            const paymentParams = {
              payment_method_data: {
                billing_details: billingDetails,
              },
            };

            return paymentParams;
          };


          const handleSubmitSignup = values => {

            this.setState({showPaymentDiv: true});
            this.setState({accountType: '2'});

            const params = {
              firstName: this.state.firstName.trim(),
              lastName: this.state.lastName.trim(),
              email: this.state.email.trim(),
              password: this.state.password.trim(),
              phone: this.state.phone.trim(),
              streetAddress1: this.state.address1.trim(),
              streetAddress2: this.state.address2.trim(),
              zip: this.state.zip.trim(),
              city: this.state.city.trim(),
              state: this.state.state.trim(),
              accountType: '2'
            }
            submitSignup(params);

          };

          const handleGiverSignup = values => {

            //this.setState({showDisclosures: true});
            this.setState({showPaymentDiv: true});
            this.setState({accountType: '1'});
            const params = {
              firstName: this.state.firstName.trim(),
              lastName: this.state.lastName.trim(),
              email: this.state.email.trim(),
              password: this.state.password.trim(),
              phone: this.state.phone.trim(),
              streetAddress1: this.state.address1.trim(),
              streetAddress2: this.state.address2.trim(),
              zip: this.state.zip.trim(),
              city: this.state.city.trim(),
              state: this.state.state.trim(),
              accountType: '1'
            }
            submitSignup(params);
          };

          const skipPayment = () => {
            const {history} = this.props;
            const params = {paymentMethodAdded: "false"};

            onUpdateUserProfile(params)
              .then(result => {
                if (this.state.accountType === '1') {
                  console.log('This is a GIVEr, so we need to open disclosures');
                  this.setState({showPaymentDiv: false});
                  this.setState({showDisclosures: true});
                } else {
                  console.log('This is a seeker, so we need to go to dashboard');
                  history.push('/dashboard');
                }
              })
              .catch(error => {
                console.error(error);
                //setIsSubmitting(false);
              });
          };

          const handlePaymentSubmit = (params, values) => {
            //setIsSubmitting = true;
            const ensuredCurrentUser = ensureCurrentUser(currentUser);
            const stripeCustomer = ensuredCurrentUser.stripeCustomer;
            const {stripe, card, formValues} = params;
            console.log(params);
            const {history} = this.props;
            console.log(history);
            //window.alert("stripe = " + JSON.stringify(stripe));
            //window.alert("user = " + JSON.stringify(currentUser));

            onCreateSetupIntent()
              .then(setupIntent => {
                const stripeParams = {
                  stripe,
                  card,
                  setupIntentClientSecret: getClientSecret(setupIntent),
                  paymentParams: getPaymentParams(currentUser, formValues),
                };

                return onHandleCardSetup(stripeParams);
              })
              .then(result => {
                const newPaymentMethod = result.setupIntent.payment_method;
                // Note: stripe.handleCardSetup might return an error inside successful call (200), but those are rejected in thunk functions.

                return onSavePaymentMethod(stripeCustomer, newPaymentMethod);
              })
              .then(() => {
                // Update currentUser entity and its sub entities: stripeCustomer and defaultPaymentMethod
                fetchStripeCustomer();
                //setIsSubmitting(false);
                //setCardState('default');
              })
              .then(() => {
                  return onChargeProFee(stripeCustomer)

              })
              .then(() => {
                console.log('In Dashboard Redirect, accountType = ' + this.state.accountType);
                //const history = fieldRenderProps.history;

                if(this.state.accountType === '1'){
                  console.log('This is a GIVEr, so we need to open disclosures');
                  this.setState({showPaymentDiv: false});
                  this.setState({showDisclosures: true});
                }else {
                  console.log('This is a seeker, so we need to go to dashboard');
                  history.push('/dashboard');
                }

              })
              .catch(error => {
                console.error(error);
                //setIsSubmitting(false);
              });

            // return  <NamedRedirect name="Dashboard"/>;

          };

          const paymentFormDiv = (

            <div>
              <PaymentMethodsForm
                formId="PaymentMethodsForm"
                //onSubmit={handlePaymentSubmit}
                onSubmit={(params, values) => handlePaymentSubmit(params, values)}
              />
              <div className={css.name}>
                <a href="#" onClick={skipPayment}>
                  Skip
                </a>{' '}
              </div>
            </div>
          );

          const backgroundDisclosuresDiv = (
            <div>

              {/*<BackgroundDisclosures email={this.state.email.trim()}*/}
            <BackgroundDisclosures values={this.state}
              />
            </div>
          );

          const showBackgroundDisclosures = values => {
            //window.alert('I made it');
            this.setState({showDisclosures: true});
            this.setState({showPaymentDiv: false});
          };

          const Input = () => {
            return <PhoneInput onChange={handlePhoneChange} />;
          };

          const handleFormatChange = value => {

          };



          const handleNameChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({testName: event.target.value});
          };
          const handleFirstNameChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({firstName: event.target.value});
          };
          const handleMiddleNameChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({middleName: event.target.value});
          };
          const handleLastNameChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({lastName: event.target.value});
          };
          const handlePhoneChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({phone: event.target.value});
          };
          const handleEmailChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({email: event.target.value});
          };
          const handleAddress1Change = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({address1: event.target.value});
          };
          const handleAddress2Change = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({address2: event.target.value});
          };
          const handleCityChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({city: event.target.value});
          };
          const handleStateChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({state: event.target.value});
          };
          const handleZipChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({zip: event.target.value});
          };
          const handlePasswordChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({password: event.target.value});
          };
          const handleSSNChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({ssn: event.target.value});
          };

          const handleLicenseStateChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({licenseState: event.target.value});
          };

          const handleLicenseNumberChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({licenseNumber: event.target.value});
          };
          const handleNoMiddleNameChange = (event) => {
            console.log(event)
            console.log(event.target.value)
            this.setState({licenseNumber: event.target.value});
          };


          const generalInfoDiv = (
            <div>
              <div className={css.name}>
                <FieldTextInput
                  className={css.firstNameRoot}
                  type="text"
                  id={formId ? `${formId}.fname` : 'fname'}
                  name="fname"
                  autoComplete="given-name"
                  label={firstNameLabel}
                  placeholder={firstNamePlaceholder}
                  ref={this.input}
                  value={this.state.lastName}
                  onBlur={handleFirstNameChange}
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
                  value={this.state.lastName}
                  onBlur={handleLastNameChange}
                  validate={lastNameRequired}
                />
              </div>
              <div className={css.phoneEmail}>
                <FieldTextInput
                  className={css.phone}
                  type="phone"
                  id={formId ? `${formId}.phone` : 'phone'}
                  name="phone"
                  autoComplete="phone"
                  label={phoneLabel}
                  placeholder={phonePlaceholder}
                  value={this.state.phone}
                  onBlur={handlePhoneChange}
                  //onChange={handleFormatChange}
                  //validate={validators.composeValidators(phoneRequired, phoneValid)}
                />
                <FieldTextInput
                  className={css.email}
                  type="email"
                  id={formId ? `${formId}.email` : 'email'}
                  name="email"
                  autoComplete="email"
                  label={emailLabel}
                  placeholder={emailPlaceholder}
                  value={this.state.email}
                  onBlur={handleEmailChange}
                  validate={validators.composeValidators(emailRequired, emailValid)}
                />
              </div>
              <div>
                <FieldTextInput
                  className={css.paymentAddressField}
                  type="text"
                  id={formId ? `${formId}.streetAddress1` : 'streetAddress1'}
                  name="streetAddress1"
                  autoComplete="address-line1"
                  label={streetAddress1Label}
                  placeholder={streetAddress1Placeholder}
                  value={this.state.address1}
                  onBlur={handleAddress1Change}
                  validate={validators.composeValidators(streetAddress1Required)}
                />
                <FieldTextInput
                  className={css.paymentAddressField}
                  type="text"
                  id={formId ? `${formId}.streetAddress2` : 'streetAddress2'}
                  name="streetAddress2"
                  autoComplete="address-line2"
                  label={streetAddress2Label}
                  value={this.state.address2}
                  onBlur={handleAddress2Change}
                  placeholder={streetAddress2Placeholder}
                />
              </div>

              <div className={css.cityStateZip}>
                <FieldTextInput
                  className={css.city}
                  type="text"
                  id={formId ? `${formId}.city` : 'city'}
                  name="city"
                  autoComplete="address-level2"
                  label={addressCityLabel}
                  placeholder={addressCityPlaceholder}
                  value={this.state.city}
                  onBlur={handleCityChange}
                  validate={validators.composeValidators(addressCityRequired)}
                />
                <FieldTextInput
                  id={formId ? `${formId}.state` : 'state'}
                  name="state"
                  className={css.state}
                  type="text"
                  autoComplete="address-level1"
                  label={stateLabel}
                  value={this.state.state}
                  onBlur={handleStateChange}
                  placeholder={statePlaceholder}
                />
                <FieldTextInput
                  className={css.zip}
                  type="text"
                  id={formId ? `${formId}.zip` : 'zip'}
                  name="zip"
                  autoComplete="postal-code"
                  label={addressZipLabel}
                  placeholder={addressZipPlaceholder}
                  value={this.state.zip}
                  onBlur={handleZipChange}
                  validate={validators.composeValidators(addressZipRequired, addressZipValid)}
                />
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
                  value={this.state.password}
                  onBlur={handlePasswordChange}
                  validate={passwordValidators}
                />
              </div>

              <div className={css.bottomWrapper}>
                <p className={css.bottomWrapperText}>
              <span className={css.termsText}>
                <FormattedMessage
                  id="SignupForm.termsAndConditionsAcceptText"
                  values={{termsLink}}
                />
              </span>
                </p>

                <div className={css.caregiverSeekerButtons}>
                  <div className={css.seeker}>
                    <PrimaryButton inProgress={false} disabled={submitDisabled}
                                   onClick={handleSubmitSignup}>
                      I am a Care Seeker
                    </PrimaryButton>
                  </div>
                  <div className={css.caregiver}>
                    <PrimaryButton inProgress={false} disabled={submitDisabled}
                                   onClick={handleGiverSignup}>
                      I am a Care Giver
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <div className={css.content}>
              {this.state.showPaymentDiv ? paymentFormDiv : this.state.showDisclosures ? backgroundDisclosuresDiv : generalInfoDiv}
            </div>

          );
        }}
      />
    );
  };
}


SignupFormComponent.defaultProps = {inProgress: false};

const {bool, func} = PropTypes;

SignupFormComponent.propTypes = {
  inProgress: bool,

  onOpenTermsOfService: func.isRequired,
  submitSignup: func.isRequired,
  //sendVerificationEmailInProgress: bool.isRequired,
  //sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,
  // from injectIntl
  intl: intlShape.isRequired,
  history: shape({
    push: func.isRequired
  }).isRequired
};

const mapStateToProps = state => {
  const {isAuthenticated, signupError} = state.Auth;
  const {currentUser, sendVerificationEmailInProgress, sendVerificationEmailError} = state.user;
  return {
    authInProgress: authenticationInProgress(state),
    currentUser,
    isAuthenticated,
    scrollingDisabled: isScrollingDisabled(state),
    signupError,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  };
};
const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  fetchStripeCustomer: () => dispatch(stripeCustomer()),
  onHandleCardSetup: params => dispatch(handleCardSetup(params)),
  onCreateSetupIntent: params => dispatch(createStripeSetupIntent(params)),
  onUpdateUserProfile: params => dispatch(updateMetadata(params)),
  onChargeProFee: params => dispatch(chargeProFee(params)),
  onSavePaymentMethod: (stripeCustomer, newPaymentMethod) =>
    dispatch(savePaymentMethod(stripeCustomer, newPaymentMethod)),
  onDeletePaymentMethod: params => dispatch(deletePaymentMethod(params)),
  submitSignup: params => dispatch(signup(params)),
});

const SignupForm = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),


  injectIntl)(SignupFormComponent);
SignupForm.displayName = 'SignupForm';

export default SignupForm;
