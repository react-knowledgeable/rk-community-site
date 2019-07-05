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
  const { createPage } = actions;

  // const talkTemplate = path.resolve(`./src/templates/Talk/index.jsx`);
  const storyTemplate = path.resolve(`./src/templates/Story/index.jsx`);
  // const speakerTemplate = path.resolve(`./src/templates/Speaker/index.jsx`);
  // const meetupTemplate = path.resolve(`./src/templates/Meetup/index.jsx`);

  return graphql(
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
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog posts pages.
    const {
      stories: { nodes: stories },
    } = result.data;

    stories.forEach(story => {
      createPage({
        path: `/story${story.fields.slug}`,
        component: storyTemplate,
        context: {
          slug: story.fields.slug,
        },
      });
    });
  });
};
