const debug = require('debug')('so');
const asyncForEach = require('./async-foreach');
const StackOverflowJobsPage = require('./jobs-page');

debug.enabled = true;

module.exports = class StackOverflowJobs {
  constructor(page) {
    this.page = page;
  }

  async getLinks(location) {
    debug('Counting total job pages for %s', location);

    await this.page.goto(`https://stackoverflow.com/jobs?sort=i&l=${location}&d=20&u=Km`, { waitUntil: 'networkidle2' });
    const links = await this.page.$$eval('div.js-search-results div.listResults a.s-link', elements => elements.map(e => e.href));
    links.pop();
    return links;
  }

  async getJobs(links) {
    const jobs = [];
    await asyncForEach(links, async (link) => {
      const page = new StackOverflowJobsPage(this.page);
      jobs.push(...await page.getPage(link));
    });

    debug('Found %s jobs', jobs.length);
    return jobs;
  }
};
