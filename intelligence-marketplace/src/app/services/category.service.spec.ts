import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../Types/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a category', () => {
    const dummyCategory: Category = {
      id: 1,
      name: 'Test Category',

    };

    service.createCategory(dummyCategory).subscribe(category => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne('/api/categories');
    expect(req.request.method).toBe('POST');
    req.flush(dummyCategory);
  });

  it('should get all categories', () => {
    const dummyCategories: Category[] = [
      { id: 1, name: 'Category 1'},
      { id: 2, name: 'Category 2' }
    ];

    service.getAllCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne('/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });
});
