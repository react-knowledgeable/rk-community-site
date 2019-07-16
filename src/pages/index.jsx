import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Talk from '../components/Talk';
import Card from '../components/Card';
import parseDate from '../utils/parseDate';
import s from './styles.module.scss';

export default ({
  data: {
    site: {
      siteMetadata: {
        title,
        description,
        url,
        image,
        twitter,
        titleTemplate,
        footerLinks,
      },
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
    frontmatter: { title: meetupTitle, venue, date, meetupLink },
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
        footerLinks,
      }}
    >
      <aside>
        {!!meetups && (
          <React.Fragment>
            <h2>Upcoming Meetups</h2>
            {nextMeetup && (
              <Card key={date}>
                <h3>{meetupTitle}</h3>
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
              </Card>
            )}
          </React.Fragment>
        )}

        <Card>
          <h3>Talk Line-up</h3>
          {nextMeetup &&
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
        <Card>
          <h3>
            <a href="https://github.com/react-knowledgeable/talks/issues/new?assignees=&labels=talk&template=talk.md&title=%E2%9A%A1%EF%B8%8F+how+not+to+get+caught+and+be+eaten">
              <svg
                className={s.submitTalkLogo}
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z" />
                <path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                <path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 0 0-5.01 8.345l-23.913 78.725a20 20 0 0 0 24.476 25.087l80.725-22.361a19.993 19.993 0 0 0 8.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
              </svg>
              <span>Submit a talk</span>
            </a>
          </h3>
        </Card>
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

            <a
              className={s.reachingOutLink}
              href="https://meetup.com/React-Knowledgeable"
            >
              <svg
                className={s.reachingOutLogo}
                fill="none"
                viewBox="0 0 256 212"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M255.761 193.39c-3.223-20.576-41.33-4.709-43.682-27.254-3.33-31.989 44.249-100.932 40.494-127.697-3.372-24.095-19.613-29.144-33.743-29.392-13.728-.248-17.354 1.94-21.994 4.638-2.678 1.551-6.524 4.624-11.864-.453-3.549-3.377-5.893-5.742-9.647-8.737-1.912-1.53-4.959-3.455-10.059-4.206-5.106-.75-11.715 0-15.915 1.799-4.208 1.805-7.508 4.956-10.965 7.958-3.45 3.002-12.211 12.809-20.378 9.19-3.541-1.564-15.534-7.555-24.19-11.3C77.11.706 53.014 12.418 44.338 27.84 31.424 50.78 5.93 140.916 2.07 152.804c-8.655 26.694 10.972 48.453 37.441 47.2 11.192-.532 18.636-4.618 25.706-17.469 4.086-7.42 42.463-107.631 45.317-112.439 2.069-3.484 8.974-8.086 14.832-5.084 5.851 3.003 7.019 9.261 6.156 15.16-1.403 9.537-28.468 70.671-29.509 77.588-1.764 11.761 3.825 18.304 16.037 18.941 8.372.447 16.708-2.563 23.331-15.046 3.704-6.982 46.388-92.437 50.163-98.144 4.151-6.26 7.487-8.32 11.715-8.1 3.28.163 8.529 1.005 7.218 10.833-1.289 9.637-35.606 72.343-39.205 87.7-4.816 20.527 6.453 41.315 25.018 50.414 11.843 5.799 63.649 15.74 59.47-10.968"
                  fill="#000"
                />
              </svg>
            </a>
            <div className={s.reachingOutItem}>
              <a href="https://meetup.com/React-Knowledgeable">
                React Knowledgeable
              </a>
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
                  <a href={`/story${slug}`}>{title}</a>
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
        footerLinks {
          name
          link
        }
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
    return new Date(date) >= now;
  });
}
