#!/usr/bin/env node

const axios = require('axios');
const { Command } = require('commander');
require('dotenv').config();

const program = new Command();

program
  .option('-r, --repo <name>', 'Repository name')
  .option('-t, --team <slug>', 'Team slug')
  .parse(process.argv);

const options = program.opts();

if (!options.repo || !options.team) {
  console.error('Repository name and team slug are required.');
  process.exit(1);
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = process.env.ORG_NAME;

if (!GITHUB_TOKEN || !ORG_NAME) {
  console.error('GitHub token and organization name are required.');
  process.exit(1);
}

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

async function createRepo(repoName) {
  try {
    const response = await axios.post(
      `https://api.github.com/orgs/${ORG_NAME}/repos`,
      { name: repoName },
      { headers }
    );
    console.log(`Repository '${repoName}' created successfully.`);
    return response.data;
  } catch (error) {
    console.error(`Error creating repository: ${error.response.data.message}`);
    process.exit(1);
  }
}

async function addTeamToRepo(repoName, teamSlug) {
  try {
    await axios.put(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${teamSlug}/repos/${ORG_NAME}/${repoName}`,
      { permission: 'push' },
      { headers }
    );
    console.log(`Team '${teamSlug}' added to repository '${repoName}' with write access.`);
  } catch (error) {
    console.error(`Error adding team to repository: ${error.response.data.message}`);
    process.exit(1);
  }
}

async function enableAutoDeleteBranches(repoName) {
  try {
    await axios.patch(
      `https://api.github.com/repos/${ORG_NAME}/${repoName}`,
      { delete_branch_on_merge: true },
      { headers }
    );
    console.log(`'Automatically delete head branches' enabled for repository '${repoName}'.`);
  } catch (error) {
    console.error(`Error enabling 'Automatically delete head branches': ${error.response.data.message}`);
    process.exit(1);
  }
}

async function main() {
  const repo = options.repo;
  const team = options.team;

  await createRepo(repo);
  await addTeamToRepo(repo, team);
  await enableAutoDeleteBranches(repo);
}

main();
