module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'React Knowledgeable',
    titleTemplate:
      '%s · Fair and friendly podium to share what we learn about React.',
    description:
      'React Knowledgeable is a fair and friendly podium to share what we learn about React.',
    url: 'https://reactknowledgeable.org', // No trailing slash allowed!
    image: '/logo.png', // Path to your image you placed in the 'static' folder
    twitter: 'reknowledgeable',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: './static/logo.png',

        // WebApp Manifest Configuration
        appName: null, // Inferred with your package.json
        appDescription: null,
        developerName: null,
        developerURL: null,
        dir: 'auto',
        lang: 'en-US',
        background: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        orientation: 'any',
        start_url: '/?homescreen=1',
        version: '1.0',

        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          yandex: false,
          windows: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- excerpt ends -->`,
      },
      plugins: [
        {
          resolve: `@raae/gatsby-remark-oembed`,
          options: {
            usePrefix: true,
            providers: {
              include: ['Twitter'],
            },
          },
        },
      ],
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    `gatsby-plugin-styled-components`,
  ],
};
