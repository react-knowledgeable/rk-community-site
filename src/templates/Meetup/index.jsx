import * as React from 'react';
import { graphql } from 'gatsby';
import r2r from 'rehype-react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';
import Talk from '../../components/Talk';
import s from './s.module.scss';

const modes = {
  article: 'article',
  presentation: 'presentation',
  speaker: 'speaker',
};

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
        talks: talkIssueIds,
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
  const toggleMode = newMode =>
    newMode === mode ? setMode(modes.article) : setMode(newMode);
  const sections = buildSections(htmlAst.children);
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
        keyValue="s"
        onKeyHandle={() => toggleMode(modes.speaker)}
      />
      <aside>
        <section>
          <h1>{title}</h1>
          <i>{parseDate(date)}</i>
        </section>
        <section>
          <h2>🎉 Venue sponsor 🎉</h2>
          {venueLogo ? (
            <img src={venueLogo} style={{ alignSelf: 'center' }}></img>
          ) : (
            <h3>{venue}</h3>
          )}
        </section>
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
      </aside>
      <main>
        {mode === modes.presentation ? (
          <>
            {astToHtml({ type: 'root', children: sections })}
            <section>
              <h2>🎙 Talk Line-up 🎙</h2>
            </section>
            <section>
              {talkIssueIds.map(talkIssueId => {
                const talkData = talks.find(
                  ({ number }) => number === talkIssueId
                );
                return <Talk {...talkData} key={talkData.number} />;
              })}
            </section>
          </>
        ) : (
          <article dangerouslySetInnerHTML={{ __html: html }}></article>
        )}
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
