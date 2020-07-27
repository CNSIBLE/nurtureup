import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


import css from './BackgroundDisclosures.css';
import SummaryConsumerRights from "../SummaryConsumerRights/SummaryConsumerRights";


const CONTENT_PLACEMENT_OFFSET = 0;
const CONTENT_TO_RIGHT = 'right';

const isControlledMenu = (isOpenProp, onToggleActiveProp) => {
  return isOpenProp !== null && onToggleActiveProp !== null;
};
const consumerRights = (
  <SummaryConsumerRights></SummaryConsumerRights>
);


class BackgroundDisclosures extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, ready: false };


  }

  render() {
    const { className, rootClassName } = this.props;
    const rootClass = rootClassName || css.root;
    const classes = classNames(rootClass, className);


    return (
      <div className={classes}>
        {consumerRights}
      </div>
    );
  }
}


BackgroundDisclosures.defaultProps = {
  className: null,
  rootClassName: '',
  contentPlacementOffset: CONTENT_PLACEMENT_OFFSET,
  contentPosition: CONTENT_TO_RIGHT,
  isOpen: null,
  onToggleActive: null,
  useArrow: true,
};

const { bool, func, node, number, string } = PropTypes;

BackgroundDisclosures.propTypes = {
  children: node.isRequired,
  className: string,
  rootClassName: string,
  contentPosition: string,
  contentPlacementOffset: number,
  useArrow: bool,
  isOpen: bool,
  onToggleActive: func,
};

export default BackgroundDisclosures;
