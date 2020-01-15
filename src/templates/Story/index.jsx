import * as React from 'react';
import { graphql } from 'gatsby';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';
import s from './s.module.scss';

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
      },
    },
    markdownRemark: {
      frontmatter: { title, speaker, date, cover },
      html,
    },
  },
}) => (
  <Layout
    {...{
      title,
      description,
      image,
      coverImage:
        cover && cover.childImageSharp ? cover.childImageSharp.sizes.src : '',
      url,
      twitter,
      titleTemplate,
    }}
    className={s.storyLayout}
  >
    <main className={s.story}>
      <h2>{title}</h2>
      <p>
        <i>{speaker}</i> on {parseDate(date)}
      </p>
      <article>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  </Layout>
);

export const pageQuery = graphql`
  query StoryQuery($slug: String!) {
    site {
      siteMetadata {
        title
        description
        url
        twitter
        titleTemplate
        image
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        speaker
        date
        cover {
          childImageSharp {
            sizes(maxWidth: 720) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
      html
      fields {
        slug
      }
    }
  }
`;
