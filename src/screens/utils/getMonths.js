export function getMonth() {
  const month = new Date().getMonth() + 1;
  var monthName;

  if (month == 1) monthName = 'January';
  else if (month == 2) monthName = 'February';
  else if (month == 3) monthName = 'March';
  else if (month == 4) monthName = 'April';
  else if (month == 5) monthName = 'May';
  else if (month == 6) monthName = 'June';
  else if (month == 7) monthName = 'July';
  else if (month == 8) monthName = 'August';
  else if (month == 9) monthName = 'September';
  else if (month == 10) monthName = 'October';
  else if (month == 11) monthName = 'November';
  else if (month == 12) monthName = 'December';
  return monthName;
}

export function getMonths() {
  const monthsAbbreviated = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentDate = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const month = currentDate.getMonth() - i;
    months.push(monthsAbbreviated[month]);
  }

  return months;
}

export function getMonthName(index) {
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return month[index];
}
