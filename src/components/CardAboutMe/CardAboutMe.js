import React, {Component} from "react";
import css from "./CardAboutMe.css";
import {FormattedMessage} from "react-intl";
import {propTypes} from "../../util/types";
import {string} from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {ensureCurrentUser} from "../../util/data";
import {injectIntl, intlShape} from "../../util/reactIntl";
import {
  Card,
} from '../../components';

export class CardAboutMeComponent extends Component {
  render() {
    const {
      className,
      currentUser,
      intl,
    } = this.props;

    const user = ensureCurrentUser(currentUser);
    console.log(user);
    const {email, profile} = user.attributes;
    const { phone, city, st, streetAddress1, zip, bday} = profile.protectedData;
    const address = {streetAddress1} + " " + city + ", " + st + " " + zip;
    const birthday = (bday == null ? "N/A" : bday);

    const classes = classNames(css.root, className);
    const inputClasses = classNames(css.inputDiv, css.input)

    const emailLabel = intl.formatMessage({
      id: 'CardAboutMe.emailLabel',
    });

    const birthdayLabel = intl.formatMessage({
      id: 'CardAboutMe.birthdayLabel',
    });

    const phoneLabel = intl.formatMessage({
      id: 'CardAboutMe.phoneLabel',
    });

    const addressLabel = intl.formatMessage({
      id: 'CardAboutMe.addressLabel',
    });

    const field = (label, val) => {
      return (
        <div className={css.field}>
          <label className={css.label}>{label}</label>
          <div className={inputClasses}>
            <input
              value={val}
              readOnly/>
          </div>
        </div>
      )
    }

    return (
      <Card className={classes} flat={false}>
        <h2 className={css.header}><FormattedMessage id="CardAboutMe.aboutMe"/></h2>

        { field(address, addressLabel) }
        { field(email, emailLabel) }
        { field(phone, phoneLabel) }
        { field(birthday, birthdayLabel) }
      </Card>
    )
  };
}

CardAboutMeComponent.defaultProps = {
  currentUser: null,
}

CardAboutMeComponent.propTypes = {
  currentUser: propTypes.currentUser,
  className: string,
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;

  return {
    currentUser,
  };
};

const CardAboutMe = compose(
  connect(
    mapStateToProps,
  ),
  injectIntl
)(CardAboutMeComponent);

export default CardAboutMe;
