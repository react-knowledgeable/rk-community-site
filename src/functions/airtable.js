import Airtable from 'airtable';

export const handler = async (event, context, callback) => {
  try {
    let attendees = [];
    const atClient = _configureAirtable();
    await atClient('Attendees')
      .select({
        filterByFormula: 'SEARCH("4",{Event ID})',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach(function(record) {
          attendees.push(record);
        });
        fetchNextPage();
      });
    callback(null, {
      status: 200,
      body: attendees,
    });
  } catch (e) {
    callback(null, {
      status: 500,
      body: e,
    });
  }
};

function _configureAirtable() {
  return Airtable.base(process.env.AIRTABLE_BASE_ID);
}
