const { exec } = require('child_process')
const fs = require('fs')

console.log('Listing projects...')
exec('npx wrangler pages project list', { encoding: 'utf8' }, (error, stdout, stderr) => {
  console.log('Listing finished.')
  const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`
  fs.writeFileSync('wrangler_list.txt', output, 'utf8')
  if (error) {
    console.error(`exec error: ${error}`)
  }
})
