import Airtable from 'airtable';

export const handler = async (event, _, callback) => {
  try {
    let attendees = [];
    const { eventId, name, username } = JSON.parse(event.body);
    const atClient = _configureAirtable();
    await atClient('Attendees')
      .create([
        {
          fields: {
            Name: name,
            'Github Username': username,
            'Event ID': eventId,
            Type: 'Attendee',
            'Created Date': new Date().toISOString(),
          },
        },
      ])
    callback(null, {
      status: 200,
      body: JSON.stringify(attendees),
    });
  } catch (e) {
    callback(null, {
      status: 500,
      body: e,
    });
  }
};

function _configureAirtable() {
  Airtable.configure({ apiKey: '__AIRTABLE_API_KEY__' });
  return Airtable.base('__AIRTABLE_BASE_ID__');
}
