import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { EbuyProductService } from "../../services/ebuy-product.service";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private ebuyProductService: EbuyProductService) { }

  ngOnInit() {
    this.listProductCategories();
  }

//--------------------------------------------------------------------------------
  listProductCategories() {

    this.ebuyProductService.getProductCategories().subscribe(
      data => {
        // console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
