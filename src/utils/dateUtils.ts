export function getMondayOfIsoWeek(year: number, week: number): Date {
  // Simple algorithm for ISO week Monday
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dayOfWeek = simple.getUTCDay();
  const ISOweekStart = simple;
  if (dayOfWeek <= 4) {
    ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  } else {
    ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  }
  return ISOweekStart;
}

export function formatDateIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekRangeStrings(year: number, week: number): {
  startDate: string;
  endDate: string;
  label: string;
} {
  const monday = getMondayOfIsoWeek(year, week);
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const monDay = monday.getUTCDate();
  const friDay = friday.getUTCDate();
  const monMonth = months[monday.getUTCMonth()];
  const friMonth = months[friday.getUTCMonth()];

  const monthRange = monMonth === friMonth ? friMonth : `${monMonth} - ${friMonth}`;
  const label = `Semana ${week} (${monDay} - ${friDay} ${monthRange} ${year})`;

  return {
    startDate: formatDateIso(monday),
    endDate: formatDateIso(friday),
    label,
  };
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} a ${end}`;
}
