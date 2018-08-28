import test from 'ava'

import M from '.'

const m = new M()

test('Montréal Stadium', async t => {
  const {
    json: { standard: { city, countryname, postal }, longt, latt }
  } = await m.forward('4141 Pierre-de Coubertin, Montréal, Canada')
  t.is(longt, -73.55035)
  t.is(latt, 45.5559)
  t.is(city, 'Montréal')
  t.is(countryname, 'Canada')
  t.is(postal, 'H1V3N7')
})

test('no results', async t =>
  t.throwsAsync(m.forward('aljkhsdlwe'), { code: '008' }))

test('supply a valid query ("")', async t =>
  t.throwsAsync(m.forward(''), { code: '007' }))

test('supply a valid query (undef)', async t =>
  t.throwsAsync(m.forward(), { code: '007' }))

test('bad token', async t => {
  const mBad = new M({ token: 'joe' })
  await t.throwsAsync(mBad.forward('montreal'), { code: '003' })
  await t.throwsAsync(mBad.forward(), { code: '003' })
})

test('bad baseUrl (relative)', async t => {
  const mBad = new M({ baseUrl: 'joe' })
  await t.throwsAsync(mBad.forward(), 'Only absolute URLs are supported')
})

test('bad baseUrl (no server)', async t => {
  const mBad = new M({ baseUrl: '/joe' })
  await t.throwsAsync(mBad.forward(), 'Only absolute URLs are supported')
})

test('bad baseUrl (unresponsive server)', async t => {
  const mBad = new M({ baseUrl: 'http://aljkhsdlwe' })
  await t.throwsAsync(mBad.forward(), { code: 'ENOTFOUND' })
})

test('bad baseUrl (wrong server)', async t => {
  const mBad = new M({ baseUrl: 'https://api.github.com' })
  await t.throwsAsync(
    mBad.forward('user/1'),
    'Unexpected response. Verify the baseUrl.'
  )
})
