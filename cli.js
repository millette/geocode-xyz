#!/usr/bin/env node

'use strict'

// npm
const meow = require('meow')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')

// self
const geocode = require('.')
const { localFile } = geocode
const { name } = require('./package.json')

marked.setOptions({
  renderer: new TerminalRenderer()
})

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
  } catch (e) {
    console.error('\n\n', e.errors ? e : e.toString())
    if (e.headers) {
      console.error('headers:', e.headers)
    }
    process.exitCode = e.statusCodes || 127
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
