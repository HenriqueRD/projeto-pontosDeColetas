import { Knex } from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('item', x => {
    x.increments('id').primary(),
    x.string('title').notNullable(),
    x.string('imageUrl').notNullable()
  })
}
export async function down(knex: Knex) {
  knex.schema.dropTable('item')
}