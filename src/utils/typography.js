import T from 'typography';

const typography = new T({
  baseFontSize: '18px',
  baseLineHeight: 1.7,

  googleFonts: [
    {
      name: 'IBM Plex Mono',
      styles: ['700', '700i', '400', '400i'],
    },
  ],
  headerFontFamily: ['IBM Plex Mono', 'monospace'],
  bodyFontFamily: ['IBM Plex Mono', 'monospace'],
  overrideStyles: ({ rhythm, adjustFontSizeTo }) => {
    return {
      h1: {
        fontStyle: 'italic',
        marginTop: rhythm(1.2),
        marginBottom: rhythm(1.2),
        lineHeight: 1.8,
      },
      h2: {
        marginTop: rhythm(1.1),
        marginBottom: rhythm(1.1),
        lineHeight: 1.5,
      },
      h3: {
        marginTop: rhythm(1.03),
        marginBottom: rhythm(1.03),
        lineHeight: 1.3,
      },
      h4: {
        marginTop: rhythm(1),
        marginBottom: rhythm(1),
      },
      h5: {
        marginTop: rhythm(0.9),
        marginBottom: rhythm(0.9),
      },
      h6: {
        marginTop: rhythm(0.75),
        marginBottom: rhythm(0.75),
      },
      a: {
        color: 'black',
        textDecoration: 'none',
        borderBottom: '1.5px solid #222',
        paddingBottom: '2px',
        transition: 'all .1s ease',
      },
      'a:hover, a:focus, a:active': {
        borderBottom: '3px solid #222',
      },
    };
  },
});

export default typography;
