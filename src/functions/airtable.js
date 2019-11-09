import Airtable from 'airtable';

export const handler = async (event, _, callback) => {
  try {
    const atClient = _configureAirtable();
    switch(event.httpMethod) {
      case "POST":
        insertAttendee(atClient, event, callback)
        break
      case "GET":
        retrieveAttendees(atClient, event, callback)
        break
      default:
        callback(Error({ message: errMessage }), {
          status: 405,
          body: errMessage,
        });
    }
  } catch (e) {
    callback(Error(e), {
      status: 500,
      body: e,
    });
  }
};

function retrieveAttendees(Client, event, callback) {
  let attendees = [];
    const {eventId} = JSON.parse(event.body)
    await Client('Attendees')
      .select({
        filterByFormula: `SEARCH("${eventId}",{Event ID})`,
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach(function(record) {
          attendees.push(record.fields);
        });
        fetchNextPage();
      });
    callback(null, {
      status: 200,
      body: JSON.stringify(attendees),
    });
}

function insertAttendee(Client, event, callback) {
  if (event.httpMethod !== "POST") {
    const errMessage = "Unsupported method"
    return callback(Error({ message: errMessage }), {
      status: 405,
      body: errMessage,
    });
  }
  const { eventId, name, username } = JSON.parse(event.body);
  await Client('Attendees')
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
    body: JSON.stringify({ name, eventId }),
  });
}

function _configureAirtable() {
  Airtable.configure({ apiKey: '__AIRTABLE_API_KEY__' });
  return Airtable.base('__AIRTABLE_BASE_ID__');
}
