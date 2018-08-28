import test from 'ava'

import M from '.'

const m = new M()

test('Missing longt or latt', async t =>
  t.throwsAsync(
    m.backward({ longt6: -73.55035, latt: 45.5559 }),
    'Missing `longt` or `latt`. Both are required.'
  ))

test('backward', async t => {
  const {
    json: { state, city, country, stnumber, staddress }
  } = await m.backward({ longt: -73.55035, latt: 45.5559 })
  t.is(state, 'QC')
  t.is(city, 'Montreal')
  t.is(country, 'Canada')
  t.is(stnumber, '4141')
  t.is(staddress, 'AVE PIERRE-DE COUBERTIN')
})

/*
test('backward 0', async t => {
  // Trying to find a place with coordinates 0 (lat or long)
  // const { json: { state, city, country, stnumber, staddress } } = await m.backward({ longt: 0, latt: 45.5559 })
  const { json } = await m.backward({ longt: 0, latt: 43.665235 })
  console.log('JSON:', json)
  t.is(state, 'QC')
  t.is(city, 'Montreal')
  t.is(country, 'Canada')
  t.is(stnumber, '4141')
  t.is(staddress, 'AVE PIERRE-DE COUBERTIN')
})
*/

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
