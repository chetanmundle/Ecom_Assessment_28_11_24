import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductModelComponent } from './view-product-model.component';

describe('ViewProductModelComponent', () => {
  let component: ViewProductModelComponent;
  let fixture: ComponentFixture<ViewProductModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProductModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
