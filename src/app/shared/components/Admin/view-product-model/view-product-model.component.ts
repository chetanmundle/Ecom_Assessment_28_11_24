import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductDto } from '../../../../core/models/interface/Product/Product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-product-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-product-model.component.html',
  styleUrl: './view-product-model.component.css',
})
export class ViewProductModelComponent implements OnInit {
  isLoader: boolean = false;
  @Input() product?: ProductDto;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  onClickCloseBtn(value: boolean) {
    this.closeModal.emit(value);
  }

  ngOnInit(): void {
    console.log(this.product);
  }
}
