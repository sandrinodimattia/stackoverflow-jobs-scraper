const debug = require('debug')('crawler');
const puppeteer = require('puppeteer');
const commander = require('commander');

const csv = require('./lib/export-csv');
const StackOverflowJobs = require('./lib/jobs');

commander
  .option('-f, --file', 'File (eg: jobs.csv)')
  .option('-l, --location', 'The location where to find a job (eg: Amsterdam)')
  .parse(process.argv);

debug.enabled = true;

async function run(location, filePath) {
  try {
    debug('Starting puppeteer');

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    debug('Getting jobs');

    const so = new StackOverflowJobs(page);
    const links = await so.getLinks(location);

    const jobs = await so.getJobs(links);
    csv(filePath, jobs);

    debug('Exported jobs to %s', filePath);
    console.log('\n');

    await page.close();
    await browser.close();
  } catch (e) {
    debug('error', e);
  }
}

if (commander.args.length !== 2) {
  commander.help();
  console.log('\n');
} else {
  run(...commander.args).catch(console.error);
}
