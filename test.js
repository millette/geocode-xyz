import test from 'ava'

import M from '.'

const m = new M()

test('error: no results', async t =>
  t.throwsAsync(m.forward('aljkhsdlwe'), { code: '008' }))

test('error: supply a valid query ("")', async t =>
  t.throwsAsync(m.forward(''), { code: '007' }))

test('error: supply a valid query (undef)', async t =>
  t.throwsAsync(m.forward(), { code: '007' }))

test('error: bad token', async t => {
  const mBad = new M({ token: 'joe' })
  await t.throwsAsync(mBad.forward('montreal'), { code: '003' })
  await t.throwsAsync(mBad.forward(), { code: '003' })
})

test('error: bad baseUrl (relative)', async t => {
  const mBad = new M({ baseUrl: 'joe' })
  await t.throwsAsync(mBad.forward(), 'Only absolute URLs are supported')
})

test('error: bad baseUrl (no server)', async t => {
  const mBad = new M({ baseUrl: '/joe' })
  await t.throwsAsync(mBad.forward(), 'Only absolute URLs are supported')
})

test('error: bad baseUrl (unresponsive server)', async t => {
  const mBad = new M({ baseUrl: 'http://aljkhsdlwe' })
  await t.throwsAsync(mBad.forward(), { code: 'ENOTFOUND' })
})

test('error: bad baseUrl (wrong server)', async t => {
  const mBad = new M({ baseUrl: 'https://api.github.com' })
  await t.throwsAsync(
    mBad.forward('user/1'),
    'Unexpected response. Verify the baseUrl.'
  )
})
