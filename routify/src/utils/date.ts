
export const dateToStr = (date: string) => { return new Date(date).toISOString().split("T")[0]; };
export const convertUTCtoLocal = (date: Date) => { return new Date(+date + date.getTimezoneOffset() * 6e4); };