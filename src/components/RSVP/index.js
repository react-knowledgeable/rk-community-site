import React from 'react';
import s from './s.module.scss';

export default () => {
  const [formVisible, setFormVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [username, setUsername] = React.useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!name) {
      return setNameError('Required');
    } else {
      // handle submit
    }
  };
  return (
    <React.Fragment>
      <button className={s.btn} onClick={() => setFormVisible(!formVisible)}>
        RSVP
      </button>
      <form className={!formVisible && s.hidden} onSubmit={handleSubmit}>
        <label className={s.formField}>
          <span className={s.fieldLabel}>Name *</span>
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {nameError && <span className={s.fieldError}>{nameError}</span>}
        </label>
        <label className={s.formField}>
          <span className={s.fieldLabel}>Github Username (optional)</span>
          <input
            name="github_username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        {/* Ask if they want their name to be shown? */}
        <button className={s.btn}>Sign Me Up</button>
      </form>
    </React.Fragment>
  );
};
