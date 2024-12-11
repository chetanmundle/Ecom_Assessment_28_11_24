import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedProductComponent } from './deleted-product.component';

describe('DeletedProductComponent', () => {
  let component: DeletedProductComponent;
  let fixture: ComponentFixture<DeletedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
