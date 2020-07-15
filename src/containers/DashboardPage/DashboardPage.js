import React from "react";
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
import {
  AvatarDashboard,
  Card,
  Footer,
  LayoutSingleColumn,
  LayoutWrapperFooter,
  LayoutWrapperMain,
  LayoutWrapperTopbar,
  Page,
} from '../../components';

export const DashboardPageComponent = props => {
  const {
    scrollingDisabled,
    currentUser,
    intl,
  } = props;

  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({id: 'LandingPage.schemaTitle'}, {siteTitle});

  const aboutCard = (

    <Card className={classNames(css.card, css.aboutCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.aboutMe"/></h2>
    </Card>
  );

  const appointmentCard = (
    <Card className={classNames(css.card, css.apptCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.nextAppointment"/></h2>
    </Card>
  );

  const actionCard = (
    <Card className={classNames(css.card, css.actionsCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.quickActions"/></h2>
    </Card>
  );

  const messagesCard = (
    <Card className={classNames(css.card, css.msgsCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.messages"/></h2>
    </Card>
  )

  const upcomingCard = (
    <Card className={classNames(css.card, css.upcomingCard)} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.hireRequests"/></h2>
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
        </LayoutWrapperTopbar>

        <LayoutWrapperMain>
          <div className={css.heroContainer}>
            <div className={css.heroContent}>

            </div>
            <AvatarDashboard className={css.avatar} user={currentUser} disableProfileLink/>
          </div>
          <div className={css.cards}>
            <ul>
              <li className={css.row}>
                {aboutCard}
                {appointmentCard}
              </li>
              <li className={css.row}>
                {actionCard}
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

export default DashboardPage;
