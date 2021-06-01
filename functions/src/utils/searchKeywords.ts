const g = [];
const u = [];

export const searchExcludableKeywords = (...words: any) => {
  const hasPunctuation = /[.,:;!?]/;
  const hasNumbers = /\d/;
  let flag = false;
  for (const w of words) {
    if (g.some(v => w.toLowerCase().includes(v))) flag = true;
    if (hasNumbers.test(w)) flag = true;
    if (hasPunctuation.test(w)) flag = true;
  }
  return flag;
};

export const searchUnknownKeywords = (...words: any) => {
  const hasPunctuation = /[.,:;!?]/;
  const hasNumbers = /\d/;
  let flag = false;
  for (const w of words) {
    if (u.some(v => w.toLowerCase().includes(v))) flag = true;
    if (hasNumbers.test(w)) flag = true;
    if (hasPunctuation.test(w)) flag = true;
  }
  return flag;
};

export const dedup = (ary) => {
  return ary.split(',').filter(function (item, i, allItems) {
    return i === allItems.indexOf(item);
  }).join(',');
};