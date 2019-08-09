import React from 'react';

export default ({ avatarUrl, login, url }) => (
  <a href={url}>
    <img src={avatarUrl} alt={`${login}-avatar`} />
  </a>
);
