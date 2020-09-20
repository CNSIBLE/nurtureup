import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { propTypes } from '../../util/types';
import { LoginForm } from '../../forms';
import { isLoginModalOpen, isScrollingDisabled, setIsLoginModalOpen, manageDisableScrolling } from "../../ducks/UI.duck";
import { login, authenticationInProgress } from "../../ducks/Auth.duck";
import { FormattedMessage } from "react-intl";
import {bool, func} from "prop-types";
import {
  Modal,
} from '../../components'
import css from './LoginModal.css';

export const LoginModalComponent = props => {
  const {
    authInProgress,
    loginError,
    submitLogin,
    onManageDisableScrolling,
    onSetIsLoginModalOpen,
    loginModalIsOpen
  } = props;

  const handleOnClose = () => {
    onSetIsLoginModalOpen(false);
  }

  const loginErrorMessage = (
    <div className={css.error}>
      <FormattedMessage id="AuthenticationPage.loginFailed" />
    </div>
  );

  const errorMessage = loginError ? loginErrorMessage : null;

  return (
    <Modal id="loginModal" isOpen={loginModalIsOpen} onClose={handleOnClose}
           onManageDisableScrolling={onManageDisableScrolling}>
        <div className={css.root}>
          { errorMessage }
          <LoginForm className={css.form} onSubmit={submitLogin} inProgress={authInProgress} />
      </div>
    </Modal>
  );
}

LoginModalComponent.defaultProps = {
  currentUser: null,
  loginError: null,
  sendVerificationEmailError: null,
};

LoginModalComponent.propTypes = {
  authInProgress: bool.isRequired,
  loginError: propTypes.error,
  scrollingDisabled: bool.isRequired,
  submitLogin: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  loginModalIsOpen: bool.isRequired,
  onSetIsLoginModalOpen: func.isRequired,
};

const mapStateToProps = state => {
  const { loginError } = state.Auth;
  return {
    authInProgress: authenticationInProgress(state),
    loginError,
    scrollingDisabled: isScrollingDisabled(state),
    loginModalIsOpen: isLoginModalOpen(state),
  };
};

const mapDispatchToProps = dispatch => ({
  submitLogin: ({ email, password }) => dispatch(login(email, password)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onSetIsLoginModalOpen: (value) => dispatch(setIsLoginModalOpen(value))
});

const LoginModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoginModalComponent);

export default LoginModal;
