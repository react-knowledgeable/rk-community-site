import ReactDOM from 'react-dom';

export const replaceHydrateFunction = () => {
  return (element, container) => {
    ReactDOM.createRoot(container).render(element);
  };
};
