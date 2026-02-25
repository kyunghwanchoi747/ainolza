const { exec } = require('child_process')
const fs = require('fs')

console.log('Checking remote...')
exec('git remote -v', { encoding: 'utf8' }, (error, stdout, stderr) => {
  console.log('Check finished.')
  const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`
  fs.writeFileSync('git_remote.txt', output, 'utf8')
})
