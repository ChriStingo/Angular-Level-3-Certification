import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_DURATION_IN_SECONDS } from './app.module';

type CacheData = {
  timestamp: number
  data: any
}

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  // Inject the cache duration in seconds from app.module.ts
  constructor(@Inject(CACHE_DURATION_IN_SECONDS) readonly expiryAfterSeconds: number) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler 
  ): Observable<HttpEvent<any>> {
    /**
     * Only cache GET requests
     * If data is in cache and it's not expired, return it
     * If the condition above is not met, make the request and cache the response
     */
    if(req.method === 'GET') {
      const cachedResponse = this.loadFromCache(req.urlWithParams);
      if(cachedResponse) {
        return of(new HttpResponse({ body: cachedResponse }));
      }
      return next.handle(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                this.saveToCache(req.urlWithParams, event?.body);
            } 
        })
    );
    }
    return next.handle(req);
  }

  saveToCache(key: string, value: any) {
    if(value) {
      const data: CacheData = {
        data: value,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  loadFromCache(key: string): any {
    const cachedData: CacheData = JSON.parse(localStorage.getItem(key) ?? '{}');
    if(cachedData?.timestamp && Date.now() - cachedData.timestamp < this.expiryAfterSeconds * 1000) {
      return cachedData.data;

    }
    localStorage.removeItem(key);
    return null;
  }
}

