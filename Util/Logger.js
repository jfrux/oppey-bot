/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');
const moment = require('moment');

class Logger {
  static log(content, type = 'log') {
    const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;
    const bold = chalk.bold(`[${tag}]`);
    switch(type) {
      case 'log': {
        return console.log(`${timestamp} ${chalk.bgBlue(tag)} ${content} `);
      }
      case 'warn': {
        return console.log(`${timestamp} ${chalk.black.bgYellow(tag)} ${content} `);
      }
      case 'error': {
        return console.log(`${timestamp} ${chalk.bgRed(tag)} ${content} `);
      }
      case 'debug': {
        return console.log(`${timestamp} ${chalk.green(tag)} ${content} `);
      } 
      default: throw new TypeError('Logger type must be either warn, debug, log or error.');
    } 
  }
  
  static error(content) {
    return this.log(content, 'error');
  }
  
  static warn(content) {
    return this.log(content, 'warn');
  }
  
  static debug(content) {
    return this.log(content, 'debug');
  } 
}

module.exports = Logger;
