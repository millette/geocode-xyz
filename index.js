'use strict'

// npm
const fetch = require('isomorphic-unfetch')
const deburr = require('lodash.deburr')
const pThrottle = require('p-throttle')

// self
const { name, version } = require('./package.json')

class GeocoderXYZ {
  constructor (opts) {
    if (!opts) {
      opts = {}
    }
    this.baseUrl = opts.baseUrl || 'https://geocode.xyz/'
    if (this.baseUrl[this.baseUrl.length - 1] !== '/') {
      this.baseUrl = `${this.baseUrl}/`
    }
    this.token = opts.token ? `&auth=${opts.token}` : ''
    this.query = pThrottle(this.query.bind(this), 1, 1000)
  }

  async query (q) {
    let err
    const response = await fetch(q, {
      headers: {
        'user-agent': `${name} client v${version}`,
        accept: 'application/json; charset=utf-8'
      }
    })

    // We get a 403 when throttled with a json error response too
    if (response.status !== 200 && response.status !== 403) {
      err = new Error(response.statusText)
      err.status = response.status
      err.headers = Array.from(response.headers)
      throw err
    }

    const json = await response.json()
    if (json.error) {
      // When throttled, the error is in message instead of description
      err = new Error(json.error.description || json.error.message)
      err.code = json.error.code
      err.status = parseInt(json.error.code, 10)
      throw err
    }

    const { url, headers, status, statusText } = response
    const headersArray = Array.from(headers)

    if (typeof json.latt !== 'string' || typeof json.longt !== 'string') {
      err = new Error('Unexpected response. Verify the baseUrl.')
      err.response = json
      throw err
    }

    json.longt = parseFloat(json.longt)
    json.latt = parseFloat(json.latt)
    if (json.standard && typeof json.standard.confidence === 'string') {
      json.standard.confidence = parseFloat(json.standard.confidence)
    } else if (typeof json.confidence === 'string') {
      json.confidence = parseFloat(json.confidence)
    } else {
      err = new Error('Unexpected response. Verify the baseUrl.')
      err.response = json
      throw err
    }

    if (typeof json.inlongt === 'string') {
      json.inlongt = parseFloat(json.inlongt)
    }
    if (typeof json.inlatt === 'string') {
      json.inlatt = parseFloat(json.inlatt)
    }

    return { json, url, headers, headersArray, status, statusText }
  }

  async backward ({ longt, latt }) {
    if (typeof longt !== 'number' || typeof latt !== 'number') {
      throw new Error('Missing `longt` or `latt`. Both are required.')
    }
    const {
      json,
      url,
      headers,
      headersArray,
      status,
      statusText
    } = await this.query(`${this.baseUrl}${latt},${longt}?json=1${this.token}`)

    if (
      typeof json.inlatt !== 'number' ||
      typeof json.inlongt !== 'number' ||
      typeof json.latt !== 'number' ||
      typeof json.longt !== 'number'
    ) {
      const err = new Error('Unexpected response. Verify the baseUrl.')
      err.response = json
      throw err
    }

    return {
      url,
      headers,
      headersArray,
      status,
      statusText,
      json
    }
  }

  async forward (y) {
    y = deburr(y || '')
    const {
      json,
      url,
      headers,
      headersArray,
      status,
      statusText
    } = await this.query(`${this.baseUrl}${y}?json=1${this.token}`)
    if (!json.standard) {
      const err = new Error('Unexpected response. Verify the baseUrl.')
      err.response = json
      throw err
    }
    return {
      url,
      headers,
      headersArray,
      status,
      statusText,
      json
    }
  }
}

module.exports = GeocoderXYZ
