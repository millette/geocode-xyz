import test from 'ava'

import m from '.'

test('error: no results', async t =>
  t.throwsAsync(m('https://geocode.xyz/aljkhsdlwe?json=1'), { code: '008' }))

test('error: supply a valid query', async t =>
  t.throwsAsync(m('https://geocode.xyz/?json=1'), { code: '007' }))
