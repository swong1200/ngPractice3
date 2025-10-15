import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, tap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url: string = 'https://dummyjson.com/products';
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.url).pipe(
      tap((data: any) => {
        this.products.next(data.products);
      }),
      catchError((err) => {
        console.error('Error fetching products', err);
        this.products.next([]);
        return of({ products: [] });
      })
    );
  }

  searchProduct(keyword: string) {
    return this.http.get(this.url + '/search?q=' + keyword).pipe(
      tap((data: any) => {
        this.products.next(data.products);
      }),
      catchError((err) => {
        console.error('Error searching products', err);
        this.products.next([]);
        return of({ products: [] });
      })
    );
  }

  addProduct(
    product: Pick<Product, 'title' | 'description' | 'category'> &
      Partial<Product>
  ): void {
    const currentProducts = this.products.value;
    const newProduct: Product = {
      id: Math.max(...currentProducts.map((p) => p.id), 0) + 1,
      title: product.title,
      description: product.description,
      category: product.category,
    };
    this.products.next([...currentProducts, newProduct]);
  }

  updateProduct(id: number, updatedProduct: Partial<Product>): void {
    const currentProducts = this.products.value;
    const updatedProducts = currentProducts.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    this.products.next(updatedProducts);
  }

  deleteProduct(id: number): void {
    const currentProducts = this.products.value;
    const filteredProducts = currentProducts.filter(
      (product) => product.id !== id
    );
    this.products.next(filteredProducts);
  }
}
