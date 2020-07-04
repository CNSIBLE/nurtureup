import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";
import classNames from 'classnames';
import {
  Card,
  IconSleepConsultant,
  IconLaborDoula
} from '../../components';

import css from './SectionServices.css';

const SectionServices = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <ul>
        <li className={css.row}>
          <Card className={css.card} flat={true}>
            <IconSleepConsultant />
            flat
          </Card>
          <Card className={css.card} flat={false}>
            <IconLaborDoula />
            not flat
          </Card>
          <Card className={css.card} flat={true}>
            flat
          </Card>
          <Card className={css.card} flat={false}>
            not flat
          </Card>
          <Card className={css.card} flat={true}>
            flat
          </Card>
          <Card className={css.card} flat={false}>
            not flat
          </Card>
        </li>
        <li className={css.row}>
          <Card className={css.card} flat={false}>
            not flat
          </Card>
          <Card className={css.card} flat={true}>
            flat
          </Card>
          <Card className={css.card} flat={false}>
            not flat
          </Card>
          <Card className={css.card} flat={true}>
            flat
          </Card>
          <Card className={css.card} flat={false}>
            not flat
          </Card>
        </li>
      </ul>

    </div>
  );
}

export default SectionServices;
