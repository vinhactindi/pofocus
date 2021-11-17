#!/usr/bin/env node

const minimist = require('minimist')

const args = process.argv.slice(2)

const minimistOpts = {
  alias: { p: 'pomodoro', s: 'short', l: 'long', h: 'help' },
  default: { p: 25, s: 5, l: 15 },
  unknown: (option) => {
    throw new Error('Unknown option ' + option)
  }
}

const argv = minimist(args, minimistOpts)

if (argv.help) {
  const usage = `Usage: pofocus [options]

A simple CLI based focus supporting app.

Options:
  -p, --pomodoro <number> Specify the focus time (minutes) (default: 15)
  -s, --short <number>    Specify the short break time (minutes) (default: 15)
  -t, --long <number>     Specify the long break time (minutes) (default: 500)
  -h, --help              Display help for command`

  console.log(usage)
  process.exit(0)
}
