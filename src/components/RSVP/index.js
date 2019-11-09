import React from 'react';
import axios from 'axios';
import s from './s.module.scss';

const initialState = {
  name: '',
  username: '',
  validationError: '',
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
        submissionError: "",
        submissionSuccess: false,
        submitting: true
      }
    case 'submission_error':
      return {
        ...state,
        submissionError: action.payload.error,
        submissionSuccess: false,
        submitting: false
      };
    case 'submission_success':
      return {
        ...state,
        name: '',
        username: '',
        submissionSuccess: true,
        submissionError: '',
        submitting: false
      };
    default:
      return state;
  }
}

export default ({ eventId }) => {
  const [formVisible, setFormVisible] = React.useState(false);
  const [nameError, setNameError] = React.useState('');
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const handleSubmit = e => {
    e.preventDefault();
    if (!state.name) {
      return setNameError('Required');
    } else {
      dispatch({type: 'submit'})
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
        <button className={s.btn} onClick={() => setFormVisible(!formVisible)}>
          <b>RSVP</b>
        </button>
      )}
      <form
        className={formVisible ? undefined : s.hidden}
        onSubmit={handleSubmit}
      >
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
          <span className={s.fieldLabel}>Github Username (optional)</span>
          <input
            name="username"
            value={state.username}
            onChange={({ target: { name, value } }) => {
              dispatch({ type: 'input', payload: { name, value } });
            }}
          />
        </label>
        {state.submissionError && <p className={s.submissionError}>{state.submissionError}</p>}
        {/* Ask if they want their name to be shown? */}
        <button className={s.btn} disabled={state.submitting}><b>Sign Me Up</b></button>
      </form>
      {state.submissionSuccess && <p>See you there :)</p>}
    </React.Fragment>
  );
};

function insertAttendee({ eventId, username, name }) {
  return axios.post(
    `/.netlify/functions/airtable`,
    {
      name,
      username,
      eventId,
    }
  );
}
