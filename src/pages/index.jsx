import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import Talk from '../components/Talk';
import SubmitTalkButton from '../components/SubmitTalkButton';
import Card from '../components/Card';
import parseDate from '../utils/parseDate';
import s from './styles.module.scss';

export default ({
  data: {
    site: {
      siteMetadata: { title, description, url, image, twitter, titleTemplate },
    },
    meetups: { nodes: meetups },
    stories: { nodes: stories },
    talks: {
      repository: {
        issues: { nodes: talks },
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
    >
      <aside>
        {!!meetups && (
          <React.Fragment>
            <h2>Upcoming Meetups</h2>
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
      </aside>
      <aside>
        <h2>Getting Involved</h2>
        <SubmitTalkButton />
        <Card>
          <h3>Reaching out</h3>
          <div className={s.reachingOutList}>
            <a
              className={s.reachingOutLink}
              href={`https://twitter.com/${twitter}`}
            >
              <svg
                className={s.reachingOutLogo}
                viewBox="0 0 612 612"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M612 116.258a250.714 250.714 0 0 1-72.088 19.772c25.929-15.527 45.777-40.155 55.184-69.411-24.322 14.379-51.169 24.82-79.775 30.48-22.907-24.437-55.49-39.658-91.63-39.658-69.334 0-125.551 56.217-125.551 125.513 0 9.828 1.109 19.427 3.251 28.606-104.326-5.24-196.835-55.223-258.75-131.174-10.823 18.51-16.98 40.078-16.98 63.101 0 43.559 22.181 81.993 55.835 104.479a125.556 125.556 0 0 1-56.867-15.756v1.568c0 60.806 43.291 111.554 100.693 123.104-10.517 2.83-21.607 4.398-33.08 4.398-8.107 0-15.947-.803-23.634-2.333 15.985 49.907 62.336 86.199 117.253 87.194-42.947 33.654-97.099 53.655-155.916 53.655-10.134 0-20.116-.612-29.944-1.721 55.567 35.681 121.536 56.485 192.438 56.485 230.948 0 357.188-191.291 357.188-357.188l-.421-16.253c24.666-17.593 46.005-39.697 62.794-64.861z"
                  fill="#000"
                />
              </svg>
            </a>
            <div className={s.reachingOutItem}>
              <a href={`https://twitter.com/${twitter}`}>@{twitter}</a>
            </div>
          </div>
        </Card>
      </aside>

      <main>
        <h2>Stories</h2>
        {!!stories &&
          stories.map(
            ({ excerpt, frontmatter: { title }, fields: { slug } }) => (
              <Card key={slug}>
                <h2>
                  <Link to={slug}>{title}</Link>
                </h2>
                <p>{excerpt}</p>
              </Card>
            )
          )}
      </main>
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
    talks: github {
      repository(owner: "react-knowledgeable", name: "talks") {
        issues(
          first: 100
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
