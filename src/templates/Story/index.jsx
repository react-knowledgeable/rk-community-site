import * as React from 'react';
import { graphql } from 'gatsby';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';

export default ({
  data: {
    markdownRemark: {
      frontmatter: { title, speaker, date },
      html,
    },
  },
}) => (
  <Layout>
    <main>
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        speaker
        date
      }
      html
      fields {
        slug
      }
    }
  }
`;
