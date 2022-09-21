import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';
import { Env } from 'resources/application';
import { publicTokenAuth, extractTokenFromQuery } from 'resources/application';
import { userService } from 'resources/user';
import { calculateFlagsForUser } from './helpers';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string().trim(),
});

type ValidatedData = {
  env: Env;
  email?: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email } = ctx.validatedData;

  let user = null;
  if (email) {
    user = await userService.findOne({ email, applicationId: application._id, env });
    if (!user) {
      user = { email };
    }
  }

  const features = await featureService.getFeaturesForEnv(application._id, env);
  
  const flagsForUser = await calculateFlagsForUser(features, user);
 
  const configs: { [key: string]: boolean } = {};

  ctx.body = { features: flagsForUser, configs };
}

export default (router: AppRouter) => {
  router.get(
    '/features',
    extractTokenFromHeader, 
    extractTokenFromQuery, 
    publicTokenAuth,
    validateMiddleware(schema), 
    handler,
  );
};
