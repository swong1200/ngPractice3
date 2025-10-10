import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
    arr$ = this.productService.getProducts()
  errorMessage = '';
  keyword = new FormControl();
  subscriptions: Subscription[] = []
  
  constructor(private productService: ProductService) {}

  productsForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    category: new FormControl(),
  });
  

  ngOnInit(): void {
    // Old Code
    // this.productService.getProducts().subscribe({
    //   next: (res: any) => {
    //     this.arr = [...res.products];
    //     console.log(this.arr);
    //   },
    //   error: (err: Error) => {
    //     console.error('Error:', err.message);
    //     this.errorMessage = err.message;
    //   },
    //   complete: () => console.log('Completed'),
    // });
    this.productService.products.subscribe(data => {
    console.log('BehaviorSubject emitted:', data);
    console.log('Is it an array?', Array.isArray(data));
    console.log('Length:', data?.length);
    console.log('First item:', data?.[0]);
  });

    // Loads initial products
    this.subscriptions.push(this.productService.getProducts().subscribe())

    // search as user types (with 1 second delay)
    this.subscriptions.push(this.keyword.valueChanges.pipe(debounceTime(1000), switchMap((input)=> {
        return this.productService.searchProduct(input)
    })).subscribe({
      next: (res: any) => {
        console.log(res)
      },
    }))
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub:any)=> sub.unsubscribe())
  }



  onSubmit(): void {
    if (this.productsForm.valid) {
      const newProduct: any = {
        // id: (this.arr$.length ?? 0) + 2,
        title: this.productsForm.value.title ?? '',
        description: this.productsForm.value.description ?? '',
        category: this.productsForm.value.category ?? '',
      };
      console.log(this.productService.products)
    //   this.arr = [...(this.arr ?? []), newProduct];
      this.productsForm.get('title')?.reset();
      this.productsForm.get('description')?.reset();
      this.productsForm.get('category')?.reset();
    }
  }
  
}
