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
                <React.Fragment key={`label-${name}`}>
                  <Card className={s.topicCard}>
                    <h3>{name}</h3>
                    {!!issues &&
                      issues.map(({ title, body, url }) => (
                        <React.Fragment>
                          <h4>
                            <a href={url}>{title}</a>
                          </h4>
                          <p className={s.topicIntro}>{parseBodyText(body)}</p>
                        </React.Fragment>
                      ))}
                  </Card>
                </React.Fragment>
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
        <a className={s.submitTalk} href="https://github.com/react-knowledgeable/react-knowledgeable-talks/issues/new?assignees=&labels=talk&template=talk.md&title=%E2%9A%A1%EF%B8%8F+let%27s+talk+about+this">
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
