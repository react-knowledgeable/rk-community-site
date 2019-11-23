import Airtable from 'airtable';

const ERROR_MSGS = {
  UNSUPPORTED_METHOD: 'Unsupported method',
  UNKNOWN_ERROR: 'Server Error',
};

export const handler = async (event, _, callback) => {
  try {
    const atClient = _configureAirtable();
    switch (event.httpMethod) {
      case 'POST':
        await insertAttendee(atClient, event, callback);
        break;
      case 'GET':
        await retrieveAttendees(atClient, event, callback);
        break;
      default:
        callback(Error({ message: ERROR_MSGS.UNSUPPORTED_METHOD }), {
          status: 405,
          body: ERROR_MSGS.UNSUPPORTED_METHOD,
        });
    }
  } catch (e) {
    callback(Error(e), {
      status: 500,
      body: ERROR_MSGS.UNKNOWN_ERROR,
    });
  }
};

async function retrieveAttendees(Client, event, callback) {
  let attendees = [];
  let selectOpts = {};
  let filterConfig = [];
  const { eventId, username } = event.queryStringParameters;
  if (eventId) {
    filterConfig.push(`SEARCH("${eventId}",{Event ID})`);
  }
  if (username) {
    filterConfig.push(`SEARCH("${username}",{Github Username})`);
  }
  if (filterConfig.length > 0) {
    selectOpts = `AND(${filterConfig.join(',')})`;
  }
  await Client('Attendees')
    .select(selectOpts)
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

async function insertAttendee(Client, event, callback) {
  if (event.httpMethod !== 'POST') {
    return callback(Error({ message: ERROR_MSGS.UNSUPPORTED_METHOD }), {
      status: 405,
      body: ERROR_MSGS.UNSUPPORTED_METHOD,
    });
  }
  const { eventId, name, username } = JSON.parse(event.body);
  await Client('Attendees').create([
    {
      fields: {
        Name: name,
        'Github Username': username,
        'Event ID': eventId,
        Type: 'Attendee',
        'Created Date': new Date().toISOString(),
      },
    },
  ]);
  callback(null, {
    status: 200,
    body: JSON.stringify({ name, eventId }),
  });
}

function _configureAirtable() {
  Airtable.configure({ apiKey: '__AIRTABLE_API_KEY__' });
  return Airtable.base('__AIRTABLE_BASE_ID__');
}
