const { execSync, spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = __dirname
const viteMarker = path.join(root, 'node_modules', 'vite', 'package.json')

if (!fs.existsSync(viteMarker)) {
  console.log('Installing dependencies...')
  execSync('npm install', { cwd: root, stdio: 'inherit' })
}

console.log('Starting vite dev server...')
const vite = spawn('npm', ['run', 'dev'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
})

vite.on('error', err => {
  console.error('Failed to start vite:', err)
  process.exit(1)
})

vite.on('exit', code => process.exit(code ?? 0))
