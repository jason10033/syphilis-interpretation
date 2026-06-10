const { execSync } = require('child_process')
const http = require('http')
const fs = require('fs')
const path = require('path')

const git = '"C:\\Program Files\\Git\\cmd\\git.exe"'
const cwd = __dirname
const log = []

function run(cmd) {
  log.push(`> git ${cmd.replace(/https:\/\/[^@]+@/, 'https://***@')}`)
  try {
    const out = execSync(`${git} ${cmd}`, { cwd, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] })
    if (out.trim()) log.push(out.trim())
  } catch (e) {
    const msg = ((e.stdout || '') + (e.stderr || '')).trim() || e.message
    log.push('! ' + msg)
  }
}

const token = fs.readFileSync(path.join(__dirname, '.github-token'), 'utf8').trim()

run('config user.email "jason10033@github.com"')
run('config user.name "Jason"')
run('add -A')
run('commit -m "update"')
run(`remote set-url origin https://${token}@github.com/jason10033/syphilis-interpretation.git`)
run('push origin main')
log.push('\n--- Done. Check https://syphilis-interpretation.netlify.app ---')
log.forEach(l => console.log(l))

http.createServer((req, res) => res.end(log.join('\n'))).listen(9998)
