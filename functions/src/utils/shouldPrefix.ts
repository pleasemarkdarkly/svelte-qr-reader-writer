export const shouldPrefixWithOne = n => {
  return n >= 100;
};

export const shouldHyphenate = n => {
  return n >= 20 && n <= 99;
};
