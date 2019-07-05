import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import parseDate from '../utils/parseDate';
import s from './styles.module.scss';

export default ({
  data: {
    meetups: { nodes: meetups },
    stories: { nodes: stories },
  },
}) => (
  <Layout>
    <aside>
      {!!meetups && (
        <React.Fragment>
          <h2>Upcoming Meetups</h2>
          {meetups.map(
            ({
              frontmatter: { title, venue, talks, date, meetupLink, issueLink },
            }) => (
              <div className={s.card}>
                <h3>{title}</h3>
                <p>
                  {date ? `Date: ${parseDate(date)}` : 'Mysterious date...'}
                </p>
                <p>{venue ? `Venue: ${venue}` : 'Mysterious venue...'}</p>
                <p>
                  <b>
                    {meetupLink ? (
                      <a href={meetupLink}>RSVP</a>
                    ) : (
                      'RSVP open soon'
                    )}
                  </b>
                </p>
              </div>
            )
          )}
        </React.Fragment>
      )}

      <div className={s.card}>
        <h3>Speaker Lignup</h3>
        <h3>
          <a href="https://github.com/react-knowledgeable/talks/issues/new/choose">
            Dr.RK could be you
          </a>
        </h3>
      </div>
    </aside>
    <aside>
      <h2>Getting Involved</h2>
      <div className={s.card}>
        <h3>
          <a href="https://github.com/react-knowledgeable/talks/issues/new/choose">
            📝 Submit a talk
          </a>
        </h3>
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
      {!!stories &&
        stories.map(({ excerpt, frontmatter: { title }, fields: { slug } }) => (
          <article className={s.card}>
            <h2>
              <a href={`/story${slug}`}>{title}</a>
            </h2>
            <p>{excerpt}</p>
          </article>
        ))}
    </main>
  </Layout>
);

export const pageQuery = graphql`
  query HomePageQuery {
    meetups: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/meetups/" } }
    ) {
      nodes {
        frontmatter {
          venue
          date
          talks
          meetupLink
          issueLink
          title
        }
        fields {
          slug
        }
        excerpt
      }
    }
    stories: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/stories/" } }
    ) {
      nodes {
        frontmatter {
          title
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
`;
