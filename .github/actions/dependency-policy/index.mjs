import {readFileSync,appendFileSync} from 'node:fs';
import {githubApi,inspectUpdate,mergeUpdate} from '../../../scripts/dependencies/policy.mjs';
const api=githubApi(process.env.INPUT_TOKEN);
const repository=process.env.GITHUB_REPOSITORY;
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
const selected=Number(event.inputs?.pull_request || 0);
const pulls=selected?[await api(`/repos/${repository}/pulls/${selected}`)]:await api(`/repos/${repository}/pulls?state=open&per_page=100`);
for(const pr of pulls.filter(p=>p.user?.login==='dependabot[bot]')){
  try{
    const update=await inspectUpdate(api,repository,pr.number);
    let message=update.reason;
    if(process.env.INPUT_ENABLED==='true'&&update.ready&&update.autoEligible){await mergeUpdate(api,repository,pr.number,{expectedHead:pr.head.sha,expectedBase:update.baseSha,automatic:true});message='Mise à jour compatible fusionnée après vérification.';}
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,`- #${pr.number} · ${update.type} · ${message}\n`);
  }catch(error){appendFileSync(process.env.GITHUB_STEP_SUMMARY,`- #${pr.number} · Vérification non aboutie : ${error.message}\n`);}
}
