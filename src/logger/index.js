const chalk = require('chalk');

const log = console.log;

export default {
  error: (msg) => {
    log(chalk.red(msg));
  }
};
