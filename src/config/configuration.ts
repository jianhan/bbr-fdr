const DOMAIN_URL = `https://www.basketball-reference.com`;

export default () => ({
  domainURL: DOMAIN_URL,
  maxSeasonYear: new Date().getFullYear(),
  minSeasonYear: 2000,
});
