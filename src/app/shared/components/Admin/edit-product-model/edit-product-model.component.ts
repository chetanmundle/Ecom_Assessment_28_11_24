import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ProductDto,
  UpdateProductDto,
} from '../../../../core/models/interface/Product/Product';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { ImageService } from '../../../../core/services/ImageService/image.service';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product-model',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product-model.component.html',
  styleUrl: './edit-product-model.component.css',
})
export class EditProductModelComponent implements OnInit, OnDestroy {
  isLoader: boolean = false;
  @Input() product?: ProductDto;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedFile: File | null = null;

  isSubmitClick: boolean = false;

  productForm: FormGroup;
  subscriptions: Subscription = new Subscription();

  private productService = inject(ProductService);
  private imageService = inject(ImageService);
  private tostR = inject(MyToastServiceService);

  constructor(private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required]],
      productImage: [''],
      category: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      sellingPrice: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      //   createdBy: number;
    });
  }
  ngOnInit(): void {
    this.productForm.get('productName')?.setValue(this.product?.productName);
    this.productForm.get('productImage')?.setValue(this.product?.productImage);
    this.productForm.get('category')?.setValue(this.product?.category);
    this.productForm.get('brand')?.setValue(this.product?.brand);
    this.productForm.get('sellingPrice')?.setValue(this.product?.sellingPrice);
    this.productForm
      .get('purchasePrice')
      ?.setValue(this.product?.purchasePrice);
    this.productForm
      .get('purchaseDate')
      ?.setValue(this.product?.purchaseDate.toString().split('T')[0]);
    this.productForm.get('stock')?.setValue(this.product?.stock);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickCloseBtn(value: boolean) {
    this.closeModal.emit(value);
  }

  // on select file
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  //this fuction will call when form is submitted
  onClickUpdateProduct() {
    if (this.productForm.invalid) {
      this.isSubmitClick = true;
      return;
    }

    //Checking Values
    if (
      Number(this.productForm.get('sellingPrice')?.value) <
      Number(this.productForm.get('purchasePrice')?.value)
    ) {
      this.tostR.showWarning(
        'SellingPrice Should Be Greater than Purchase Price'
      );
      return;
    }

    this.isLoader = true;

    if (this.productForm.invalid) {
      this.isLoader = false;
      return;
    }
    if (this.selectedFile) {
      const sub = this.imageService.uploadImage$(this.selectedFile).subscribe({
        next: (res: AppResponse<string>) => {
          if (res.isSuccess) {
            this.productForm.get('productImage')?.setValue(res.data);
            this.updateProduct();
          } else {
            this.isLoader = false;
            this.tostR.showWarning(res.message);

            console.log('Unble to Save the Profile Image : ', res.message);
          }
        },
        error: (err: Error) => {
          this.isLoader = false;
          console.log('Unble to Save the Image', err.message);
        },
      });

      this.subscriptions.add(sub);
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.isLoader = true;
    console.log('Here');

    if (this.product) {
      const payload: UpdateProductDto = {
        productId: this.product?.productId,
        productName: this.productForm.get('productName')?.value,
        brand: this.productForm.get('brand')?.value,
        category: this.productForm.get('category')?.value,
        productImage: this.productForm.get('productImage')?.value,
        purchaseDate: this.productForm.get('purchaseDate')?.value,
        sellingPrice: Number(this.productForm.get('sellingPrice')?.value),
        purchasePrice: Number(this.productForm.get('purchasePrice')?.value),
        stock: Number(this.productForm.get('stock')?.value),
      };

      this.productService.UpdateProduct$(payload).subscribe({
        next: (res: AppResponse<null>) => {
          if (res.isSuccess) {
            this.onClickCloseBtn(true);
            this.tostR.showSuccess(res.message);
            this.isLoader = false;
          } else {
            this.tostR.showError(res.message);
          }
        },
        error: (err: Error) => {
          this.isLoader = false;
          console.log('erro to update : ', err);
          this.tostR.showError('Server Error...!');
        },
      });
    }
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }
}
