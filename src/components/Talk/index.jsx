import React from 'react';
import Avatar from '../Avatar';
import Card from '../Card';
import s from './s.module.scss';

export default props => {
  const { title, url, author } = props;
  return (
    <Card key={title} className={s.talk}>
      <h4 className={s.title}>
        <a href={url}>{title}</a>
      </h4>
      <Avatar className={s.author} {...author} />
      {/** we need to parse talk body (markdown) */}
      {/* <p dangerouslySetInnerHTML={{ __html: talkBody }} /> */}
    </Card>
  );
};
