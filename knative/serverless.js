const path = require('path');
const { Component } = require('@serverless/core');

const dockerCredentials = require('../docker-creds.json');

const name = 'test-func';
const repository = 'pmuens/test';
const tag = 'latest';

class Test extends Component {
  async default() {
    this.context.credentials = {
      docker: {
        username: dockerCredentials.username,
        password: dockerCredentials.password,
      },
    };

    const docker = await this.load('./components/knative-docker');
    const knativeServing = await this.load('./components/knative-serving');

    // manually setting the credentials of the child-component here
    docker.context.credentials = this.context.credentials;

    const dockerRes = await docker.default({
      context: path.join(__dirname, '..', 'tmp', 'knative'),
      dockerfile: 'hello-world.dockerfile',
      repository,
      tag,
      push: true,
    });

    const knativeServingRes = await knativeServing.default({
      name,
      repository,
      tag,
    });

    return {
      docker: dockerRes,
      knativeServing: knativeServingRes,
    };
  }

  async remove() {
    const docker = await this.load('./components/docker');
    const knativeServing = await this.load('./components/serving');

    const dockerRes = await docker.remove({
      context: path.join(__dirname, '..', 'tmp', 'knative'),
      dockerfile: 'hello-world.dockerfile',
      repository,
      tag,
      push: true,
    });

    const knativeServingRes = await knativeServing.remove({
      name,
      repository,
      tag,
    });

    return {
      docker: dockerRes,
      knativeServing: knativeServingRes,
    };
  }
}

module.exports = Test;
