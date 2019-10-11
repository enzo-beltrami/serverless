'use strict';

const { Context } = require('@serverless/core');
// TODO: change once component is published to npm
const KnativeServing = require('../../../../../knative/components/knative-serving/serverless.js');
const { getName, getRepository, getTag } = require('../../shared/utils');

function ensureKnativeService(funcName) {
  const { service } = this.serverless.service;
  const { username } = this.serverless.service.provider.docker;

  const ctx = new Context();
  const serving = new KnativeServing(undefined, ctx);

  const name = getName(service, funcName);
  const repository = getRepository(username, name);
  const tag = getTag();

  const inputs = {
    name,
    repository,
    tag,
  };

  this.serverless.cli.log('Deploying Knative service...');

  return serving.default(inputs);
}

module.exports = ensureKnativeService;
