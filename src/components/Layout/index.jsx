import * as React from 'react';
import { Link } from 'gatsby';
import s from './s.module.scss';

export default ({ children }) => (
  <div className={s.layout}>
    <header>
      <h1>
        <Link to="/">React Knowledgeable</Link>
      </h1>
      <p>
        React Knowledgeable, nicknamed <code>&lt;RK /&gt;</code>, is a fair and
        friendly podium to share what we learn about React.
      </p>
    </header>
    {children}
  </div>
);
