const { exec } = require('child_process')
const fs = require('fs')

console.log('Starting build...')
exec('npm run build', { encoding: 'utf8' }, (error, stdout, stderr) => {
  console.log('Build finished.')
  const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`
  fs.writeFileSync('build_output.txt', output, 'utf8')
  if (error) {
    console.error(`exec error: ${error}`)
  }
})
