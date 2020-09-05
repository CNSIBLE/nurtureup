
import React from 'react';
import { bool, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { fetchCurrentUser, sendVerificationEmail } from '../../ducks/user.duck';
import {
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  Page,
  UserNav,
} from '../../components';
import { BackgroundDisclosuresForm } from '../../forms';
import { TopbarContainer } from '../../containers';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { saveBackgroundDisclosures, saveBackgroundDisclosuresClear } from './BackgroundDisclosuresPage.duck';
import css from './BackgroundDisclosuresPage.css';

export const BackgroundDisclosuresPageComponent = props => {
  const {
    saveEmailError,
    savePhoneNumberError,
    saveBackgroundDisclosuresInProgress,
    currentUser,
    currentUserListing,
    BackgroundDisclosuresChanged,
    onChange,
    scrollingDisabled,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    onResendVerificationEmail,
    onSubmitBackgroundDisclosures,
    intl,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const currentEmail = user.attributes.email || '';
  const protectedData = user.attributes.profile.protectedData || {};
  const currentPhoneNumber = protectedData.phoneNumber || '';
  const contactInfoForm = user.id ? (
    <BackgroundDisclosuresForm
      className={css.form}
      initialValues={{ email: currentEmail, phoneNumber: currentPhoneNumber }}
      saveEmailError={saveEmailError}
      savePhoneNumberError={savePhoneNumberError}
      currentUser={currentUser}
      onResendVerificationEmail={onResendVerificationEmail}
      onSubmit={values => onSubmitBackgroundDisclosures({ ...values, currentEmail, currentPhoneNumber })}
      onChange={onChange}
      inProgress={saveBackgroundDisclosuresInProgress}
      ready={BackgroundDisclosuresChanged}
      sendVerificationEmailInProgress={sendVerificationEmailInProgress}
      sendVerificationEmailError={sendVerificationEmailError}
    />
  ) : null;

  const title = intl.formatMessage({ id: 'BackgroundDisclosuresPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer
            currentPage="BackgroundDisclosuresPage"
            desktopClassName={css.desktopTopbar}
            mobileClassName={css.mobileTopbar}
          />
          <UserNav selectedPageName="BackgroundDisclosuresPage" listing={currentUserListing} />
        </LayoutWrapperTopbar>
        <LayoutWrapperAccountSettingsSideNav currentTab="BackgroundDisclosuresPage" />
        <LayoutWrapperMain>
          <div className={css.content}>
            <h1 className={css.title}>
              <FormattedMessage id="BackgroundDisclosuresPage.heading" />
            </h1>
            {contactInfoForm}
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

BackgroundDisclosuresPageComponent.defaultProps = {
  saveEmailError: null,
  savePhoneNumberError: null,
  currentUser: null,
  sendVerificationEmailError: null,
};

BackgroundDisclosuresPageComponent.propTypes = {
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  saveBackgroundDisclosuresInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentUserListing: propTypes.ownListing,
  BackgroundDisclosuresChanged: bool.isRequired,
  onChange: func.isRequired,
  onSubmitBackgroundDisclosures: func.isRequired,
  scrollingDisabled: bool.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    currentUser,
    currentUserListing,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  } = state.user;
  const {
    saveEmailError,
    savePhoneNumberError,
    saveBackgroundDisclosuresInProgress,
    BackgroundDisclosuresChanged,
  } = state.BackgroundDisclosuresPage;
  return {
    saveEmailError,
    savePhoneNumberError,
    saveBackgroundDisclosuresInProgress,
    currentUser,
    currentUserListing,
    BackgroundDisclosuresChanged,
    scrollingDisabled: isScrollingDisabled(state),
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(saveBackgroundDisclosuresClear()),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  onSubmitBackgroundDisclosures: values => dispatch(saveBackgroundDisclosures(values)),
});

const BackgroundDisclosuresPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(BackgroundDisclosuresPageComponent);

BackgroundDisclosuresPage.loadData = () => {
  // Since verify email happens in separate tab, current user's data might be updated
  return fetchCurrentUser();
};

export default BackgroundDisclosuresPage;
