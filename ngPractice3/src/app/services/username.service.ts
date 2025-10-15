import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
    private url: string = 'https://jsonplaceholder.typicode.com/users';
    users: BehaviorSubject<any> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.url).pipe(
        tap((data: any) => {
            this.users.next(data)
        }),
        catchError((err) => {
            console.error(`Error fetching users: ${err}`)
            this.users.next([])
            return of({ users: [] })
        })
    )
  }
}
