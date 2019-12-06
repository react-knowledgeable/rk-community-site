const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const axios = require('axios');

// exports.sourceNodes = async ({ actions, reporter, createContentDigest }) => {
//   const { createNode } = actions;
//   const host =
//     process.env.NODE_ENV === 'production'
//       ? `https://reactknowledgeable.org`
//       : ``;
//   const data = await axios.get(`${host}/.netlify/functions/airtable`);
//   if (data.status >= 200 && data.status < 300) {
//     data.data.forEach(datum =>
//       createNode({
//         ...datum,
//         id: `${datum.Name}-${datum['Created Date']}`,
//         parent: null,
//         children: [],
//         internal: {
//           type: 'RKAttendee',
//           contentDigest: createContentDigest(datum),
//         },
//       })
//     );
//     reporter.success('Retrieved attendee data');
//   } else {
//     reporter.error('Error encountered retrieving attendees');
//   }
//   return;
// };

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  createRedirect({
    fromPath: '/story/stories/introducing-rk-lightning-to-this-town/',
    toPath: '/stories/introducing-rk-lightning-to-this-town/',
    isPermanent: true,
    redirectInBrowser: true,
  });
  createRedirect({
    fromPath: '/story/stories/baby-react-knowledgeable-is-born/',
    toPath: '/stories/baby-react-knowledgeable-is-born/',
    isPermanent: true,
    redirectInBrowser: true,
  });

  const talkTemplate = path.resolve(`./src/templates/Talk/index.jsx`);
  const storyTemplate = path.resolve(`./src/templates/Story/index.jsx`);
  const meetupTemplate = path.resolve(`./src/templates/Meetup/index.jsx`);
  // const speakerTemplate = path.resolve(`./src/templates/Speaker/index.jsx`);

  return Promise.all([
    graphql(
      `
        {
          stories: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/stories/" } }
          ) {
            nodes {
              fields {
                slug
              }
            }
          }
          meetups: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/meetups/" } }
          ) {
            nodes {
              fields {
                slug
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const {
        stories: { nodes: stories },
        meetups: { nodes: meetups },
      } = result.data;

      stories.forEach(story => {
        createPage({
          path: `${story.fields.slug}`,
          component: storyTemplate,
          context: {
            slug: story.fields.slug,
          },
        });
      });
      meetups.forEach(meetup => {
        const id = meetup.fields.slug.replace(/[^\d]+/g, ''); // to remove everything except the numbers
        createPage({
          path: `${meetup.fields.slug}`,
          component: meetupTemplate,
          context: {
            id,
            slug: meetup.fields.slug,
          },
        });
      });
    }),
    graphql(
      `
        {
          talks: github {
            repository(owner: "react-knowledgeable", name: "talks") {
              issues(last: 100, labels: ["talk"]) {
                nodes {
                  number
                }
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const {
        talks: {
          repository: {
            issues: { nodes: talks },
          },
        },
      } = result.data;

      talks.forEach(talk => {
        createPage({
          path: `/talks/${talk.number}`,
          component: talkTemplate,
          context: {
            number: talk.number,
          },
        });
      });
    }),
  ]);
};
