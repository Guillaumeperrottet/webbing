import {readFileSync,appendFileSync} from 'node:fs';
import {spawn,execFileSync} from 'node:child_process';
import path from 'node:path';
const root=process.env.GITHUB_WORKSPACE || process.cwd();
const recipe=JSON.parse(readFileSync(path.join(root,'.github/webbing-ci.json'),'utf8'));
const git=(args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const merge=git(['rev-parse','HEAD']),parents=git(['show','-s','--format=%P','HEAD']).split(' ');
const event=process.env.GITHUB_EVENT_PATH?JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')):{};
const testedHead=event.pull_request?.head.sha || merge;
const testedBase=event.pull_request?parents[0]:merge;
if(event.pull_request && (parents.length!==2||parents[1]!==testedHead))throw new Error('The checked out merge commit does not match this pull request.');
const inherited=Object.fromEntries(Object.entries(process.env).filter(([key])=>!/^GITHUB_|^ACTIONS_|^INPUT_|^(GH|NPM|NODE_AUTH)_TOKEN$/.test(key)));
const database='postgresql://postgres:webbing_ci@127.0.0.1:5432/webbing_ci_test';
const anon='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6IndlYmJpbmctY2kiLCJleHAiOjQxMDI0NDQ4MDB9.test-signature-for-isolated-ci-only';
const env={...inherited,CI:'true',NEXT_TELEMETRY_DISABLED:'1',PUPPETEER_SKIP_DOWNLOAD:'true',DATABASE_URL:database,DIRECT_URL:database,AUTH_DATABASE_URL:database,TEST_DATABASE_URL:database,WEBBING_OPS_DATABASE_URL:database,WEBBING_OPS_SECRET:'webbing-ci-only-secret-longer-than-forty-characters',WEBBING_OPS_URL:'http://localhost:3100',BETTER_AUTH_SECRET:'ci-only-secret-longer-than-thirty-two-characters',BETTER_AUTH_URL:'http://localhost:3100',NEXTAUTH_SECRET:'ci-only-secret-longer-than-thirty-two-characters',NEXTAUTH_URL:'http://localhost:3100',NEXT_PUBLIC_APP_URL:'http://localhost:3100',NEXT_PUBLIC_SITE_URL:'http://localhost:3100',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54321',NEXT_PUBLIC_SUPABASE_ANON_KEY:anon,SUPABASE_URL:'http://127.0.0.1:54321',SUPABASE_ANON_KEY:anon,SUPABASE_SERVICE_ROLE_KEY:anon,RESEND_API_KEY:'re_ci_only',STRIPE_SECRET_KEY:'sk_test_ci_only',STRIPE_TEST_SECRET_KEY:'sk_test_ci_only',STRIPE_LIVE_SECRET_KEY:'sk_live_ci_only',STRIPE_WEBHOOK_SECRET:'whsec_ci_only',NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:'pk_test_ci_only',NEXT_PUBLIC_STRIPE_PUBLIC_KEY:'pk_test_ci_only',CLOUDINARY_CLOUD_NAME:'ci-only',NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:'ci-only',CLOUDINARY_API_KEY:'ci-only',CLOUDINARY_API_SECRET:'ci-only',PUSHER_APP_ID:'ci-only',PUSHER_KEY:'ci-only',PUSHER_SECRET:'ci-only',PUSHER_CLUSTER:'eu',NEXT_PUBLIC_PUSHER_KEY:'ci-only',NEXT_PUBLIC_PUSHER_CLUSTER:'eu',EXOSCALE_ACCESS_KEY:'ci-only',EXOSCALE_SECRET_KEY:'ci-only',EXOSCALE_BUCKET:'ci-only',EXOSCALE_REGION:'ch-gva-2',SENTRY_DISABLE_AUTO_UPLOAD:'true',SENTRY_AUTH_TOKEN:'',SENTRY_DSN:'',NEXT_PUBLIC_SENTRY_DSN:'',GOOGLE_CLIENT_ID:'ci-only',GOOGLE_CLIENT_SECRET:'ci-only',ODOO_BASE_URL:'http://127.0.0.1:8069',ODOO_DB:'ci-only',ODOO_LOGIN:'ci-only',ODOO_PASSWORD:'ci-only',PORT:'3100',NODE_OPTIONS:'--max-old-space-size=5120',...recipe.env};
async function run(command,cwd,timeout=900000){
 console.log('::group::'+command.join(' '));
 try{await new Promise((resolve,reject)=>{const process=spawn(command[0],command.slice(1),{cwd,env,stdio:'inherit',timeout});process.on('error',reject);process.on('exit',code=>code===0?resolve():reject(new Error('Command failed: '+command[0]+' (exit '+code+')')));});}finally{console.log('::endgroup::');}
}
for(const app of recipe.applications){
 const cwd=path.resolve(root,app.directory);
 if(cwd!==root&&!cwd.startsWith(root+path.sep))throw new Error('Invalid application directory.');
 const pkg=JSON.parse(readFileSync(path.join(cwd,'package.json'),'utf8'));
 const manager=app.manager;
 await run(manager==='pnpm'?['pnpm','install','--frozen-lockfile']:['npm','ci'],cwd);
 const exec=manager==='pnpm'?['pnpm','exec']:['npx','--no-install'];
 const dependencies={...pkg.dependencies,...pkg.devDependencies};
 if(dependencies.prisma){
  await run([...exec,'prisma','generate'],cwd);
  if(app.database)await run([...exec,'prisma','db','push'],cwd);
 }
 for(const command of app.tests || [])await run(command,cwd);
 await run([manager,'run','build'],cwd);
 if(app.typecheck)await run([...exec,'tsc','--noEmit'],cwd);
 if(app.lint)await run([manager,'run','lint'],cwd);
 const start=app.start || [manager,'run','start','--','--hostname','127.0.0.1','--port','3100'];
 const server=spawn(start[0],start.slice(1),{cwd,env,stdio:['ignore','inherit','inherit'],detached:true});
 let started=false;
 try{
  const deadline=Date.now()+90000;
  while(Date.now()<deadline){
   if(server.exitCode!==null)throw new Error('Application exited before startup.');
   try{await fetch('http://127.0.0.1:3100',{redirect:'manual',signal:AbortSignal.timeout(2000)});started=true;break;}catch{await new Promise(r=>setTimeout(r,750));}
  }
  if(!started)throw new Error('Application startup timed out.');
  for(const test of app.smoke || [{path:'/',status:200,html:true}]){
   let url=new URL(test.path,'http://127.0.0.1:3100'),response;
   for(let hop=0;hop<6;hop++){
    response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(12000)});
    const location=response.headers.get('location');
    if(test.follow===false||response.status<300||response.status>=400||!location)break;
    const next=new URL(location,url);if(next.origin!==url.origin)throw new Error('Unexpected external application redirect.');url=next;
   }
   if(response.status!==test.status)throw new Error(`Smoke test ${test.path}: HTTP ${response.status}, expected ${test.status}.`);
   if(test.location&&response.headers.get('location')!==test.location)throw new Error('Authentication redirect changed.');
   if(test.html&&!/<html[\s>]/i.test(await response.text()))throw new Error('Application did not render an HTML document.');
   console.log(`Smoke test passed: ${test.path} (${response.status})`);
  }
 }finally{try{process.kill(-server.pid,'SIGTERM');}catch{server.kill('SIGTERM');}}
}
if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`head=${testedHead}\nbase=${testedBase}\n`);
