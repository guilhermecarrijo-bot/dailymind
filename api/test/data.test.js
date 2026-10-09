process.env.TZ = 'America/Sao_Paulo'

const assert = require('node:assert/strict')
const { test } = require('node:test')
const { dataLocal } = require('../src/utilitarios/data')

test('usa a data civil local quando ela difere da data UTC', () => {
  const instante = new Date('2026-10-08T02:30:00.000Z')

  assert.equal(dataLocal(instante), '2026-10-07')
})