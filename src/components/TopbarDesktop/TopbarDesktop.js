import React, {useEffect, useState} from 'react';
import {bool, func, object, string} from 'prop-types';
import {FormattedMessage, intlShape} from '../../util/reactIntl';
import classNames from 'classnames';
import {ACCOUNT_SETTINGS_PAGES} from '../../routeConfiguration';
import {propTypes} from '../../util/types';
import {
  InlineTextButton,
  Logo,
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  NamedLink,
  OwnListingLink,
} from '../../components';

import css from './TopbarDesktop.css';
import MenuIcon from "../Topbar/MenuIcon";

const TopbarDesktop = props => {
  const {
    className,
    currentPage,
    rootClassName,
    currentUserListing,
    currentUserListingFetched,
    intl,
    isAuthenticated,
    onLogout,
    setIsLoginModalOpen
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <MenuIcon className={css.menuIcon}/>
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

        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>

        <MenuItem key="Dashboard">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('Dashboard'))}
            name="Dashboard"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.dashboardLink" />
          </NamedLink>
        </MenuItem>

        <MenuItem key="Search">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('SearchPage'))}
            name="SearchPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.searchLink" />
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

  const handleOnClick = () => {
    setIsLoginModalOpen(true);
  }

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <div className={css.loginLink} onClick={handleOnClick}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </div>
  );

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
      {profileMenu}
      {signupButton}
      {loginLink}
    </nav>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  initialSearchFormValues: {},
  currentUserListing: null,
  currentUserListingFetched: false,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  setIsLoginModalOpen: func.isRequired,
};

export default TopbarDesktop;
