function getWeekdays() {
  const today = new Date();
  const days = [];
  for (let i = -5; i < 2; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

export default getWeekdays;
