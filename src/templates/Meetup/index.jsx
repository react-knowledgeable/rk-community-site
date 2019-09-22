import * as React from 'react';
import { graphql } from 'gatsby';
import r2r from 'rehype-react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';
import SubmitTalkButton from '../../components/SubmitTalkButton';
import Talk from '../../components/Talk';
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
  data: {
    site: {
      siteMetadata: {
        title: siteTitle,
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
        speaker,
        date,
        cover,
        venue,
        venueLogo,
        venueLink,
        sponsors,
        talks: talkIssueIds,
        issueLink,
      },
      html,
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
  const reactUpdatesSectionsHTML = astToHtml({
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
        footerLinks,
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
          <h1>{title}</h1>
          <i>{parseDate(date)}</i>
        </section>
        <section>
          <h2>🎉 Venue 🎉</h2>
          {venueLogo ? (
            <a href={venueLink} target="_blank" className={s.venueLink}>
              <img src={venueLogo} style={{ alignSelf: 'center' }} />
            </a>
          ) : (
            <h3>
              <a href={venueLink} target="_blank">
                {venue}
              </a>
            </h3>
          )}
        </section>
        {sponsors &&
          sponsors.length &&
          sponsors.map(({ sponsor, sponsorLogo, sponsorLink }) => (
            <section>
              <h2>🎊 Sponsor 🎊</h2>
              {sponsorLogo ? (
                <a href={sponsorLink} target="_blank" className={s.venueLink}>
                  <img src={sponsorLogo} style={{ alignSelf: 'center' }} />
                </a>
              ) : (
                <h3>
                  <a href={sponsorLink} target="_blank">
                    {sponsor}
                  </a>
                </h3>
              )}
            </section>
          ))}
        <section>
          <h2>👫 Friends of RK 👭</h2>
          <ul>
            {footerLinks.map(({ link, name }) => (
              <li key={link}>
                <a href={link}>{name}</a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>🌟 Stage opens 🌟</h2>
          <SubmitTalkButton className={s.submitTalkMeetup}>
            {`Reference `}
            <a href={issueLink}>
              <code>#{issueLink.split('/issues/')[1]}</code>
            </a>
          </SubmitTalkButton>
        </section>
      </aside>
      <main>
        {reactUpdatesSectionsHTML}
        <section>
          <h2>🎙 Talk Line-up 🎙</h2>
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
  query MeetupQuery($slug: String!) {
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
        venueLink
        sponsors {
          sponsor
          sponsorLogo
          sponsorLink
        }
        talks
        date
        meetupLink
        issueLink
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
