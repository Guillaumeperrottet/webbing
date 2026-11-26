import {readFileSync,appendFileSync} from 'node:fs';
import {githubApi,refreshDependencyBranch,ATTESTATION,GATE} from '../../../scripts/dependencies/policy.mjs';
const api=githubApi(process.env.INPUT_TOKEN);
const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
if(process.env.GITHUB_EVENT_NAME!=='workflow_dispatch')throw new Error('Tests require a manual request.');
const update=await refreshDependencyBranch(api,process.env.GITHUB_REPOSITORY,Number(event.inputs?.pull_request),{
 expectedHead:event.inputs?.expected_head,expectedBase:event.inputs?.expected_base,
});
const url=`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
for(const context of [ATTESTATION,GATE])await api(`/repos/${process.env.GITHUB_REPOSITORY}/statuses/${update.head}`,{method:'POST',body:{state:'pending',context,description:`base:${update.base}`,target_url:url}});
appendFileSync(process.env.GITHUB_OUTPUT,`head=${update.head}\nbase=${update.base}\n`);
