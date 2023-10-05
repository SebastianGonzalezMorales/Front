function getDaysString(date) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[date.getDay()];
}

export default getDaysString;
