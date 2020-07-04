import React, {Component} from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import { IconSearchCareJob, IconSearchCareGiver, Button } from '../../components';
import { lazyLoadWithDimensions } from '../../util/contextHelpers'
import nuLogo from '../../assets/nurtureup_logo/nurtureup_logo.png'

import css from './SectionHero.css';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const SectionHero = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <LazyImage src={nuLogo} alt='Logo' className={css.logo} />
         <Button rootClassName={css.searchButton}>
           <span>I want a Care Giver</span>
           <IconSearchCareGiver />
         </Button>

        <Button rootClassName={css.searchButton}>
          <span>I want a Care Job</span>
          <IconSearchCareJob />
        </Button>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
