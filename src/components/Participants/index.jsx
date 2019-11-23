import * as React from 'react';
import Avatar from '../../components/Avatar';

const getAvatarProps = username => ({
  avatarUrl: `https://github.com/${username}.png?size=80`,
  url: `https://github.com/${username}`,
  login: username,
});

const Participants = ({ rawParticipants }) => {
  const participants = new Set();
  rawParticipants.map(({ node: { data: { Github_Username: username } } }) => {
    // dedupe
    participants.add(username ? username.toLowerCase() : 'react-knowledgeable');
  });

  return participants.size > 0 ? (
    <>
      <h2>
        <span role="img" aria-label="busts in silhouette">
          👥
        </span>{' '}
        Attendees{' '}
        <span role="img" aria-label="busts in silhouetee">
          👥
        </span>
      </h2>
      {participants.size > 1 ? (
        <p>{participants.size} amazing RK kids are going</p>
      ) : (
        <p>an amazing RK kid is going</p>
      )}
      {/* @TODO: Put this back when we have added the ability for people to hide their profile */
      Array.from(participants).map(username => {
        return <Avatar key={username} {...getAvatarProps(username)} />;
      })}
    </>
  ) : null;
};

export default Participants;
