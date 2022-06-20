export const betweenDate = (dates) => {
    const [ date, min, max ] = dates.map(d => toDate(d));
    if (+date < +min) return min;
    if (+date > +max) return max;
    return date;
}

export const toDate = (input) => (input ? (typeof input === 'string' ? new DateEx(input) : input) : new DateEx());

export const date2MysqlDate = (input) => {
    const date = toDate(input);
    return `${date.getFullYear()}-${(""+(date.getMonth() + 1)).padStart(2, '0')}-${(""+date.getDate()).padStart(2, '0')} ${(""+date.getHours()).padStart(2, '0')}:${(""+date.getMinutes()).padStart(2, '0')}:${(""+date.getSeconds()).padStart(2, '0')}`;
}

export const mysqlDate2Date = (input) => {
    const [date, time] = input.split(' ');
    const [year, month, day] = date.split('-').map(x => parseInt(x));
    const [hour, minute, second] = time.split(':').map(x => parseInt(x));
    const newDate = new DateEx();
    newDate.set({
        year: year,
        month: month,
        day: day,
        hour: hour,
        min: minute,
        sec: second
    });
    return newDate;
}

export const deltaDate = (input, modifier) => {
    const date = toDate(input);
    const { year, month, day } = modifier;
    if (day) date.setDate(date.getDate() + day);
    if (month) date.setMonth(date.getMonth() + month);
    if (year) date.setFullYear(date.getFullYear() + year);
    return date;
}

export const setDate = (input,  day, month, year) => {
    const date = toDate(input);
    if (day) date.setDate(day);
    if (month) date.setMonth(month - 1);
    if (year) date.setFullYear(year);
    return date;
}

export const setTime = (input,  hour, min, sec) => {
    const date = toDate(input);
    if (hour) date.set({ hour });
    if (min) date.set({ min });
    if (sec) date.set({ sec });
    return date;
}

export const getMonthInfo = (input) => {
    const date = toDate(input).clone();
    const dateInfo = date.getObjectForm();
    dateInfo.currentDay = date.getDay();
    dateInfo.firstDay = setDate(date, 1).getDay();
    dateInfo.prevMonthLastDay = deltaDate(date, { day: -1 }).getDate();
    dateInfo.monthLastDay = deltaDate(setDate(date, 1, dateInfo.month + 1), { day: -1 }).getDate();
    dateInfo.lastDay = date.getDay();
    return dateInfo;
}

export const to2digit = (n, len = 2) => {
    return  ("" + n).padStart(len, '0')
}