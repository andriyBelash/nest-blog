import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';

@Injectable()
export class GlobalFormDataInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    if (request.headers['content-type']?.includes('multipart/form-data')) {
      const multerInstance = multer();
      await new Promise<void>((resolve, reject) => {
        multerInstance.any()(request, request.res, (error: any) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    return next.handle();
  }
}
