import React, { useState, useEffect } from 'react';
import { bool, func, object, number, string } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { propTypes } from '../../util/types';
import {
  Avatar,
  InlineTextButton,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  OwnListingLink,
  Modal,
  Logo,
  ListingLink
} from '../../components';

import css from './TopbarDesktop.css';

const TopbarDesktop = props => {
  const {
    className,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    currentUserListing,
    currentUserListingFetched,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onManageDisableScrolling
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.inboxLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.inbox}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="EditListingPage">
          <OwnListingLink
            listing={currentUserListing}
            listingFetched={currentUserListingFetched}
            className={css.yourListingsLink}
          >
            <div>
              <span className={css.menuItemBorder} />
              {currentUserListing ? (
                <FormattedMessage id="TopbarDesktop.editYourListingLink" />
              ) : (
                <FormattedMessage id="TopbarDesktop.addYourListingLink" />
              )}
            </div>
          </OwnListingLink>
        </MenuItem>
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const signupButton = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupButton} >
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  let loginModalIsOpen = false;
  const handleOpenClose = () => {
    loginModalIsOpen = !loginModalIsOpen;
    console.log("flag is set to " + loginModalIsOpen);
  }

  const loginModal = (
    <Modal id="loginModal" isOpen={loginModalIsOpen} onClose={handleOpenClose}
           onManageDisableScrolling={onManageDisableScrolling}>
      This is a test
    </Modal>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <div className={css.loginLink} onClick={handleOpenClose}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </div>
  );

  const listingLink =
    authenticatedOnClientSide && currentUserListingFetched && currentUserListing ? (
      <ListingLink
        className={css.createListingLink}
        listing={currentUserListing}
        children={
          <span className={css.createListing}>
            <FormattedMessage id="TopbarDesktop.viewListing" />
          </span>
        }
      />
    ) : null;

  const logoLink = isAuthenticated ? (
    <NamedLink className={css.logoLink} name="LandingPage">
      <Logo
        format="desktop"
        className={css.logo}
        alt={intl.formatMessage({ id: 'TopbarDesktop.logo' })}
      />
    </NamedLink>
  ) : null;

  return (
    <nav className={classes}>
      {logoLink}
      {listingLink}
      {inboxLink}
      {profileMenu}
      {signupButton}
      {loginLink}
      <Modal id="loginModal" isOpen={loginModalIsOpen} onClose={handleOpenClose}
             onManageDisableScrolling={onManageDisableScrolling}>
        This is a test
      </Modal>
    </nav>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  currentUserListing: null,
  currentUserListingFetched: false,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  onManageDisableScrolling: func.isRequired,
};

export default TopbarDesktop;
