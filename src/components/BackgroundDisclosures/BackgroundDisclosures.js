import React, { Component, useState } from 'react';
import { ReCaptcha } from 'react-recaptcha-google';
import PropTypes, {shape} from 'prop-types';
import classNames from 'classnames';


import css from './BackgroundDisclosures.css';
import {requestSaveBackgroundInfo} from "../../containers/BackgroundDisclosuresPage/BackgroundDisclosuresPage.duck";
import {sendVerificationEmail} from "../../ducks/user.duck";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl} from "../../util/reactIntl";
import {SignupFormComponent} from "../../forms/SignupForm/SignupForm";
import SinglePagePDFViewer from "../Pdf/single-page";
import summaryOfRightsfile from './Summary_of_Rights_Under_FCRA_-_updated.pdf';
import diclosureForBackgroundInvestigation from './Disclosure_Regarding_Background_Investigation__March_2018_NurtureUp.pdf';
import ackAndAuthFile from './Acknowledgement_and_Authorization__March_2018_ NurtureUp.pdf';

import {PrimaryButton} from "..";
import FieldCheckbox from "../FieldCheckbox/FieldCheckbox";
import { Document, Page, pdfjs } from 'react-pdf';
import * as validators from "../../util/validators";
import FieldTextInput from "../FieldTextInput/FieldTextInput";
import {authenticationInProgress} from "../../ducks/Auth.duck";
import {isScrollingDisabled} from "../../ducks/UI.duck";
import { withRouter } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




const CONTENT_PLACEMENT_OFFSET = 0;
const CONTENT_TO_RIGHT = 'right';

const isControlledMenu = (isOpenProp, onToggleActiveProp) => {
  return isOpenProp !== null && onToggleActiveProp !== null;
};




const handleBackgroundInvestigationDisclosure = values => {
  this.setState({showBackgroundInvestigationDisclosure: false});
};


class BackgroundDisclosuresComponent extends Component {


  constructor(props) {
    super(props);
    const {history} = this.props;
    this.state = { isOpen: false,
      ready: false,
      showCollectBackgroundPii: false,
      showConsumerRights: false,
      showBackgroundInvestigationDisclosure: false,
      recaptchaVerified: false,
      fullSignatureEntered: false,
      checked:false,
      biChecked:false,
      authChecked:false,
      firstName:this.props.values.firstName,
      lastName:this.props.values.lastName,
      middleName:'',
      noMiddleName:'',
      dob:'',
      ssn:'',
      zip:this.props.values.zip,
      licenseNumber:'',
      licenseState:this.props.values.state,
      email:this.props.values.email,
      fullNameSignature: ''};
    this.handleConsumerRights = this.handleConsumerRights.bind(this);
    this.handleBackgroundDisclosure = this.handleBackgroundDisclosure.bind(this);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.showBackgroundDisclosures = this.showBackgroundDisclosures.bind(this);
  }
  handleConsumerRights(){
    //window.alert('Close Consumer Rights');
    this.setState({showCollectBackgroundPii: false});
    this.setState({showConsumerRights: false});
    this.setState({showBackgroundInvestigationDisclosure: true});
    this.setState({showAuth: false});
  };
  handleBackgroundDisclosure(){
    //window.alert('Close Consumer Rights');
    this.setState({showCollectBackgroundPii: false});
    this.setState({showConsumerRights: false});
    this.setState({showBackgroundInvestigationDisclosure: false});
    this.setState({showAuth: true});
  };

  showBackgroundDisclosures = values => {
    this.setState({showCollectBackgroundPii: false});
    this.setState({showConsumerRights: true});
    this.setState({showBackgroundInvestigationDisclosure: false});
    this.setState({showAuth: false});
  };



  componentDidMount() {
    if (this.captchaDemo) {
      console.log("started, just a second...")
      this.captchaDemo.reset();
    }
  }
  onLoadRecaptcha() {
    //window.alert('captch check');
    if (this.captchaDemo) {
      this.captchaDemo.reset();
    }
  }
  verifyCallback(recaptchaToken) {
    // Here you will get the final recaptchaToken!!!
    //window.alert(recaptchaToken);
    console.log(recaptchaToken, "<= your recaptcha token");
    this.setState({recaptchaVerified: true});
  }

  render() {
    const { className, rootClassName, requestSaveBackgroundInfo, onSubmitBackgroundDisclosures, invalid, intl, } = this.props;
    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className);
    //const submitInProgress = inProgress;
    const submitDisabled = invalid; //|| submitInProgress;
    const handleAcknowledge = values => {
      this.setState({checked: !this.state.checked});
    };

    const handleBIAcknowledge = values => {
      this.setState({biChecked: !this.state.biChecked});
    };

    const handleAuthorization = values => {
      this.setState({authChecked: !this.state.authChecked});
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
    // const handleEmailChange = (event) => {
    //   console.log(event)
    //   console.log(event.target.value)
    //   this.setState({email: event.target.value});
    // };
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

    const handleFullNameSignature = (event) => {
      console.log(event)
      console.log(event.target.value)
      this.setState({fullNameSignature: event.target.value});
    };

    const handleDobChange = (event) => {
      console.log(event)
      console.log(event.target.value)
      this.setState({dob: event.target.value});
    };

    const handleFinalSubmit = values => {
      const params = {
        // firstName: this.state.firstName.trim(),
        // lastName: this.state.lastName.trim(),
        // middleName:this.state.middleName.trim(),
        // noMiddleName: this.state.noMiddleName.trim(),
        // dateOfBirth: this.state.dob.trim(),
        // ssn: this.state.ssn.trim(),
        // zip: this.state.zip.trim(),
        // licenseNumber: this.state.licenseNumber.trim(),
        // licenseState: this.state.licenseState.trim(),
        // email: this.props.values.email

        firstName: this.state.firstName.trim(),
        lastName: this.props.values.lastName.trim(),
        middleName:this.state.middleName.trim(),
        noMiddleName: this.state.noMiddleName.trim(),
        dateOfBirth: this.state.dob.trim(),
        ssn: this.state.ssn.trim(),
        zip: this.state.zip.trim(),
        licenseNumber: this.state.licenseNumber.trim(),
        licenseState: this.state.licenseState.trim(),
        email: this.state.email.trim()

      }
      const {history} = this.props;
      onSubmitBackgroundDisclosures(params)
        .then(() => {
          history.push('/dashboard');

        })
    }


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

    const backgroundInfoDiv = (
      <div>
        <div>
          <p>NurtureUp has engaged Checkr, Inc. to obtain a consumer report and/or investigative consumer report for employment purposes. Checkr Inc. will provide a background investigation as a pre-condition of your engagement with NurtureUp and in compliance with federal and state employment laws. If you have any questions related to the screening process, plase contact us at applicant.chekr.com</p>
        </div>
        <div className={css.name}>
          <FieldTextInput
            className={css.firstNameBackground}
            type="text"
            id="fname"
            name="fname"
            autoComplete="given-name"
            label="First Name"
            placeholder={this.state.firstName}
            //ref={this.input}
            value={this.state.firstName}
            onBlur={handleFirstNameChange}
            //validate={firstNameRequired}
          />
          <FieldTextInput
            className={css.middleNameBackground}
            type="text"
            id="middleName"
            name="middleName"
            autoComplete="additional-name"
            label="Middle Name"
            placeholder="Middle Name"
            //ref={this.input}
            value={this.state.middleName}
            onBlur={handleMiddleNameChange}
            //validate={firstNameRequired}
          />
          <FieldTextInput
            className={css.lastNameBackground}
            type="text"
            id="lname"
            name="lname"
            autoComplete="family-name"
            label="Last Name"
            placeholder="Smith"
            value={this.state.lastName}
            onBlur={handleLastNameChange}
            //validate={lastNameRequired}
          />
        </div>
        <div className={css.noMiddleName}>
          <FieldCheckbox
            className={css.middleNameBackground}
            id="noMiddleName"
            name="noMiddleName"
            textClassName={css.noMiddleNameText}
            label="I do not have a middle name"
            value="noMiddleName"
            onBlur={handleNoMiddleNameChange}

          />
        </div>
        <div className={css.name}>
          <FieldTextInput
            className={css.dobBackground}
            type="text"
            id="dateOfBirth"
            name="dateOfBirth"
            autoComplete="family-name"
            label="Date of Birth"
            placeholder="12/01/1984"
            value={this.state.dob}
            onBlur={handleDobChange}
            //validate={ssnRequired}
          />
          <FieldTextInput
            className={css.ssnBackground}
            type="text"
            id="ssn"
            name="ssn"
            //autoComplete="family-name"
            label= "Social Security Number"
            placeholder="111-11-1111"
            value={this.state.ssn}
            onBlur={handleSSNChange}
            //validate={ssnRequired}
          />
          <FieldTextInput
            className={css.zipBackground}
            type="text"
            id="zip"
            name="zip"
            autoComplete="postal-code"
            label="Zip Code"
            placeholder="11111"
            value={this.state.zip}
            onBlur={handleZipChange}
            //validate={validators.composeValidators(addressZipRequired, addressZipValid)}
          />
        </div>
        <div className={css.name}>
          <FieldTextInput
            className={css.licenseNumberBackground}
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            autoComplete="licenseNumber"
            label="License Number"
            placeholder="A-111-111-111"
            value={this.state.licenseNumber}
            onBlur={handleLicenseNumberChange}
            //validate={validators.composeValidators(licenseNumberRequired, licenseNumberValid)}
          />
          <FieldTextInput
            className={css.licenseStateBackground}
            type="text"
            id="state"
            name="state"
            autoComplete="licenseState"
            label="License State"
            placeholder="Maryland"
            value={this.state.licenseState}
            onBlur={handleLicenseStateChange}
            //validate={validators.composeValidators(licenseStateRequired, licenseStateValid)}
          />
        </div>
        <div className={css.nextButton}>
          <PrimaryButton inProgress={false} disabled={submitDisabled}
                         onClick={this.showBackgroundDisclosures}>
            Next
          </PrimaryButton>
        </div>
      </div>

    );



    const backgroundInvestigation = (
      <div>
        <div className={css.scrolling}>
          <SinglePagePDFViewer pdf={diclosureForBackgroundInvestigation}/>
        </div>
        <div>
          <FieldCheckbox
            id="acknowledgeBI"
            name="acknowledgeBI"
            textClassName={css.acknowledgeReceiptText}
            label="I acknowledge receipt of the Disclosure regarding Background Investigation and certify that I have read and understand this document."
            value="acknowledgeBI"
            useSuccessColor
            onClick={handleBIAcknowledge}
          />
        </div>
        <div>
          <PrimaryButton onClick={this.handleBackgroundDisclosure} disabled={!this.state.biChecked}>
            Next
          </PrimaryButton>
        </div>
      </div>
    );


    const consumerRights = (
      <div>
      <div className={css.scrolling}>
        <SinglePagePDFViewer pdf={summaryOfRightsfile} />
      </div>

        <div>
          <FieldCheckbox

            id="acknowledgeReceipt"
            name="acknowledgeReceipt"
            textClassName={css.acknowledgeReceiptText}
            label="I acknowledge receipt of the Summary of Your Rights Under the Fair Credit Reporting Act (FCRA) and certify that I have read and understand this document."
            value="acknowledgeReceipt"
            useSuccessColor
            onClick={handleAcknowledge}
          />
        </div>
        <div>
          <PrimaryButton onClick={this.handleConsumerRights} disabled={!this.state.checked}>
            Next
          </PrimaryButton>
        </div>
      </div>
    );


    const ackandAuth = (
      <div>
        <div className={css.scrolling}>
          <SinglePagePDFViewer pdf={ackAndAuthFile} />
        </div>

        <div>
          <FieldCheckbox

            id="ackAndAuthCheck"
            name="ackAndAuthCheck"
            textClassName={css.ackAndAuthCheckText}
            label="I would like to receive a copy of my consumer report."
            value="ackAndAuthCheck"
            useSuccessColor
            //onClick={handleAckAndAuth}
          />
        </div>
        <div className={css.scrolling}>
          <p>By typing my name below, I consent to the background checks and indicate my agreement to all of the above</p>
          <FieldTextInput
            className={css.fullName}
            type="text"
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="Full Name"
            value={this.state.fullName}
            onBlur={handleFullNameSignature}
            //validate={validators.composeValidators(streetAddress1Required)}
          />

          <div>
            {/* You can replace captchaDemo with any ref word */}
            <ReCaptcha
              ref={(el) => {this.captchaDemo = el;}}
              size="normal"
              data-theme="dark"
              render="explicit"
              sitekey="6LfAWLwZAAAAAPAP9PBFQfUOurORE2MMwNc9CARu"
              onloadCallback={this.onLoadRecaptcha}
              verifyCallback={this.verifyCallback}
            />
            <code>
            </code>
          </div>

          <div>
            <PrimaryButton disabled={!(this.state.recaptchaVerified && this.state.fullNameSignature)}
              //onClick={values => onSubmitBackgroundDisclosures({ ...values})}>
                           onClick={handleFinalSubmit}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>


    );
    return (


      <div className={classes}>
        {this.state.showConsumerRights ? consumerRights : this.state.showBackgroundInvestigationDisclosure ? backgroundInvestigation :
        this.state.showAuth ? ackandAuth: backgroundInfoDiv}

      </div>
    );
  }
}


BackgroundDisclosuresComponent.defaultProps = {
  className: null,
  rootClassName: '',
  contentPlacementOffset: CONTENT_PLACEMENT_OFFSET,
  contentPosition: CONTENT_TO_RIGHT,
  isOpen: null,
  onToggleActive: null,
  useArrow: true,
};

const { bool, func, node, number, string } = PropTypes;

BackgroundDisclosuresComponent.propTypes = {
  children: node.isRequired,
  className: string,
  rootClassName: string,
  contentPosition: string,
  contentPlacementOffset: number,
  useArrow: bool,
  isOpen: bool,
  onToggleActive: func,
  onSubmitBackgroundDisclosures: func.isRequired,
  history: shape({
    push: func.isRequired
  }).isRequired
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    currentUser,
    currentUserListing,
  } = state.user;
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    contactDetailsChanged,
  } = state.ContactDetailsPage;
  return {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    currentUserListing,
    contactDetailsChanged,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const mapDispatchToProps = dispatch => ({
  //onChange: () => dispatch(saveBackgroundDisclosuresClear()),
  onSubmitBackgroundDisclosures: values => dispatch(requestSaveBackgroundInfo(values)),
});

const BackgroundDisclosures = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),


  injectIntl)(BackgroundDisclosuresComponent);


export default BackgroundDisclosures;
