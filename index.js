'use strict'

// core
const { readFileSync } = require('fs')
const { join } = require('path')

// npm
const got = require('got')

const localFile = path => readFileSync(join(__dirname, path), 'utf-8')

const geocode = got

module.exports = geocode
module.exports.localFile = localFile
