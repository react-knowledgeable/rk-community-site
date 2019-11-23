import React from 'react';
import axios from 'axios';
import qs from 'query-string';
import { requestGitHubOAuth } from '../../functions/github';
import s from './s.module.scss';

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
      {!state.submissionSuccess && (
        <button className={s.btn} onClick={requestGitHubOAuth}>
          <b>RSVP</b>
        </button>
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
        <label className={s.formField}>
          <span className={s.fieldLabel}>GitHub Username * </span>
          <p className={s.fieldCaption}>
            if you prefer to hide your attendance, please put our GitHub
            username "react-knowledgeable"
          </p>
          <input
            name="username"
            value={state.username}
            onChange={({ target: { name, value } }) => {
              dispatch({ type: 'input', payload: { name, value } });
            }}
          />
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
