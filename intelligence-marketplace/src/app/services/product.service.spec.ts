import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../Types/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a product', () => {
    const dummyProduct: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      categoryId: 1
    };

    service.createProduct(dummyProduct).subscribe(product => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne('/api/products/1');
    expect(req.request.method).toBe('POST');
    req.flush(dummyProduct);
  });
});
