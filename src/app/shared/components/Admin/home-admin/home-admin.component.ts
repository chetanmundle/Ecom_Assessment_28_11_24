import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { ProductDto } from '../../../../core/models/interface/Product/Product';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { ViewProductModelComponent } from '../view-product-model/view-product-model.component';
import { EditProductModelComponent } from '../edit-product-model/edit-product-model.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    AddProductModalComponent,
    ViewProductModelComponent,
    EditProductModelComponent,
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  @Input() loggedUser?: UserDataDto;
  subscriptions: Subscription = new Subscription();
  productList?: ProductDto[];
  currentProduct?: ProductDto;

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

  // for add product
  openAddProductModal() {
    this.isAddProduct = true;
  }
  closeAddProductModal(value: boolean) {
    this.isAddProduct = false;
    if (value) {
      this.getAllProduct();
    }
  }

  // for view
  onClickViewProductBtn(product: ProductDto) {
    this.currentProduct = product;
    this.isViewProduct = true;
  }
  onCloseViewProduct() {
    this.isViewProduct = false;
  }

  // onClick Edit fuction
  onClickEdit(product: ProductDto) {
    this.currentProduct = product;
    this.isEditProduct = true;
  }

  onCloseEdit(value: boolean) {
    this.isEditProduct = false;
    if (value) {
      this.getAllProduct();
    }
  }

  // Delete PRoduct by ProductID
  onClickDelete(productId: number) {
    if (!confirm('Do you Want to Delete this Product ?')) {
      return;
    }
    this.productService.DeleteProductById$(productId).subscribe({
      next: (res: AppResponse<any>) => {
        if (res.isSuccess) {
          this.tostR.showSuccess(res.message);
          this.getAllProduct();
        } else {
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        console.log('Unable to delete : ', err);

        this.tostR.showError(err.message);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
