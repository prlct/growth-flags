import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import pipelineService from 'resources/pipeline/pipeline.service';
import { Env } from '../index';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
});

type ValidatedData = {
  name: string,
  env: Env,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { name, env } = ctx.validatedData;
  const { applicationId } = ctx.params;
  const { results: pipelines } = await pipelineService.find({
    applicationId,
    deletedOn: { $exists: false },
  }, { projection: { index: 1 }, sort: { index: -1 }, limit: 1 });

  const index = (pipelines[0]?.index ?? -1) + 1;

  // todo: create 2 empty sequences

  ctx.body = await pipelineService.insertOne({
    applicationId,
    name,
    env,
    index,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/pipelines', applicationAuth, validateMiddleware(schema), handler);
};
