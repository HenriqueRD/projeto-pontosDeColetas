import { Knex } from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('point_item', x => {
    x.increments('id').primary(),
    x.integer('point_id').notNullable().references('id').inTable('point'),
    x.integer('item_id').notNullable().references('id').inTable('item')
  })
}
export async function down(knex: Knex) {
  knex.schema.dropTable('point_item')
}