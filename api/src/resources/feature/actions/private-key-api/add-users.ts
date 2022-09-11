import Joi from 'joi';
import { uniq } from 'lodash';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env, privateTokenAuth } from 'resources/application';
import { featureService, Feature } from 'resources/feature';
import { getFlatFeature } from '../../utils/get-flat-feature';
import featureExists from '../../middlewares/feature-exists.middleware';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  users: Joi.array()
    .items(Joi.string().trim().email())
    .min(1)
    .max(1000)
    .required(),
});

type ValidatedData = {
  env: Env;
  users: string[];
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { featureName } = ctx.params;
  const { env, users } = ctx.validatedData;

  let feature = await featureService.updateOne({ applicationId: application._id, name: featureName }, (doc) => {
    const oldUsers = doc.envSettings[env].users;
    const newUsers = [...oldUsers, ...users];
    const uniqueUsers = uniq(newUsers);
    doc.envSettings[env].users = uniqueUsers;

    return doc;
  });

  if (!feature) {
    feature = await featureService.findOne({ applicationId: application._id, name: featureName }) as Feature;
  }

  ctx.body = getFlatFeature(feature, env);
}

export default (router: AppRouter) => {
  router.put(
    '/:featureName/users',
    extractTokenFromHeader,
    privateTokenAuth,
    featureExists,
    validateMiddleware(schema),
    handler,
  );
};
