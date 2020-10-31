
export default () => ({
  domainURL: `https://www.basketball-reference.com`,
  pageCacheDurationInSeconds: 60 * 60 * 24,
  maxSeasonYear: new Date().getFullYear(),
  minSeasonYear: 2000,
});
