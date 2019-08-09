import React from 'react';
import Avatar from '../Avatar';
import Card from '../Card';

export default props => {
  const { title, url, author } = props;
  return (
    <Card key={title}>
      <h4>
        <a href={url}>{title}</a>
      </h4>
      <Avatar {...author} />
      {/** we need to parse talk body (markdown) */}
      {/* <p dangerouslySetInnerHTML={{ __html: talkBody }} /> */}
    </Card>
  );
};
