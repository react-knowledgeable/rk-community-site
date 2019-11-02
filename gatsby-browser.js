import ReactDOM from 'react-dom';

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.hydrate(element, container, callback);
    ReactDOM.createRoot(container).render(element);
  };
};
