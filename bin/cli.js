#!/usr/bin/env node

import minimist from 'minimist'
import Cycle from '../lib/cycle.js'
import Pomodoro from '../lib/pomodoro.js'

const args = process.argv.slice(2)

const minimistOpts = {
  alias: {
    a: 'analytics',
    f: 'focus',
    s: 'short',
    l: 'long',
    m: 'message',
    h: 'help',
    r: 'reset'
  },
  default: { f: 25, s: 5, l: 15 },
  unknown: (option) => {
    throw new Error('Unknown option ' + option)
  }
}

const argv = minimist(args, minimistOpts)

if (argv.help) {
  const usage = `Usage: pofocus [options]

A simple CLI based focus supporting app.

Options:
  -m, --message <string>  Specify the message of pomodoro cycle (minutes) 
  -f, --focus <number>    Specify the focus time (minutes) (default: 15)
  -s, --short <number>    Specify the short break time (minutes) (default: 15)
  -t, --long <number>     Specify the long break time (minutes) (default: 500)
  -a, --analytics         Display all pomodoro cycle 
  -r, --reset             Destroy all saved data
  -h, --help              Display help for command`

  console.log(usage)
  process.exit(0)
} else if (argv.reset) {
  Cycle.drop()
} else if (argv.analytics) {
  Cycle.analytics()
} else {
  Cycle.migrate()
  const pomodoro = new Pomodoro(argv)

  pomodoro.start()
}
