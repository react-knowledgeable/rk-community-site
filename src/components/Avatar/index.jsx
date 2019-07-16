import React from 'react';
import cx from 'classnames';
import s from './s.module.scss';

export default ({ avatarUrl, linkUrl, className }) => (
  <a href={linkUrl} className={cx(s.avatarLink, className)}>
    <img src={avatarUrl} className={s.avatar} />
  </a>
);
