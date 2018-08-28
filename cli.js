#!/usr/bin/env node

'use strict'

// npm
const meow = require('meow')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')

// self
const geocode = require('.')
const { name } = require('./package.json')

// core
const { readFileSync } = require('fs')
const { join } = require('path')

marked.setOptions({
  renderer: new TerminalRenderer()
})

const localFile = path => readFileSync(join(__dirname, path), 'utf-8')

const readme = marked(localFile('README.md'))

const run = async cli => {
  try {
    if (cli.flags.readme) {
      return console.log(readme)
    }

    if (!cli.input.length) {
      throw new Error(`
  Missing required argument.
  ${cli.help}`)
    }

    // 'https://api.github.com/user/1'
    const oy = await geocode('https://api.github.com/user/0')
    console.log('OY:', oy)
  } catch (e) {
    if (e.status) {
      console.error('code:', e.status)
      process.exitCode = e.status
    } else {
      process.exitCode = 127
    }
    console.error(e.toString())
  }
}

run(
  meow(
    `
  Usage
    $ ${name} <location> [<location> ...]

  Options
    --readme                Show readme
    --verbose           -v  Verbose mode
    --config                Specify config file
    --pretty            -p  Pretty output
    --output            -o  Output to file
    --sparks            -s  Fetch contributions and generate week-based sparkline data
    --colors            -c  Fetch GitHub language colors
    --before            -b  Before date, 2018-06-21 or 2018-07-21T10:40:40Z
    --last-repos        -r  Include these last repositories contributed to (50)
    --query             -q  Query to run

  Examples
    $ ghraphql Montréal
    // searches for montreal and montréal

    $ ghraphql Montréal "saint jean"
    // searches for montreal, montréal and "saint jean"
`,
    {
      flags: {
        output: {
          type: 'string',
          alias: 'o'
        },
        config: {
          type: 'string'
        },
        before: {
          type: 'string',
          alias: 'b'
        },
        'last-repos': {
          type: 'string',
          alias: 'r'
        },
        query: {
          type: 'string',
          alias: 'q'
        },
        readme: {
          type: 'boolean'
        },
        help: {
          type: 'boolean',
          alias: 'h'
        },
        verbose: {
          type: 'boolean',
          alias: 'v'
        },
        pretty: {
          type: 'boolean',
          alias: 'p'
        },
        sparks: {
          type: 'boolean',
          alias: 's'
        },
        colors: {
          type: 'boolean',
          alias: 'c'
        }
      }
    }
  )
)
