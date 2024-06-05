export function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formaterDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  };

  const formatter = new Intl.DateTimeFormat('fr-FR', options);

  return formatter.format(date);
}

export function formatHeure(heureStr) {
  return heureStr.substring(0, 5);
}
