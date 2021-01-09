import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {Book} from '../book-list/books.model';

@Injectable({ providedIn: 'root' })

export class GoogleBooksService {
    constructor(private http: HttpClient) {}

    getBooks(): Observable<Array<Book>> {
      return this.http.get<{ items: Book[] }>(
          'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
        )
        .pipe(map((books) => books.items || []));
    }
  }

// export class GoogleBooksService{
//     constructor( private http: HttpClient){}
//     getbooks(): Observable<Array<Book>{
//         // tslint:disable-next-line:whitespace
//         // tslint:disable-next-line:no-unused-expression
//         this.http.get<{items: Book[]}>(
//             'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
//           )
//           .pipe(map((books) => books.items || []));
//     }
// }
