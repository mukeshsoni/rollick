#!/usr/bin/env node

var program = require('commander')

const toolName = 'Kodai'

program
    .command('start <port>', 'Start server to run the tool on')
    .command('install', `Install ${toolName} in your current project`)
    .parse(process.argv)
