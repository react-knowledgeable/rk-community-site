module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'React Knowledgeable',
    titleTemplate:
      '%s · Fun and friendly podium to share what we learn about React.',
    description:
      'React Knowledgeable is a fun and friendly podium to share what we learn about React.',
    url: 'https://reactknowledgeable.org', // No trailing slash allowed!
    image: '/logo.png', // Path to your image you placed in the 'static' folder
    twitter: 'reknowledgeable',
    footerLinks: [
      {
        name: 'SingaporeCSS',
        link: 'https://singaporecss.github.io',
      },
      {
        name: 'SingaporeJS',
        link: 'https://www.singaporejs.org/talk.js/',
      },
      {
        name: 'ReactJS Singapore',
        link: 'https://www.meetup.com/React-Singapore/',
      },
      {
        name: 'Engineers SG',
        link: 'https://engineers.sg/',
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-136098806-2',
      },
    },
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
        plugins: [
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              usePrefix: [`oembed`, `twitter`],
              providers: {
                include: ['Twitter'],
              },
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: 'GitHub',
        fieldName: 'github',
        url: 'https://api.github.com/graphql',
        headers: {
          Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
        },
        fetchOptions: {},
      },
    },
  ],
};
