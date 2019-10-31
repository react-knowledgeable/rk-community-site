import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import Talk from '../components/Talk';
import Card from '../components/Card';
import parseDate from '../utils/parseDate';
import s from './s.module.scss';

const parseBodyText = body => {
  return body.match('<!-- intro starts -->')
    ? body.split('<!-- intro starts -->')[1].split('<!-- intro ends -->')[0]
    : '';
};

export default ({
  data: {
    site: {
      siteMetadata: { title, description, url, image, twitter, titleTemplate },
    },
    meetups: { nodes: meetups },
    stories: { nodes: stories },
    github: {
      repository: {
        content: { nodes: labels },
        talks: { nodes: talks },
      },
    },
  },
}) => {
  const nextMeetup = getNextMeetup(meetups);
  const {
    fields: { slug: nextMeetupSlug } = {},
    frontmatter: { title: meetupTitle, venue, date, eventLink },
  } = nextMeetup || { frontmatter: {} };
  return (
    <Layout
      {...{
        title,
        description,
        image,
        url,
        twitter,
        titleTemplate,
      }}
      className={s.homePageLayout}
    >
      <aside className={s.upcomingMeetupInfo}>
        {!!meetups && (
          <React.Fragment>
            <h2>
              On the next <code>&lt;RK /&gt;</code>
            </h2>
            <Card>
              <h3>Talk Line-up</h3>
              {nextMeetup &&
                nextMeetup.frontmatter &&
                nextMeetup.frontmatter.talks &&
                nextMeetup.frontmatter.talks.length &&
                nextMeetup.frontmatter.talks.map(talkNumber => {
                  const talkData = talks.find(
                    ({ number }) => number === talkNumber
                  );
                  return <Talk {...talkData} key={talkData.number} />;
                })}
            </Card>
            {nextMeetup && (
              <Card key={date}>
                <h3>
                  <Link to={nextMeetupSlug}>{meetupTitle}</Link>
                </h3>
                <p>
                  {date ? `Date: ${parseDate(date)}` : 'Mysterious date...'}
                </p>
                <p>{venue ? `Venue: ${venue}` : 'Mysterious venue...'}</p>
                <p>
                  <b>
                    {eventLink ? (
                      <a href={eventLink}>RSVP</a>
                    ) : (
                      'RSVP open soon'
                    )}
                  </b>
                </p>
              </Card>
            )}
          </React.Fragment>
        )}
      </aside>
      <main>
        <h2>Topics</h2>
        <div className={s.topicListing}>
          {!!labels &&
            labels
              .filter(
                label =>
                  // GH doesn't have query filters on labels
                  !['talk', 'event', 'react updates'].includes(label.name) &&
                  label.issues.nodes.length
              )
              .map(({ name, issues: { nodes: issues } }) => (
                <Card className={s.topicCard} key={`label-${name}`}>
                  <h3>{name}</h3>
                  {!!issues &&
                    issues
                      // sorts by created descending, later talk comes up
                      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                      .map(
                        ({ title, body, url, closed, createdAt, number }) => (
                          <React.Fragment>
                            <h4 className={s.talkTitle}>
                              <Link to={`/talks/${number}`}>{title}</Link>
                              {!closed ? (
                                <span className={s.upcoming}>upcoming</span>
                              ) : null}
                              <a
                                className={s.externalLink}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <svg
                                  className={s.externalLinkIcon}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 -8 36 36"
                                >
                                  <path d="M 12.3125 0 C 10.425781 0.00390625 10.566406 0.507813 11.5625 1.5 L 14.78125 4.71875 L 9.25 10.25 C 8.105469 11.394531 8.105469 13.230469 9.25 14.375 L 11.6875 16.78125 C 12.832031 17.921875 14.667969 17.925781 15.8125 16.78125 L 21.34375 11.28125 L 24.5 14.4375 C 25.601563 15.539063 26 15.574219 26 13.6875 L 26 3.40625 C 26 -0.03125 26.035156 0 22.59375 0 Z M 4.875 5 C 2.183594 5 0 7.183594 0 9.875 L 0 21.125 C 0 23.816406 2.183594 26 4.875 26 L 16.125 26 C 18.816406 26 21 23.816406 21 21.125 L 21 14.75 L 18 17.75 L 18 21.125 C 18 22.160156 17.160156 23 16.125 23 L 4.875 23 C 3.839844 23 3 22.160156 3 21.125 L 3 9.875 C 3 8.839844 3.839844 8 4.875 8 L 8.3125 8 L 11.3125 5 Z"></path>
                                </svg>
                              </a>
                            </h4>
                            <p className={s.topicIntro}>
                              {parseBodyText(body)}
                            </p>
                          </React.Fragment>
                        )
                      )}
                </Card>
              ))}
        </div>
      </main>
      <aside>
        <h2>Stories</h2>
        <Card>
          {!!stories &&
            stories.map(
              ({ excerpt, frontmatter: { title }, fields: { slug } }) => (
                <div>
                  <h4 key={slug}>
                    <Link to={slug}>{title}</Link>
                  </h4>
                  <p>{excerpt}</p>
                </div>
              )
            )}
        </Card>
      </aside>
    </Layout>
  );
};

export const pageQuery = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title
        image
        description
        url
        twitter
        titleTemplate
      }
    }
    meetups: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/meetups/" } }
      sort: { fields: frontmatter___date, order: ASC }
    ) {
      nodes {
        frontmatter {
          venue
          date
          talks
          eventLink
          issueLink
          title
        }
        fields {
          slug
        }
        excerpt
      }
    }
    github {
      repository(owner: "react-knowledgeable", name: "talks") {
        content: labels(first: 30) {
          nodes {
            name
            description
            issues(last: 100) {
              totalCount
              nodes {
                title
                body
                url
                number
                closed
                createdAt
              }
            }
          }
        }
        talks: issues(
          last: 100
          labels: ["talk"]
          orderBy: { field: CREATED_AT, direction: ASC }
        ) {
          nodes {
            title
            body
            number
            bodyText
            author {
              avatarUrl
              login
              url
            }
            url
          }
        }
      }
    }
    stories: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/stories/" } }
      sort: { fields: frontmatter___date, order: DESC }
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

// meetups must be sorted by date
function getNextMeetup(meetups) {
  const now = new Date();
  return meetups.find(({ frontmatter: { date } }) => {
    const eventDate = new Date(date);
    return eventDate.setDate(eventDate.getDate() + 1) >= now;
  });
}
