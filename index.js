'use strict'

// npm
const fetch = require('isomorphic-unfetch')

class GeocoderXYZ {
  constructor (opts) {
    if (!opts) {
      opts = {}
    }
    this.baseUrl = opts.baseUrl || 'https://geocode.xyz'
    if (this.baseUrl[this.baseUrl.length - 1] !== '/') {
      this.baseUrl = `${this.baseUrl}/`
    }
    this.token = opts.token ? `&auth=${opts.token}` : ''
  }

  async forward (y) {
    let err
    const response = await fetch(
      `${this.baseUrl}${y || ''}?json=1${this.token}`
    )
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
    if (!json.standard || !json.longt || !json.latt) {
      err = new Error('Unexpected response. Verify the baseUrl.')
      err.response = json
      throw err
    }

    json.longt = parseFloat(json.longt)
    json.latt = parseFloat(json.latt)
    if (json.standard.confidence) {
      json.standard.confidence = parseFloat(json.standard.confidence)
    }
    const { url, headers, status, statusText } = response
    return {
      url,
      headers,
      headersArray: Array.from(headers),
      status,
      statusText,
      json
    }
  }
}

module.exports = GeocoderXYZ
