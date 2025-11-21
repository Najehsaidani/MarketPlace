import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDemandComponent } from './seller-demand.component';

describe('SellerDemandComponent', () => {
  let component: SellerDemandComponent;
  let fixture: ComponentFixture<SellerDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerDemandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});