import React from "react";
import css from "./CardAboutMe.css";
import {FormattedMessage} from "react-intl";
import {propTypes} from "../../util/types";
import {string} from 'prop-types';
import classNames from 'classnames';
import {injectIntl, intlShape} from "../../util/reactIntl";
import {
  Card, IconEdit,
} from '../../components';

export const CardAboutMeComponent = props => {
  const {
    className,
    user,
    intl,
  } = props;

  const {email, profile} = user.attributes;
  const {phone, city, state, streetAddress1, zip, birthday} = profile.protectedData;
  const address = streetAddress1 + " " + city + ", " + state + " " + zip;
  const bday = (birthday == null ? "N/A" : birthday);

  const classes = classNames(css.root, className);

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
        <div className={css.inputDiv}>
          <input type="text" className={css.inputText} value={val} readOnly/>
        </div>
      </div>
    )
  }

  return (
    <Card className={classes} flat={false}>
      <div className={css.header} >
        <h2><FormattedMessage id="CardAboutMe.header"/></h2>
        <IconEdit className={css.editIcon} width="30" height="30" />
      </div>

      {field(addressLabel, address)}
      {field(emailLabel, email)}
      {field(phoneLabel, phone)}
      {field(birthdayLabel, bday)}
    </Card>
  )
};

CardAboutMeComponent.defaultProps = {
  currentUser: null,
}

CardAboutMeComponent.propTypes = {
  currentUser: propTypes.currentUser,
  className: string,
  intl: intlShape.isRequired,
};

const CardAboutMe = injectIntl(CardAboutMeComponent);

export default CardAboutMe;
