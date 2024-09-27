import { applyDecorators, Controller } from '@nestjs/common';

export function AdminController(path: string) {
  return applyDecorators(Controller(`admin/${path}`));
}