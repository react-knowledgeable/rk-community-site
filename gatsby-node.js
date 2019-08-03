const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

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
    fromPath: '/speak',
    toPath: 'https://github.com/react-knowledgeable/talks',
    isPermanent: true,
    redirectInBrowser: true,
  });
  createRedirect({
    fromPath: '/meetup',
    toPath: 'https://meetup.com/React-Knowledgeable',
    isPermanent: true,
    redirectInBrowser: true,
  });
  createRedirect({
    fromPath: '/hello',
    toPath: 'https://hello-rk-lightning.netlify.com/',
    isPermanent: true,
    redirectInBrowser: true,
  });
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
        createPage({
          path: `${meetup.fields.slug}`,
          component: meetupTemplate,
          context: {
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
              issues(first: 100, labels: ["talk"]) {
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
