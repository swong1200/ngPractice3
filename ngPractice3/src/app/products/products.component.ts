import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService) {}

    productsForm = new FormGroup({
        title: new FormControl(),
        description: new FormControl(),
        category: new FormControl()
    })
  arr?: any[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.arr = [...res.products];
        console.log(this.arr);
      },
      error: (err: Error) => {
        console.error('Error:', err.message);
        this.errorMessage = err.message;
      },
      complete: () => console.log('Completed'),
    });
  }

  onSubmit(): void {
    if (this.productsForm.valid) {
        const newProduct: any = {
            id: (this.arr?.length ?? 0) + 2,
            title: this.productsForm.value.title ?? "",
            description: this.productsForm.value.description ?? "",
            category: this.productsForm.value.category ?? ""
        }
        this.arr = [...(this.arr ?? []), newProduct]
        this.productsForm.get('title')?.reset()
        this.productsForm.get('description')?.reset()
        this.productsForm.get('category')?.reset()
    }
  }
}
