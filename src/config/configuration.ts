const DOMAIN_URL = `https://www.basketball-reference.com`;

export default () => ({
  domainURL: DOMAIN_URL,
  genSummaryURLFunc: (year: number) => (`${DOMAIN_URL}/leagues/NBA_${year}.html`),
});
