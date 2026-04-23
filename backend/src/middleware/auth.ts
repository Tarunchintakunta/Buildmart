import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload, UserRole } from '../types/index.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
    const payload = request.user as unknown as JWTPayload;
    if (!payload.userId || !payload.role) {
      return reply.status(401).send({ error: 'Invalid token payload', code: 'INVALID_TOKEN' });
    }
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized — valid Bearer token required', code: 'UNAUTHORIZED' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    await authenticate(request, reply);
    if (reply.sent) return;
    const payload = request.user as unknown as JWTPayload;
    if (!roles.includes(payload.role)) {
      return reply.status(403).send({ error: `Access denied. Required role: ${roles.join(' or ')}`, code: 'FORBIDDEN' });
    }
  };
}

export function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  return requireRole('admin')(request, reply);
}
