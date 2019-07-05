export default date => {
  const d = new Date(date);
  return d === 'Invalid Date'
    ? date
    : d.toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
};
