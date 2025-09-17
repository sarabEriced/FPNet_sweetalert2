#!/usr/bin/env zx
import {$} from 'zx'
$.quote = s => `"${s}"`;

import {echo, fs, glob } from 'zx'
import { eslintFormat } from '@sweetalert2/eslint-config'
import eslintConfig from '../eslint.config.mjs'

echo`1. Build JS ...`
await eslintFormat(glob.sync('src/**/*.js'), eslintConfig)
await $`rollup -c --bundleConfigAsCjs`
echo`OK!`
echo``

echo`2. Build CSS ...`
await $`sass src/sweetalert2.scss dist/sweetalert2.css --no-source-map`
await $`sass src/sweetalert2.scss dist/sweetalert2.min.css --no-source-map --style=compressed`
echo`OK!`
echo``

echo`3. Build JS+CSS ...`
const css = fs.readFileSync('dist/sweetalert2.min.css', 'utf8')
const cssInJs = `"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"${css
  .trim()
  .replace(/"/g, '\\"')}");`
fs.writeFileSync('dist/sweetalert2.all.js', `${fs.readFileSync('dist/sweetalert2.js', 'utf-8')}${cssInJs}`)
fs.writeFileSync('dist/sweetalert2.all.min.js', `${fs.readFileSync('dist/sweetalert2.min.js', 'utf-8')}${cssInJs}`)
fs.writeFileSync('dist/sweetalert2.esm.all.js', `${fs.readFileSync('dist/sweetalert2.esm.js', 'utf-8')}${cssInJs}`)
fs.writeFileSync(
  'dist/sweetalert2.esm.all.min.js',
  `${fs.readFileSync('dist/sweetalert2.esm.min.js', 'utf-8')}${cssInJs}`
)
await $`git checkout . >/dev/null 2>&1`
echo`OK!`
echo``
