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
                  <h3>{name}</h3>
                  <Card className={s.topicCard}>
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
