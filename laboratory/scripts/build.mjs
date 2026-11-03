import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});for(const f of ['index.html','src','data','vendor'])await cp(f,'dist/'+f,{recursive:true});console.log('Static production build ready in dist/');
