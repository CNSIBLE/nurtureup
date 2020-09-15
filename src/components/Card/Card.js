import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './Card.css';

const Card = props => {
  const {children, flat, className} = props;
  const classes  = classNames(css.root, (flat ? css.flat : css.floating), className);

  return (
    <div className={ classes }>
      { children }
    </div>
  )
}

Card.defaultProps = {children: null, flat: true};

const { any, bool, string } = PropTypes;

Card.propTypes = {
  children: any,
  flat: bool,
  className: string
};

export default Card;
