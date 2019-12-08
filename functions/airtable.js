const Airtable = require('airtable');
const axios = require('axios');

const ERROR_MSGS = {
  UNSUPPORTED_METHOD: 'Unsupported method',
  UNKNOWN_ERROR: 'Server Error',
};

exports.handler = async event => {
  try {
    const atClient = _configureAirtable();
    const atService = AirtableService(atClient);
    switch (event.httpMethod) {
      case 'GET':
        return await retrieveAttendees(atService, event);
      case 'POST':
        return await insertAttendee(atService, event);
      case 'DELETE':
        return await removeAttendee(atService, event);
      default:
        callback(Error({ message: ERROR_MSGS.UNSUPPORTED_METHOD }), {
          statusCode: 405,
          body: ERROR_MSGS.UNSUPPORTED_METHOD,
        });
    }
  } catch (e) {
    callback(Error(e), {
      statusCode: 500,
      body: ERROR_MSGS.UNKNOWN_ERROR,
    });
  }
};

async function retrieveAttendees(Client, event) {
  let attendees;
  const { eventId, username } = event.queryStringParameters;
  if (eventId && username) {
    attendees = await Client.getSingleAttendee({ eventId, username });
  } else if (eventId) {
    attendees = await Client.listAttendees({ eventId });
  } else {
    throw new Error('Missing parameters');
  }
  return {
    statusCode: 200,
    body: JSON.stringify(attendees),
  };
}

async function insertAttendee(Client, event) {
  if (event.httpMethod !== 'POST') {
    return callback(Error({ message: ERROR_MSGS.UNSUPPORTED_METHOD }), {
      statusCode: 405,
      body: ERROR_MSGS.UNSUPPORTED_METHOD,
    });
  }
  const userDetails = await axios({
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: event.headers.authorization,
    },
  });
  const {
    data: { login, name },
  } = userDetails;
  const { eventId } = JSON.parse(event.body);
  const userRecord = await Client.getSingleAttendee({
    eventId,
    username: login,
  });
  if (userRecord && userRecord.id) {
    return {
      statusCode: 409,
      body: `You are already signed up!`,
    };
  }
  await Client.insertAttendee({ eventId, name, login });
  return {
    statusCode: 200,
    body: JSON.stringify({ name, eventId }),
  };
}

async function removeAttendee(Client, event) {
  const { eventId } = JSON.parse(event.body);
  if (!eventId) {
    throw new Error('Missing Parameters: eventId');
  }
  const userDetails = await axios({
    method: 'GET',
    url: 'https://api.github.com/user',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: event.headers.authorization,
    },
  });
  const {
    data: { login },
  } = userDetails;
  const userRecord = await Client.getSingleAttendee({
    eventId,
    username: login,
  });
  if (!userRecord) {
    return {
      statusCode: 404,
      body: 'User not found',
    };
  }
  const { id } = userRecord;
  await Client.removeAttendee({ id });
  return { statusCode: 200 };
}

/****** UTILS ******/

function _configureAirtable() {
  if (!process.env.AIRTABLE_BASE_ID)
    throw new Error('must set process.env.AIRTABLE_BASE_ID');
  if (!process.env.AIRTABLE_API_KEY)
    throw new Error('must set process.env.AIRTABLE_API_KEY');
  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
  return Airtable.base(process.env.AIRTABLE_BASE_ID)('Attendees');
}

function AirtableService(client) {
  return {
    async getSingleAttendee({ eventId, username }) {
      let attendees = [];
      await client
        .select({
          filterByFormula: `AND(
            SEARCH("${eventId}",{Event ID}),
            SEARCH("${username}",{Github Username})
          )`,
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(function(record) {
            attendees.push({ ...record.fields, id: record.id });
          });
          fetchNextPage();
        });
      return attendees[0]; // there should only be one
    },
    async listAttendees({ eventId }) {
      let attendees = [];
      await client
        .select({
          filterByFormula: `SEARCH("${eventId}",{Event ID})`,
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach(function(record) {
            attendees.push(record.fields);
          });
          fetchNextPage();
        });
      return attendees;
    },
    insertAttendee({ name, login, eventId }) {
      return client.create([
        {
          fields: {
            Name: name,
            'Github Username': login,
            'Event ID': eventId,
            Type: 'Attendee',
            'Created Date': new Date().toISOString(),
          },
        },
      ]);
    },
    removeAttendee({ id }) {
      return client.destroy([id]);
    },
  };
}
