import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, range, throwError, timer, zip } from 'rxjs';
import { catchError, map, mergeMap, retryWhen } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly maxTries = 3;
  private readonly delay = 250;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen(attempts =>
        zip(range(1, this.maxTries + 1), attempts).pipe(
          mergeMap(([i, err]) => (i > this.maxTries) ? throwError(err) : of(i)),
          map(i => i * i),
          mergeMap(v => timer(v * this.delay)),
        ),
      ),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        }
        else {
          console.log('this is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        console.log(errorMsg);
        return throwError(errorMsg);
      })
    );
  }
}
