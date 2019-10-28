import ReactDOM from 'react-dom';

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.createRoot(container).render(
      typeof callback === 'function' && window === undefined // use window object to check for SSR
        ? callback(element) // callback is by default ReactDOM.hydrate
        : element
    );
  };
};
