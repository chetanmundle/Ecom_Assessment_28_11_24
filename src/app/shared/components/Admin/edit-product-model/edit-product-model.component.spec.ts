import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductModelComponent } from './edit-product-model.component';

describe('EditProductModelComponent', () => {
  let component: EditProductModelComponent;
  let fixture: ComponentFixture<EditProductModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
