import * as React from 'react';
import { graphql } from 'gatsby';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';

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
      url,
      twitter,
      titleTemplate,
      footerLinks,
    }}
  >
    <main>
      <h2>{title}</h2>
      <article>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  </Layout>
);

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
        talks
        date
        meetupLink
        issueLink
      }
      html
      fields {
        slug
      }
    }
  }
`;
