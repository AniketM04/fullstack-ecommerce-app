import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EbuyProductService {

  // private baseUrl = 'http://localhost:8080/api/products?size=100'; // to check all products 100 products are displayed
  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

//----------------------------------------------------------------------------------------------------------------------
  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

//----------------------------------------------------------------------------------------------------------------------
getProductListPaginate(thePage: number,
                       thePageSize: number,
                       theCategoryId: number): Observable<GetResponseProducts> {
  // need to build URL based on category id, page and size
  const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
                    `&page=${thePage}&size=${thePageSize}`

  return this.httpClient.get<GetResponseProducts>(searchUrl);
}

//----------------------------------------------------------------------------------------------------------------------
// Product List by Category ID
  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
}

//----------------------------------------------------------------------------------------------------------------------
// Search Product by Name
  searchProducts(theKeyword: string): Observable<Product[]> {
  // need to build URL based on keyword
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

  return this.getProducts(searchUrl);
}

//----------------------------------------------------------------------------------------------------------------------
searchProductsPaginate(thePage:number,
                       thePageSize:number,
                       theKeyword:string):Observable<GetResponseProducts> {

  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` +
                    `&page=${thePage}&size=${thePageSize}`;

  return this.httpClient.get<GetResponseProducts>(searchUrl);
}

//----------------------------------------------------------------------------------------------------------------------
private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
            map((response) => response._embedded.products));
}

//----------------------------------------------------------------------------------------------------------------------
// Product Categories Dynamic fetch
getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductsCategories>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory));
}

}

//----------------------------------------------------------------------------------------------------------------------
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

//----------------------------------------------------------------------------------------------------------------------
interface GetResponseProductsCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
