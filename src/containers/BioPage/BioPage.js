import React from "react";
import {compose} from 'redux';
import { connect } from 'react-redux';
import {propTypes} from "../../util/types";
import {ensureCurrentUser} from "../../util/data";
import { bool, func } from 'prop-types';
import {BioForm} from "../../forms";
import {injectIntl} from "react-intl";
import { TopbarContainer } from '../../containers';
import css from './BioPage.css';
import {
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  Page,
} from '../../components';
import {isScrollingDisabled} from "../../ducks/UI.duck";
import {intlShape} from "../../util/reactIntl";
import {saveBio, saveBioClear} from "./BioPage.duck";

export const BioPageComponent = props => {
  const {
    currentUser,
    scrollingDisabled,
    intl,
    onChange,
    onSubmitBio,
    saveBioInProgress,
    saveBioError,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const attributes = user.attributes || {};
  const profile = attributes.profile || {};
  const {experience, travelRadius, educationLevel, preferences} = profile.publicData || {};

  const initValues = {
    bio: profile.bio,
    experience: experience || 0,
    travelRadius: travelRadius || 25,
    educationLevel: educationLevel,
    preferences: preferences,
  };

  const currentValues = {
    currentBio: initValues.bio,
    currentExperience: initValues.experience,
    currentTravelRadius: initValues.travelRadius,
    currentEducationLevel: initValues.educationLevel,
    currentPreferences: initValues.preferences,
  };

  const title = intl.formatMessage({id: 'BioPage.title'});

  const bioForm = user.id ? (
    <BioForm
      className={css.form}
      initialValues={initValues}
      currentUser={currentUser}
      onChange={onChange}
      onSubmit={values => onSubmitBio({...values, ...currentValues})}
      inProgress={saveBioInProgress}
      saveBioError={saveBioError}
    />
  ) : null;

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>

        <LayoutWrapperTopbar>
          <TopbarContainer
            currentPage="BioPage"
            desktopClassName={css.desktopTopbar}
            mobileClassName={css.mobileTopbar}
          />
          <div className={css.heroContainer}>
            <div className={css.heroContent} />
          </div>
        </LayoutWrapperTopbar>

        <LayoutWrapperAccountSettingsSideNav currentTab="BioPage" />

        <LayoutWrapperMain>
          <div className={css.content}>
            {bioForm}
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>

    </Page>
  );
};

BioPageComponent.defaultProps = {
  currentUser: null,
  saveBioError: null,
}

BioPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  scrollingDisabled: bool.isRequired,
  onChange: func.isRequired,
  onSubmitBio: func.isRequired,
  saveBioInProgress: bool.isRequired,
  saveBioError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    currentUser,
  } = state.user;

  const {
    saveBioInProgress,
    saveBioError,
  } = state.BioPage;

  return {
    currentUser,
    scrollingDisabled: isScrollingDisabled(state),
    saveBioInProgress,
    saveBioError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(saveBioClear()),
  onSubmitBio: values => dispatch(saveBio(values)),
})

const BioPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    ),
  injectIntl
)(BioPageComponent);

export default BioPage;

