import Joi from 'joi';

import sequenceService from 'resources/sequence/sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import sequenceAccess from '../middlewares/sequence-access';

const schema = Joi.object({
  name: Joi.string().required(),
  eventName: Joi.string().optional(),
  eventKey: Joi.string().optional(),
  stopEventKey: Joi.string().optional(),
  allowRepeat: Joi.bool().default(false),
  allowMoveToNextSequence: Joi.bool().empty(null).default(false),
  repeatDelay: Joi.number().integer().min(0),
  description: Joi.string()
    .allow('')
    .default('')
    .optional(),
});


type ValidatedData = {
  name: string,
  eventKey?: string,
  eventName?: string,
  stopEventKey?: string,
  allowRepeat: boolean,
  repeatDelay: number,
  description: string,
  allowMoveToNextSequence: boolean,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const trigger = ctx.validatedData;

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, trigger: { ...seq.trigger, ...trigger } };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/trigger', sequenceAccess, validateMiddleware(schema), handler);
};
