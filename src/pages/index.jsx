import * as React from 'react';
import Layout from '../components/Layout';
import s from './styles.module.scss';

export default () => (
  <Layout>
    <header>
      <h1>React Knowledgeable</h1>
      <p>
        React Knowledgeable, nicknamed <code>&lt;RK /&gt;</code>, is a fair
        podium to share what we learn about React.
      </p>
    </header>
    <aside>
      <h2>Upcoming Meetup</h2>
      <div className={s.card}>
        <h3>RK Lightning</h3>
        <p>Mysterious date...</p>
        <p>Mysterious venue...</p>
        <p>
          <b>
            <a href="#">Here to sign up</a>
          </b>
        </p>
      </div>

      <div className={s.card}>
        <h3>Speaker Lignup</h3>
        <h3>
          <a href="#">Dr.RK could be you</a>
        </h3>
      </div>
    </aside>
    <aside>
      <h2>Getting Involved</h2>
      <div className={s.card}>
        <h3>📝 Submit a talk</h3>
      </div>
      <div className={s.card}>
        <h3>Reaching out</h3>
        <ul>
          <li>
            Twitter{' '}
            <a href="https://twitter.com/reknowledgeable">@reknowledgeable</a>
          </li>
          <li>YouTube channel</li>
        </ul>
      </div>
    </aside>

    <main>
      <h2>Stories</h2>

      <article className={s.card}>
        <h2>got title</h2>
        <p>got excerpt...</p>
      </article>
      <article className={s.card}>
        <h2>got title</h2>
        <p>got excerpt...</p>
      </article>
      <article className={s.card}>
        <h2>got title</h2>
        <p>got excerpt...</p>
      </article>
    </main>
  </Layout>
);
