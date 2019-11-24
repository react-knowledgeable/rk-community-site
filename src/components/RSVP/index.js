import React from 'react';
import axios from 'axios';
import qs from 'query-string';
import s from './s.module.scss';
import githubLogo from './GitHub-Mark-Light-64px.png';

export default ({ eventId, calendarLink }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    dispatch({ type: 'REQUEST_STATUS' });
    const token = getToken();
    if (!token) {
      dispatch({
        type: 'RECEIVE_AUTH',
        payload: {
          authStatus: false,
        },
      });
      return;
    }
    dispatch({
      type: 'RECEIVE_AUTH',
      payload: {
        authStatus: true,
      },
    });
    getRSVPStatus(eventId, token).then(isGoing => {
      dispatch({ type: 'RECEIVE_RSVP', payload: { rsvpStatus: isGoing } });
    });
  }, []);

  async function sendRSVP(isGoing) {
    try {
      dispatch({ type: 'SEND_RSVP', payload: { rsvpStatus: isGoing } });
      if (isGoing) {
        await insertAttendee({ eventId });
      } else {
        await removeAttendee({ eventId });
      }
      dispatch({ type: 'RECEIVE_RSVP', payload: { rsvpStatus: isGoing } });
    } catch (e) {
      // ??
    }
  }

  return taggedSum(
    state,
    {
      isWorking: () => <p>Hard at work...</p>,
      isGoing: () => (
        <React.Fragment>
          <p>
            See you there :) Would you like to{' '}
            <a href={calendarLink} target="_blank">
              add this to your calendar
            </a>
            ?
          </p>
          <button onClick={() => sendRSVP(false)} className={s.link}>
            Cannot go anymore :(
          </button>
        </React.Fragment>
      ),
      isAuthed: () => (
        <React.Fragment>
          <button onClick={() => sendRSVP(true)} className={s.link}>
            Click here to sign up
          </button>
          <p className={s.fieldCaption}>
            We will record your attendance using your Github details
          </p>
        </React.Fragment>
      ),
    },
    () => (
      <a href={getGithubURL()} className={s.link}>
        <img src={githubLogo} alt="github-logo" width={20} />
        <b>Login to RSVP</b>
      </a>
    )
  );
};

function insertAttendee({ eventId }) {
  return axios({
    method: 'post',
    url: `/.netlify/functions/airtable`,
    data: {
      eventId,
    },
    headers: {
      Authorization: `token ${getToken()}`,
    },
  });
}

function removeAttendee({ eventId }) {
  return axios({
    method: 'delete',
    url: `/.netlify/functions/airtable`,
    data: {
      eventId,
    },
    headers: {
      Authorization: `token ${getToken()}`,
    },
  });
}

function getGithubURL() {
  const base = process.env.GATSBY_URL || 'http://localhost:8000';
  const from = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: 'e3a62ea68aca5801ec9b',
      state: 'home',
      redirect_uri: `${base}/LoginCallback?from=${from}`,
      scope: 'read:user',
    })
  );
}

function getToken() {
  return localStorage.getItem('RK_auth_token');
}

function getRSVPStatus(eventId, token) {
  return axios({
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
  })
    .then(({ data: { login } }) => {
      return axios({
        method: 'get',
        url: `/.netlify/functions/airtable?eventId=${eventId}&username=${login}`,
      });
    })
    .then(({ data }) => {
      return !!data;
    });
}

function taggedSum(state, pattern, def) {
  if (state.isWorking) return pattern.isWorking();
  if (state.isGoing) return pattern.isGoing();
  if (state.isAuthed) return pattern.isAuthed();
  return def();
}

const initialState = {
  isWorking: false,
  isAuthed: false,
  isGoing: false,
};

function reducer(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case 'REQUEST_STATUS':
      return {
        ...state,
        isWorking: true,
      };
    case 'RECEIVE_AUTH':
      return {
        ...state,
        isWorking: false,
        isAuthed: action.payload.authStatus,
        // if not authed, clear out any stale rsvp status
        isGoing: action.payload.authStatus === false ? false : state.isGoing,
      };
    case 'RECEIVE_RSVP':
      return {
        ...state,
        isWorking: false,
        isAuthed: true,
        isGoing: action.payload.rsvpStatus,
      };
    case 'SEND_RSVP':
      return {
        ...state,
        isWorking: true,
        isGoing: action.payload.rsvpStatus,
      };
    default:
      return state;
  }
}
