import knex from "knex"
import path from 'path'

export const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'data.sqlite3')
  },
  useNullAsDefault: true
})
export default connection