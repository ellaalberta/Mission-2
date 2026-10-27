import {cp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import {validate} from '../src/analytics.js';
validate(JSON.parse(await readFile('data/competitor_data.json','utf8')));
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const p of ['index.html','src','data'])await cp(p,`dist/${p}`,{recursive:true});
await writeFile('dist/.nojekyll','');console.log('Production build complete: dist/ (relative assets support /Mission-2/)');
