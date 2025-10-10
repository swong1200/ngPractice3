import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, tap } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string = 'https://dummyjson.com/products';
  products: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.url).pipe(
        tap((data: any)=> {
            console.log('getProducts - Full response:', data);
        console.log('getProducts - Products array:', data.products);
        console.log('Is array?', Array.isArray(data.products));
         this.products.next(data.products)
        }    
    ))
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.url + '/add', + product)
    // return this.http.post(don't know the url + input)
  }

  searchProduct(keyword: string) {
    return this.http.get(this.url + '/search?q=' + keyword).pipe(tap((data: any)=> this.products.next(data.products)))
  }

//   manage behavior subject to emit new values when you add or delete products
}
