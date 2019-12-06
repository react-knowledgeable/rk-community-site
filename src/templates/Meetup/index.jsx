import * as React from 'react';
import cx from 'classnames';
import { graphql } from 'gatsby';
import r2r from 'rehype-react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';
import RSVP from '../../components/RSVP';
import Participants from '../../components/Participants';
import ExternalLinkIcon from '../../components/ExternalLinkIcon';
import { modes, slideTo } from '../../utils/remote';
import s from './s.module.scss';

const buildSections = elements => {
  const sectionTags = ['h2', 'h3'];
  const sections = [];
  return elements
    .filter(node => node.type === 'element')
    .reduce((acc, cur) => {
      if (!acc.length || sectionTags.includes(cur.tagName)) {
        acc.push({
          tagName: 'section',
          type: 'element',
          properties: {},
          children: [cur],
        });
      } else {
        acc[acc.length - 1].children.push(cur);
      }
      return acc;
    }, sections);
};

const astToHtml = new r2r({
  createElement: React.createElement,
  Fragment: React.Fragment,
}).Compiler;

export default ({
  location,
  pageContext: { id },
  data: {
    allRkAttendee: { edges: rawParticipants },
    site: {
      siteMetadata: {
        description,
        url,
        image,
        twitter,
        titleTemplate,
        footerLinks,
      },
    },
    markdownRemark: {
      frontmatter: {
        title,
        date,
        venue,
        venueLogo,
        venueLink,
        venueAddress,
        venueAddressLink,
        sponsors,
        talks: talkIssueIds,
        calendarLink,
      },
      htmlAst,
    },
    talks: {
      repository: {
        issues: { nodes: talks },
      },
    },
  },
}) => {
  const [mode, setMode] = React.useState(modes.article);
  React.useEffect(() => {
    if ([modes.presentation].includes(mode)) {
      const pages = document.querySelectorAll('section');
      pages &&
        pages.length &&
        pages[location.hash.slice(1) || 0].scrollIntoView({
          behavior: 'smooth',
        });
    }
  }, [mode, location]);
  const toggleMode = newMode =>
    newMode === mode ? setMode(modes.article) : setMode(newMode);
  const sections = buildSections(htmlAst.children);
  const content = astToHtml({
    type: 'root',
    children: sections,
  });
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
      className={s[mode]}
    >
      <KeyHandler
        keyEventName={KEYPRESS}
        keyValue="p"
        onKeyHandle={() => toggleMode(modes.presentation)}
      />
      <KeyHandler
        keyEventName={KEYPRESS}
        keyValue="a"
        onKeyHandle={() => toggleMode(modes.article)}
      />
      {[modes.presentation, modes.speaker].includes(mode) && (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <KeyHandler
              key={`key-handler-${i}`}
              keyEventName={KEYPRESS}
              keyValue={`${i}`}
              onKeyHandle={() => slideTo(i, location)}
            />
          ))}
          <KeyHandler
            keyEventName={KEYPRESS}
            keyValue="k"
            onKeyHandle={() => slideTo('prev', location)}
          />
          <KeyHandler
            keyEventName={KEYPRESS}
            keyValue="j"
            onKeyHandle={() => slideTo('next', location)}
          />
          <KeyHandler
            keyEventName={KEYPRESS}
            keyValue=" "
            onKeyHandle={() => slideTo('next', location)}
          />
        </>
      )}
      <aside>
        <section>
          <h2>
            <span role="img" aria-label="celebration">
              🎉
            </span>{' '}
            Venue{' '}
            <span role="img" aria-label="celebration">
              🎉
            </span>
          </h2>
          {venueLogo ? (
            <a
              href={venueLink}
              target="_blank"
              rel="noopener noreferrer"
              className={s.venueLink}
            >
              <img
                src={venueLogo}
                alt={venue}
                style={{ alignSelf: 'center', maxWidth: '10rem' }}
              />
            </a>
          ) : (
            <h3>
              <a href={venueLink} target="_blank" rel="noopener noreferrer">
                {venue}
              </a>
            </h3>
          )}
          {venueAddress && (
            <p>
              {venueAddress}
              {venueAddressLink && (
                <>
                  ,{' '}
                  <a href={venueAddressLink} target="_blank">
                    Google Map
                  </a>
                  <ExternalLinkIcon />
                </>
              )}
            </p>
          )}
        </section>
        {sponsors &&
          sponsors.length &&
          sponsors.map(({ sponsor, sponsorLogo, sponsorLink }) => (
            <section>
              <h2>
                <span role="img" aria-label="confetti">
                  🎊
                </span>{' '}
                Sponsor{' '}
                <span role="img" aria-label="confetti">
                  🎊
                </span>
              </h2>
              {sponsorLogo ? (
                <a
                  href={sponsorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.venueLink}
                >
                  <img
                    src={sponsorLogo}
                    style={{ alignSelf: 'center' }}
                    alt={sponsor}
                  />
                </a>
              ) : (
                <h3>
                  <a
                    href={sponsorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sponsor}
                  </a>
                </h3>
              )}
            </section>
          ))}
        <section>
          <h2>
            <span role="img" aria-label="holding hands">
              👫
            </span>{' '}
            Friends of RK{' '}
            <span role="img" aria-label="holding hands">
              👭
            </span>
          </h2>
          <ul>
            {footerLinks.map(({ link, name }) => (
              <li key={link}>
                <a href={link}>{name}</a>
              </li>
            ))}
          </ul>
        </section>
      </aside>
      <main>
        <section>
          <h1>{title}</h1>
          <p>
            <i>{parseDate(date)}, 7:30pm</i>
          </p>
        </section>
        <div className={cx(s.doNotPresent, s.attendees)}>
          <Participants rawParticipants={rawParticipants} />
        </div>
        <div className={s.doNotPresent}>
          <RSVP eventId={id} calendarLink={calendarLink} />
        </div>
        {content && content}
        <section>
          <h2>
            <span role="img" aria-label="studio microphone">
              🎙
            </span>{' '}
            Talk Line-up{' '}
            <span role="img" aria-label="studio microphone">
              🎙
            </span>
          </h2>
          <ul>
            {talkIssueIds &&
              talkIssueIds.length &&
              talkIssueIds.map(talkIssueId => {
                const talkData = talks.find(
                  ({ number }) => number === talkIssueId
                );
                const { title, url } = talkData;
                return (
                  <li key={title}>
                    <a href={url} key={title}>
                      {title}
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>
      </main>
    </Layout>
  );
};

export const pageQuery = graphql`
  query MeetupQuery($slug: String!, $id: String!) {
    allRkAttendee(filter: { Event_ID: { eq: $id } }) {
      totalCount
      edges {
        node {
          Github_Username
        }
      }
    }
    # allAirtable(filter: { data: { Event_ID: { eq: $id } } }) {
    #   totalCount
    #   edges {
    #     node {
    #       data {
    #         Github_Username
    #       }
    #     }
    #   }
    # }
    site {
      siteMetadata {
        title
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        venue
        venueLogo
        venueAddress
        venueAddressLink
        venueLink
        sponsors {
          sponsor
          sponsorLogo
          sponsorLink
        }
        talks
        date
        issueLink
        calendarLink
      }
      html
      htmlAst
      fields {
        slug
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
  }
`;
