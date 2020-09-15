import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './SummaryConsumerRights.css';

const SummaryConsumerRights = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  // prettier-ignore
  return (
    <div className={classes}>
      <p className={css.lastUpdated}>Last updated: July 18, 2020</p>

      <p>
        Para información en español, visite  www.consumerfinance.gov/learnmore o escribe a la Consumer
        Financial Protection Bureau, 1700 G Street N.W., Washington, DC 20552.
      </p>

      <h2> A Summary of Your Rights Under the Fair Credit Reporting Act</h2>
      <p>
        The federal Fair Credit Reporting Act (FCRA) promotes the accuracy, fairness, and privacy of
        information in the files of consumer reporting agencies.  There are many types of consumer reporting
        agencies, including credit bureaus and specialty agencies (such as agencies that sell information about
        check writing histories, medical records, and rental history records).  Here is a summary of your major
        rights under FCRA.   For more information, including information about additional rights, go to
        www.consumerfinance.gov/learnmore or write to: Consumer Financial Protection Bureau, 1700 G
        Street N.W., Washington, DC 20552.
      </p>
    </div>
  );
};

SummaryConsumerRights.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string } = PropTypes;

SummaryConsumerRights.propTypes = {
  rootClassName: string,
  className: string,
};

export default SummaryConsumerRights;
