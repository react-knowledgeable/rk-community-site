import * as React from 'react';
import Avatar from '../../components/Avatar';

const getAvatarProps = username => ({
  avatarUrl: `https://github.com/${username}.png?size=80`,
  url: `https://github.com/${username}`,
  login: username,
});

const Participants = ({ rawParticipants }) => {
  const participants = new Set();
  rawParticipants.map(({ node: { Github_Username: username } }) => {
    // dedupe
    participants.add(username ? username.toLowerCase() : 'react-knowledgeable');
  });
  const numberOfSecretParticipants = rawParticipants.filter(
    ({ node: { Github_Username: username } }) =>
      !username || username === 'react-knowledgeable'
  ).length;

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
      <p>
        {participants.size > 1 ? (
          <span>{participants.size} amazing RK kids are going</span>
        ) : (
          <span>an amazing RK kid is going</span>
        )}
        {participants.size && numberOfSecretParticipants > 0 && (
          <span>
            , {numberOfSecretParticipants} more are going but prefer not to let
            us know.
          </span>
        )}
      </p>
      {/* @TODO: Put this back when we have added the ability for people to hide their profile */
      Array.from(participants).map(username => {
        return <Avatar key={username} {...getAvatarProps(username)} />;
      })}
    </>
  ) : null;
};

export default Participants;
