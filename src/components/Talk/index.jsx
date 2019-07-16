import React from 'react';
import Avatar from '../Avatar';
import Card from '../Card';
import s from './s.module.scss';

export default ({
  /*talkBody,*/
  issueUrl,
  talkTitle,
  authorAvatar,
  authorUrl,
}) => (
  <Card key={talkTitle} className={s.talk}>
    <h4 className={s.title}>
      <a href={issueUrl}>{talkTitle}</a>
    </h4>
    <Avatar className={s.author} avatarUrl={authorAvatar} linkUrl={authorUrl} />
    {/** we need to parse talk body (markdown) */}
    {/* <p dangerouslySetInnerHTML={{ __html: talkBody }} /> */}
  </Card>
);
