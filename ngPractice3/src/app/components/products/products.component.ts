import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { Product } from '../../product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  arr$ = this.productService.products;
  errorMessage = '';
  keyword = new FormControl();
  subscriptions: Subscription[] = [];

  constructor(private productService: ProductService) {}

  productsForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    category: new FormControl(),
  });

  updateForm = new FormGroup({
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

    // Loads initial products
    this.subscriptions.push(this.productService.getProducts().subscribe());

    // search as user types (with 1 second delay)
    this.subscriptions.push(
      this.keyword.valueChanges
        .pipe(
          debounceTime(1000),
          switchMap((input) => {
            return this.productService.searchProduct(input);
          })
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: any) => sub.unsubscribe());
  }

  onSubmit(): void {
    if (this.productsForm.valid) {
      const newProduct: any = {
        title: this.productsForm.value.title ?? '',
        description: this.productsForm.value.description ?? '',
        category: this.productsForm.value.category ?? '',
      };
      this.productService.addProduct(newProduct);
      this.productsForm.reset();
    }
  }

  onDelete(id: number): void {
    this.productService.deleteProduct(id);
  }

  onUpdate(id: number): void {
    if (this.updateForm.valid) {
      const updatedData: any = {
        title: this.updateForm.value.title ?? '',
        description: this.updateForm.value.description ?? '',
        category: this.updateForm.value.category ?? '',
      };
      this.productService.updateProduct(id, updatedData);
      this.updateForm.reset();
    }
  }

  onBlur(): void {
    this.keyword.setValue('');
    this.productService.getProducts().subscribe(); 
  }
}
