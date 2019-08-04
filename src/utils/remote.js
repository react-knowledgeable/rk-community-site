import { navigate } from '@reach/router';

export const modes = {
  article: 'article',
  presentation: 'presentation',
  speaker: 'speaker',
};

export const slideTo = (to, location) => {
  switch (to) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9: {
      navigate(
        `${location.pathname}#${Math.min(
          to,
          document.querySelectorAll('section').length - 1
        )}`
      );
      break;
    }
    case 'prev': {
      const currentHash = location.hash
        ? parseInt(location.hash.slice(1), 10)
        : 0;
      navigate(
        `${location.pathname}#${currentHash >= 1 ? currentHash - 1 : 0}`
      );
      break;
    }
    case 'next': {
      const currentHash = location.hash
        ? parseInt(location.hash.slice(1), 10)
        : 0;
      const pages = document.querySelectorAll('section');
      navigate(
        `${location.pathname}#${
          currentHash >= pages.length - 1 ? pages.length - 1 : currentHash + 1
        }`
      );
      break;
    }
    default: {
      return;
    }
  }
};
