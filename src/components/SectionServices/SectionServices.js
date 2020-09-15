import React from 'react';
import {FormattedMessage} from "react-intl";
import classNames from 'classnames';
import nuLogo from '../../assets/nurtureup_logo/nurtureup_logo.png'
import {
  Card,
  IconSleepConsultant,
  IconLaborDoula,
  IconPostDoula,
  IconPhotographer,
  IconNursery,
  IconNewbornCare,
  IconMidwife,
  IconMealPrep,
  IconChildbirthEd,
  IconCarSeatTech,
  IconLactation
} from '../../components';

import css from './SectionServices.css';

const SectionServices = props => {
  const {rootClassName, className} = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <ul>
        <li className={css.row}>
          <Card className={css.card} flat={true}>
            <IconSleepConsultant/>
            <FormattedMessage id="Services.sleepConsultant" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.sleepConsultant" /></p>
          </Card>
          <Card className={css.card} flat={false}>
            <IconLaborDoula/>
            <FormattedMessage id="Services.laborDoula" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.laborDoula" /> </p>
          </Card>
          <Card className={css.card} flat={true}>
            <IconNursery/>
            <FormattedMessage id="Services.nurseryConsultant" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.nurseryConsultant" /></p>
          </Card>
          <Card className={css.card} flat={false}>
            <IconPostDoula/>
            <FormattedMessage id="Services.postDoula" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.postDoula" /></p>
          </Card>
          <Card className={css.card} flat={true}>
            <IconCarSeatTech/>
            <FormattedMessage id="Services.carSeatTech" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.carSeatTech" /></p>
          </Card>
          <Card className={css.card} flat={false}>
            <IconLactation/>
            <FormattedMessage id="Services.lactationConsultant" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.lactationConsultant" /></p>
          </Card>
        </li>
        <li className={css.row}>
          <Card className={css.card} flat={false}>
            <IconMidwife/>
            <FormattedMessage id="Services.midwife" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.midwife" /></p>
          </Card>
          <Card className={css.card} flat={true}>
            <IconNewbornCare/>
            <FormattedMessage id="Services.newbornSpecialist" />
            <p className={css.text}><FormattedMessage id="ServicesDescription.newbornSpecialist" /></p>
          </Card>
          <Card className={css.card} flat={false}>
            <IconPhotographer/>
            Infant & Pregnancy Photography
          </Card>
          <Card className={css.card} flat={true}>
            <IconChildbirthEd/>
            <FormattedMessage id="Services.childbirthEducation" />
          </Card>
          <Card className={css.card} flat={false}>
            <IconMealPrep/>
            <FormattedMessage id="Services.mealPrep" />
          </Card>
        </li>
        <li className={css.mission}>
          <img src={nuLogo} className={css.logo} alt="Logo" />
          <h1 className={css.missionText}>
            <FormattedMessage id="LandingPage.missionStatement" />
          </h1>
        </li>
      </ul>

    </div>
  );
}

export default SectionServices;
