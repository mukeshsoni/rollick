#!/usr/bin/env node

var program = require('commander')
var parseArgs = require('minimist')
var exec = require('child_process').exec
var path = require('path')

program.option('-p, --port <port_number>').parse(process.argv)
const port = program.port || 4000

const toolName = 'rollick'
const toolFolder = `${process.cwd()}/.${toolName}`
exec(`node ${toolFolder}/.server.js --port ${port}`)
