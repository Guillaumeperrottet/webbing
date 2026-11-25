import {readFileSync,appendFileSync} from 'node:fs';
import {githubApi,inspectUpdate,mergeUpdate,GATE} from '../../../scripts/dependencies/policy.mjs';
const api=githubApi(process.env.INPUT_TOKEN);
const repository=process.env.GITHUB_REPOSITORY;
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
const selected=Number(event.inputs?.pull_request || 0);
const manual=process.env.GITHUB_EVENT_NAME==='workflow_dispatch'&&event.inputs?.approve_manual==='true';
if(manual&&(!selected||!/^[0-9a-f-]{36}$/.test(event.inputs?.approval_id||'')))throw new Error('Invalid manual approval request.');
const pulls=selected?[await api(`/repos/${repository}/pulls/${selected}`)]:await api(`/repos/${repository}/pulls?state=open&per_page=100`);
for(const pr of pulls.filter(p=>p.user?.login==='dependabot[bot]'&&p.state==='open')){
  try{
    const update=await inspectUpdate(api,repository,pr.number);
    if(update.baseSha)await api(`/repos/${repository}/statuses/${pr.head.sha}`,{method:'POST',body:{state:update.ready?'success':'pending',context:GATE,description:`base:${update.baseSha}`,target_url:`${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`}});
    let message=update.reason;
    if(manual){
      await mergeUpdate(api,repository,pr.number,{expectedHead:event.inputs.expected_head,expectedBase:event.inputs.expected_base,automatic:false});
      message='Mise à jour validée depuis Webbing et fusionnée après nouvelle vérification.';
    }else if(process.env.INPUT_ENABLED==='true'&&update.ready&&update.autoEligible){
      await mergeUpdate(api,repository,pr.number,{expectedHead:pr.head.sha,expectedBase:update.baseSha,automatic:true});
      message='Mise à jour compatible fusionnée après vérification.';
    }
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,`- #${pr.number} · ${update.type} · ${message}\n`);
  }catch(error){
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,`- #${pr.number} · Vérification non aboutie : ${error.message}\n`);
    if(manual)process.exitCode=1;
  }
}
