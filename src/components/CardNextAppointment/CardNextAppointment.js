import React from "react";
import css from './CardNextAppointment.css';
import {FormattedMessage, injectIntl} from "react-intl";
import {string} from 'prop-types';
import classNames from 'classnames';
import {Card} from "../index";


export const CardNextAppointment = props => {
  const {
    className,
  } = props;

  const classes = classNames(css.root, className);

  return (
    <Card className={classes} flat={false}>
      <div className={css.header}>
        <h2><FormattedMessage id="Dashboard.nextAppointment"/></h2>
      </div>
    </Card>
  );
};

CardNextAppointment.propTypes = {
  className: string,
}

export default CardNextAppointment;
