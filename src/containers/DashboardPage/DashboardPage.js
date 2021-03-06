import React, {Component} from "react";
import {compose} from 'redux';
import css from './DashboardPage.css';
import classNames from 'classnames';
import {TopbarContainer} from "../index";
import {isScrollingDisabled} from "../../ducks/UI.duck";
import {connect} from "react-redux";
import config from "../../config";
import {FormattedMessage, injectIntl} from "react-intl";
import {bool} from 'prop-types';
import {propTypes} from '../../util/types';
import {ensureCurrentUser} from "../../util/data";
import {
  AvatarDashboard,
  Card,
  CardAboutMe, CardNextAppointment, CardQuickActions,
  Footer,
  LayoutSingleColumn,
  LayoutWrapperFooter,
  LayoutWrapperMain,
  LayoutWrapperTopbar,
  Page,
} from '../../components';
import {fetchCurrentUser} from "../../ducks/user.duck";

export const DashboardPageComponent = props => {
  const {
    scrollingDisabled,
    currentUser,
    intl,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const attributes = user.attributes || {};
  const profile = attributes.profile || {};
  const {isGiver} = profile.metadata || false;

  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({id: 'LandingPage.schemaTitle'}, {siteTitle});

  const messagesCard = (
    <Card className={classNames(css.card, css.msgsCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.messages"/></h2>
    </Card>
  )

  const upcomingCard = (
    <Card className={classNames(css.card, css.upcomingCard)} flat={false}>
      {isGiver ?
        <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.hireRequests"/></h2>
        : <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.myJobListings"/></h2>
      }
    </Card>
  );

  const calendarCard = (
    <Card className={classNames(css.card, css.calendarCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.appointments"/></h2>
    </Card>
  )

  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      title={schemaTitle}
      contentType="website"
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer/>

          <div className={css.heroContainer}>
            <div className={css.heroContent} />
            <AvatarDashboard className={css.avatar} user={user} disableProfileLink/>
          </div>
        </LayoutWrapperTopbar>

        <LayoutWrapperMain>
          <div className={css.cards}>
            <ul>
              <li className={css.row}>
                <CardAboutMe className={css.card}/>
                <CardNextAppointment className={css.card} />
              </li>
              <li className={css.row}>
                <CardQuickActions className={css.card} isGiver={isGiver}/>
                {messagesCard}
                {upcomingCard}
              </li>
              <li className={css.row}>
                {calendarCard}
              </li>
            </ul>
          </div>

        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer/>
        </LayoutWrapperFooter>

      </LayoutSingleColumn>
    </Page>
  )
};

DashboardPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  currentUser: propTypes.currentUser,
}

const mapStateToProps = state => {
  const {
    currentUser,
  } = state.user;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
  }
}

const DashboardPage = compose(
  connect(
    mapStateToProps,
  ),
  injectIntl
)(DashboardPageComponent);

DashboardPage.loadData = () => {
  return fetchCurrentUser();
}

export default DashboardPage;
