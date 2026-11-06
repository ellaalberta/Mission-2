import {resolve} from 'node:path';
export default {base:'./',build:{target:"es2022",rollupOptions:{input:{studio:resolve(import.meta.dirname,'index.html'),viewer:resolve(import.meta.dirname,'viewer.html')}}}};
