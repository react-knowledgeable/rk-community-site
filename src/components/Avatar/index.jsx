import React from 'react';
import s from './s.module.scss';

export default ({ avatarUrl, login, url }) => (
  <a href={url} className={s.avatarLink}>
    <img className={s.avatar} src={avatarUrl} alt={`${login}-avatar`} />
  </a>
);
