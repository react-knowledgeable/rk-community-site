import React from 'react';
import axios from 'axios';
import qs from 'query-string';
import s from './s.module.scss';
import githubLogo from './GitHub-Mark-Light-64px.png';
import AuthContext from '../../context/auth';

export default ({ eventId, calendarLink }) => {
  const { token } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const handleError = makeHandleError(dispatch);
  React.useEffect(() => {
    dispatch({ type: 'REQUEST_STATUS' });
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
    getRSVPStatus(eventId, token)
      .then(rsvpName => {
        dispatch({
          type: 'RECEIVE_RSVP',
          payload: { rsvpStatus: !!rsvpName, rsvpName },
        });
      })
      .catch(err => {
        handleError(err);
      });
  }, []);

  async function sendRSVP(isGoing) {
    try {
      let rsvpName = '';
      dispatch({ type: 'SEND_RSVP', payload: { rsvpStatus: isGoing } });
      if (isGoing) {
        const {
          data: { name },
        } = await insertAttendee({ eventId, token });
        rsvpName = name;
      } else {
        await removeAttendee({ eventId, token });
      }
      dispatch({
        type: 'RECEIVE_RSVP',
        payload: { rsvpStatus: isGoing, rsvpName },
      });
    } catch (e) {
      handleError(e);
    }
  }

  return taggedSum(
    state,
    {
      isError: err => <p>{err}</p>,
      isWorking: () => <p>Hard at work...</p>,
      isGoing: name => (
        <React.Fragment>
          <p>
            See you there {name} :) Would you like to{' '}
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

function insertAttendee({ eventId, token }) {
  return axios({
    method: 'post',
    url: `/.netlify/functions/airtable`,
    data: {
      eventId,
    },
    headers: {
      Authorization: `token ${token}`,
    },
  });
}

function removeAttendee({ eventId, token }) {
  return axios({
    method: 'delete',
    url: `/.netlify/functions/airtable`,
    data: {
      eventId,
    },
    headers: {
      Authorization: `token ${token}`,
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
      if (data) return data.Name;
    });
}

function taggedSum(state, pattern, def) {
  if (state.error) return pattern.isError(state.error);
  if (state.isWorking) return pattern.isWorking();
  if (state.isGoing) return pattern.isGoing(state.rsvpName);
  if (state.isAuthed) return pattern.isAuthed();
  return def();
}

const initialState = {
  isWorking: false,
  isAuthed: false,
  isGoing: false,
  rsvpName: '',
  error: '',
};

function reducer(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case 'REQUEST_STATUS':
      return {
        ...state,
        isWorking: true,
        error: '',
      };
    case 'RECEIVE_AUTH':
      return {
        ...state,
        isWorking: false,
        isAuthed: action.payload.authStatus,
        // if not authed, clear out any stale rsvp status
        isGoing: action.payload.authStatus === false ? false : state.isGoing,
        rsvpName: action.payload.authStatus === false ? '' : state.rsvpName,
      };
    case 'RECEIVE_RSVP':
      return {
        ...state,
        isWorking: false,
        isAuthed: true,
        isGoing: action.payload.rsvpStatus,
        rsvpName: action.payload.rsvpName,
      };
    case 'SEND_RSVP':
      return {
        ...state,
        isWorking: true,
        isGoing: action.payload.rsvpStatus,
      };
    case 'RECEIVE_ERROR':
      return {
        ...state,
        isWorking: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

function makeHandleError(dispatch) {
  return function handleError(err) {
    const { response } = err;
    if (response) {
      const { data } = response;
      const errorMessage =
        typeof data === 'string' ? data : 'Something went wrong :(';
      dispatch({
        type: 'RECEIVE_ERROR',
        payload: { error: errorMessage },
      });
    } else {
      dispatch({
        type: 'RECEIVE_ERROR',
        payload: { error: 'Something went wrong :(' },
      });
    }
  };
}
