import log from 'log-update'
import enquirer from 'enquirer'
import notifier from 'node-notifier'
import Cycle from './cycle.js'

const { Select } = enquirer

class Pomodoro {
  constructor({ focus, short, long, message }) {
    this.focus = focus * 60
    this.short = short * 60
    this.long = long * 60
    this.message = message
  }

  countdown(duration) {
    this.duration = duration
    const self = this
    const interval = setInterval(() => {
      log(self.format(self.duration--))

      if (self.duration < 0) {
        clearInterval(interval)
        log('⏰ ' + self.format(duration))
        log.done()
        notifier.notify({
          title: 'Pofocus',
          message: 'Time up!'
        })

        const { message, cycleType: type } = self
        const cycle = new Cycle({ message, type, duration })
        cycle.save()

        self.prompt()
      }
    }, 1000)
  }

  format(duration) {
    const hrs = ~~(duration / 3600)
    const mins = ~~((duration % 3600) / 60)
    const secs = ~~duration % 60

    let clockStr = '  '

    if (hrs > 0) {
      clockStr += hrs.toString().padStart(2, '0') + ':'
    }

    clockStr += mins.toString().padStart(2, '0') + ':'
    clockStr += secs.toString().padStart(2, '0')
    return clockStr
  }

  prompt() {
    const prompt = new Select({
      name: 'mode',
      message: 'Choose a mode that you need',
      choices: ['🎯 focus time', '😌 short break', '🎉 long break']
    })

    prompt
      .run()
      .then((answer) => {
        switch (answer) {
          case '😌 short break':
            this.shortStart()
            break
          case '🎉 long break':
            this.longStart()
            break
          default:
            this.focusStart()
            break
        }
      })
      .catch(console.error)
  }

  focusStart() {
    this.cycleType = 'focus'
    this.countdown(this.focus)
  }

  shortStart() {
    this.cycleType = 'short'
    this.countdown(this.short)
  }

  longStart() {
    this.cycleType = 'long'
    this.countdown(this.long)
  }

  start() {
    this.prompt()
  }
}

export default Pomodoro
