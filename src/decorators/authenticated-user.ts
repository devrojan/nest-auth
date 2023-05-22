import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const AuthenticatedUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
})
