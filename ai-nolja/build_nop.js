const { exec } = require('child_process')
const fs = require('fs')

console.log('Starting next-on-pages build...')
// npx -y to auto install yes
exec('npx -y @cloudflare/next-on-pages', { encoding: 'utf8' }, (error, stdout, stderr) => {
  console.log('Build finished.')
  const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`
  fs.writeFileSync('nop_build_output.txt', output, 'utf8')
  if (error) {
    console.error(`exec error: ${error}`)
  }
})
