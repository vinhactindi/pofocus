import { v4 as uuid } from 'uuid'
import sqlite3 from 'sqlite3'
import { table } from 'table'

const verbose = sqlite3.verbose()
const db = new verbose.Database('../pomodoro.db')

class Cycle {
  constructor({ id, message, type, duration, created }) {
    this.id = id
    this.message = message
    this.type = type
    this.duration = duration
    this.created = created
  }

  static migrate() {
    db.run(`CREATE TABLE IF NOT EXISTS Cycle
            (id VARCHAR(36) PRIMARY KEY,
            message TEXT,
            type VARCHAR(8),
            duration INTEGER,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
  }

  static drop() {
    db.run('DROP TABLE Cycle;')
  }

  static all() {
    return new Promise(function (resolve, reject) {
      db.all(
        'SELECT id, message, type, duration, created FROM Cycle ORDER BY id ASC;',
        function (err, rows) {
          if (err) reject(err)

          resolve(rows.map((row) => new Cycle(row)))
        }
      )
    })
  }

  static analytics() {
    this.all()
      .then((rows) => {
        const config = {
          header: {
            alignment: 'center',
            content: 'POFOCUS\nThe moment of truth, did you do well?'
          }
        }
        const data = rows.map(({ id, message, type, duration, created }) => [
          id,
          message,
          type,
          duration / 60,
          created
        ])

        data.unshift(['_id', 'Message', 'Type', 'Duration (m)', 'Created at'])
        console.log(table(data, config))
      })
      .catch(console.error)
  }

  save() {
    const self = this

    return new Promise(function (resolve, reject) {
      self.id = uuid()
      db.run(
        'INSERT INTO Cycle (id, message, type, duration) VALUES (?, ?, ?, ?);',
        [self.id, self.message, self.type, self.duration],
        function (err) {
          if (err) reject(err)

          resolve(self)
        }
      )
    })
  }
}

export default Cycle
