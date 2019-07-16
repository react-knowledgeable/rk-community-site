import * as React from 'react';
import { graphql } from 'gatsby';
import parseDate from '../../utils/parseDate';
import Layout from '../../components/Layout';

export default ({
  data: {
    talks: {
      repository: {
        issue: {
          author: { avatarUrl, login },
          title,
          number,
          bodyHTML,
          createdAt,
        },
      },
    },
  },
}) => (
  <Layout>
    <main>
      <h2>{title}</h2>
      <p>
        <i>{login}</i> on {parseDate(createdAt)}
      </p>
      <article>
        <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      </article>
    </main>
  </Layout>
);

export const pageQuery = graphql`
  query TalkQuery($number: Int!) {
    talks: github {
      repository(owner: "react-knowledgeable", name: "talks") {
        issue(number: $number) {
          author {
            avatarUrl
            login
          }
          title
          number
          bodyHTML
          createdAt
        }
      }
    }
  }
`;
