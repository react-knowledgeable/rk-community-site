import React from 'react';
import cx from 'classnames';
import s from './s.module.scss';

export default ({ className, children }) => (
  <div className={cx(s.card, className)}>{children}</div>
);
