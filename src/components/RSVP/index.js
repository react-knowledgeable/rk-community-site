import React from 'react';
import axios from 'axios';
import qs from 'query-string';
import s from './s.module.scss';
import githubLogo from './GitHub-Mark-Light-64px.png';

const initialState = {
  name: '',
  username: '',
  submissionError: '',
  submitting: false,
  submissionSuccess: false,
};
function reducer(state = initialState, action = { type: '' }) {
  switch (action.type) {
    case 'input':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        submission_error: '',
        submissionSuccess: false,
      };
    case 'submit':
      return {
        ...state,
        submissionError: '',
        submissionSuccess: false,
        submitting: true,
      };
    case 'submission_error':
      return {
        ...state,
        submissionError: action.payload.error,
        submissionSuccess: false,
        submitting: false,
      };
    case 'submission_success':
      return {
        ...state,
        name: '',
        username: '',
        submissionSuccess: true,
        submissionError: '',
        submitting: false,
      };
    default:
      return state;
  }
}

export default ({ eventId, calendarLink }) => {
  React.useEffect(() => {
    getRSVPStatus(eventId).then(isGoing => console.log(isGoing));
  }, []);
  const [formVisible, setFormVisible] = React.useState(false);
  const [nameError, setNameError] = React.useState('');
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const handleSubmit = e => {
    e.preventDefault();
    if (!state.name) {
      return setNameError('Required');
    } else {
      dispatch({ type: 'submit' });
      insertAttendee({ name: state.name, username: state.username, eventId })
        .then(() => {
          dispatch({ type: 'submission_success' });
          setFormVisible(false);
        })
        .catch(() => {
          dispatch({
            type: 'submission_error',
            payload: {
              error: "Oops, we couldn't register you, please try again.",
            },
          });
        });
    }
  };
  return (
    <React.Fragment>
      <a href={getGithubURL()} className={s.link}>
        <img src={githubLogo} alt="github-logo" width={20} />
        <b>RSVP with GitHub</b>
      </a>
      {!state.submissionSuccess && (
        <>
          <p className={s.fieldLabel}>- Or -</p>
          <button
            className={s.btn}
            onClick={() => setFormVisible(!formVisible)}
          >
            <b>RSVP</b>
          </button>
          <p className={s.fieldCaption}>
            If you don't RSVP via GitHub, you won't be able to change your RSVP!
          </p>
        </>
      )}
      <form className={formVisible ? s.form : s.hidden} onSubmit={handleSubmit}>
        <label className={s.formField}>
          <span className={s.fieldLabel}>Name *</span>
          <input
            name="name"
            value={state.name}
            onChange={({ target: { name, value } }) => {
              dispatch({ type: 'input', payload: { name, value } });
            }}
          />
          {nameError && <span className={s.fieldError}>{nameError}</span>}
        </label>
        {state.submissionError && (
          <p className={s.submissionError}>{state.submissionError}</p>
        )}
        {/* Ask if they want their name to be shown? */}
        <button className={s.btn} disabled={state.submitting}>
          <b>Sign Me Up</b>
        </button>
      </form>
      {state.submissionSuccess && (
        <p>
          See you there :) Would you like to{' '}
          <a href={calendarLink} target="_blank">
            add this to your calendar
          </a>
          ?
        </p>
      )}
    </React.Fragment>
  );
};

function insertAttendee({ eventId, username, name }) {
  return axios.post(`/.netlify/functions/airtable`, {
    name,
    username,
    eventId,
  });
}

function getGithubURL() {
  const base = process.env.GATSBY_URL || 'http://localhost:8000';
  return (
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: 'e3a62ea68aca5801ec9b',
      state: 'home',
      redirect_uri: `${base}/LoginCallback`,
      scope: 'read:user',
    })
  );
}

function getRSVPStatus(eventId) {
  const token = localStorage.getItem('RK_auth_token');
  if (!token) {
    return Promise.resolve(false);
  }
  return axios({
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
  })
    .then(({ login }) => {
      return axios({
        method: 'get',
        url: `/.netlify/functions/airtable?eventId=${eventId}&username=${login}`,
      });
    })
    .then(res => {
      if (res.length > 0) return true;
      return false;
    });
}
