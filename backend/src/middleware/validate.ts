import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      request.body = schema.parse(request.body);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return reply.status(400).send({ error: 'Bad request', code: 'BAD_REQUEST' });
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      request.query = schema.parse(request.query) as typeof request.query;
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({
          error: 'Query validation failed',
          code: 'VALIDATION_ERROR',
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return reply.status(400).send({ error: 'Bad request', code: 'BAD_REQUEST' });
    }
  };
}
