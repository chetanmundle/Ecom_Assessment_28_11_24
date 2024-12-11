import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { ProductDto } from '../../../../core/models/interface/Product/Product';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deleted-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deleted-product.component.html',
  styleUrl: './deleted-product.component.css',
})
export class DeletedProductComponent implements OnInit, OnDestroy {
  loggedUser?: UserDataDto;
  deletedProductList?: ProductDto[];

  subscription: Subscription = new Subscription();
  constructor(
    private productService: ProductService,
    private userService: UserService,
    private tostR: MyToastServiceService
  ) {}
  ngOnInit(): void {
    const sub = this.userService.loggedUser$.subscribe((res: UserDataDto) => {
      this.loggedUser = res;
      this.GetAllDeletedProduct(this.loggedUser.userId);
    });

    this.subscription.add(sub);
  }

  // Method to get all deleted products of this perticular admin
  GetAllDeletedProduct(userId: number) {
    const sub = this.productService
      .GetAllDeletedProductByAdminId$(userId)
      .subscribe({
        next: (res: AppResponse<ProductDto[]>) => {
          if (res.isSuccess) {
            this.deletedProductList = res.data;
            console.log('Deleted Products : ', this.deletedProductList);
          }
        },
        error: (err: Error) => {
          console.log('Error to get the Deleted Product');
        },
      });

    this.subscription.add(sub);
  }

  // fuction to restore Product
  onclickRestore(productId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You Want to Restore this',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const sub = this.productService
          .RestoreDeletedProduct$(productId)
          .subscribe({
            next: (res: AppResponse<null>) => {
              if (res.isSuccess) {
                Swal.fire({
                  title: `${res.message}`,
                  text: '',
                  icon: 'success',
                });
                if (this.loggedUser) {
                  this.GetAllDeletedProduct(this.loggedUser?.userId);
                }
              } else {
                this.tostR.showSuccess(res.message);
              }
            },
            error: (err: Error) => {
              console.log('Unble to Recover the Product : ', err);
            },
          });

        this.subscription.add(sub);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
