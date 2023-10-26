import { Knex } from 'knex'

export async function seed(knex: Knex) {
  await knex('item').insert([
    { title: 'Lâmpadas', imageUrl: 'lampadas.svg' },
    { title: 'Pilhas e Baterias', imageUrl: 'pilhasBaterias.svg' },
    { title: 'Papéis e Papelão', imageUrl: 'papeisPapelao.svg' },
    { title: 'Resíduos Eletrônicos', imageUrl: 'residuosEletronicos.svg' },
    { title: 'Resíduos Orgânicos', imageUrl: 'residuosOrganicos.svg' },
    { title: 'Óleo de Cozinha', imageUrl: 'oleoCozinha.svg' }
  ])
}