import { Knex } from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('point', x => {
    x.increments('id').primary(),
    x.string('image').notNullable(),
    x.string('name').notNullable(),
    x.string('email').notNullable(),
    x.string('phone').notNullable(),
    x.string('city').notNullable(),
    x.string('uf', 2).notNullable(),
    x.decimal('longitude').notNullable(),
    x.decimal('latitude').notNullable()
  })
}
export async function down(knex: Knex) {
  knex.schema.dropTable('point')
}