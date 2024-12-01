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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { Subscription } from 'rxjs';
import { CreateProductDto } from '../../../../core/models/interface/Product/Product';
import { ImageService } from '../../../../core/services/ImageService/image.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-product-modal.component.html',
  styleUrl: './add-product-modal.component.css',
})
export class AddProductModalComponent implements OnInit, OnDestroy {
  @Input() userId?: number;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  productForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  selectedFile: File | null = null;
  isLoader: boolean = false;

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

  onClickCloseBtn(value: boolean) {
    this.closeModal.emit(value);
  }
  ngOnInit(): void {
    console.log('On Init', this.userId);
  }

  // on select file
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // fuction for create new Product
  onClickCreateProduct() {
    this.isLoader = true;
    if (this.selectedFile) {
      const sub = this.imageService.uploadImage$(this.selectedFile).subscribe({
        next: (res: AppResponse<string>) => {
          if (res.isSuccess) {
            this.productForm.get('productImage')?.setValue(res.data);
            this.saveProduct();
          } else {
            this.tostR.showWarning(res.message);
            this.isLoader = false;
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
      this.saveProduct();
    }
  }

  saveProduct() {
    this.isLoader = true;
    if (!this.productForm.invalid) {
      const payload: CreateProductDto = {
        productName: this.productForm.get('productName')?.value,
        productImage: this.productForm.get('productImage')?.value,
        category: this.productForm.get('category')?.value,
        brand: this.productForm.get('brand')?.value,
        sellingPrice: Number(this.productForm.get('sellingPrice')?.value),
        purchasePrice: Number(this.productForm.get('purchasePrice')?.value),
        purchaseDate: this.productForm.get('purchaseDate')?.value,
        stock: Number(this.productForm.get('stock')?.value),
        createdBy: this.userId || 0,
      };

      if (payload.sellingPrice < payload.purchasePrice) {
        this.tostR.showWarning(
          'Selling Price should be greater than Purchase Price'
        );
        this.isLoader = false
        return;
      }

      const sub = this.productService.CreateProduct$(payload).subscribe({
        next: (res: AppResponse<null>) => {
          if (res.isSuccess) {
            this.isLoader = false;
            this.onClickCloseBtn(true);
            this.tostR.showSuccess('Product Created Successfully');
          } else {
            this.isLoader = false;
            this.tostR.showError(res.message);
          }
        },
        error: (err: Error) => {
          this.isLoader = false;
          this.tostR.showError(err.message);
          console.log('eer', err);
        },
      });

      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy(): void {
    console.log('Call Destroy');
  }
}
