'use strict'

// npm
const fetch = require('isomorphic-unfetch')

const geocode = async x => {
  let err
  const response = await fetch(x)
  if (response.status !== 200) {
    err = new Error(response.statusText)
    err.status = response.status
    throw err
  }
  const json = await response.json()
  if (json.error) {
    err = new Error(json.error.description || 'Unknow error')
    if (json.error.code) {
      err.code = json.error.code
      err.status = parseInt(json.error.code, 10)
    }
    throw err
  }
  const { headers, status, statusText } = response
  return {
    headers: Array.from(headers),
    status,
    statusText,
    json
  }
}

module.exports = geocode
