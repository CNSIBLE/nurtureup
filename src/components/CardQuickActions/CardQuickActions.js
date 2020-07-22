import React from "react";
import Card from "../Card/Card";
import {FormattedMessage, injectIntl, intlShape} from "../../util/reactIntl";
import Button from "../Button/Button";
import css from "./CardQuickAction.css";
import classNames from "classnames";
import {string} from 'prop-types';

export const CardQuickActions = props => {
  const {
    className,
  } = props;

  const classes = classNames(css.root, className);

  return (
    <Card className={classes} flat={false}>
      <div className={css.header}>
        <h2><FormattedMessage id="CardQuickActions.header"/></h2>
      </div>

      <div className={css.actions}>
        <Button className={css.button}>
          <FormattedMessage id="CardQuickActions.findAJob"/>
        </Button>

        <Button className={css.button}>
          <FormattedMessage id="CardQuickActions.updateAvailability"/>
        </Button>

        <Button className={css.button}>
          <FormattedMessage id="CardQuickActions.fileDispute"/>
        </Button>
      </div>
    </Card>
  );
}

CardQuickActions.defaultProps = {}

CardQuickActions.propTypes = {
  className: string,
}

export default CardQuickActions;
