import React from "react";
import css from './CardNextAppointment.css';
import {FormattedMessage, injectIntl} from "react-intl";
import {string} from 'prop-types';
import classNames from 'classnames';
import {Card} from "../index";
import {intlShape} from "../../util/reactIntl";


export const CardNextAppointmentComponent = props => {
  const {
    className,
    intl,
  } = props;

  const classes = classNames(css.root, className);

  return (
    <Card className={classes} flat={false}>
      <h2 className={css.cardHeader}><FormattedMessage id="Dashboard.nextAppointment"/></h2>
    </Card>
  );
};

CardNextAppointmentComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
}

const CardNextAppointment = injectIntl(CardNextAppointmentComponent);

export default CardNextAppointment;
