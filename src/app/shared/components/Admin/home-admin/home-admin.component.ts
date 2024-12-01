import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { ProductDto } from '../../../../core/models/interface/Product/Product';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, AddProductModalComponent],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  @Input() loggedUser?: UserDataDto;
  subscriptions: Subscription = new Subscription();
  productList?: ProductDto[];

  isAddProduct: boolean = false;
  isEditProduct: boolean = false;
  isViewProduct: boolean = false;

  private productService = inject(ProductService);
  private tostR = inject(MyToastServiceService);

  ngOnInit(): void {
    this.getAllProduct();
  }

  //Get all product of User
  getAllProduct(): void {
    if (this.loggedUser?.userId) {
      // Get all the Products of User
      const sub = this.productService
        .GetProductByUserId$(this.loggedUser.userId)
        .subscribe({
          next: (res: AppResponse<ProductDto[]>) => {
            if (res.isSuccess) {
              this.productList = res.data;
            }
          },
          error: (err) => {
            console.log('Unable to get Product : ', err);
          },
        });

      this.subscriptions.add(sub);
    } else {
      console.log('No user data available');
    }
  }

  openAddProductModal() {
    this.isAddProduct = true;
  }
  closeAddProductModal(value: boolean) {
    this.isAddProduct = false;
    if (value) {
      this.getAllProduct();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
