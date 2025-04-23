import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { EbuyCartService } from "../../services/ebuy-cart.service";
import { EbuyProductService } from "../../services/ebuy-product.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product= new Product();

  constructor(private ebuyProductService: EbuyProductService,
              private ebuycartService: EbuyCartService,
              private route: ActivatedRoute) { }


//--------------------------------------------------------------------------------
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }


//--------------------------------------------------------------------------------
  handleProductDetails() {

    // get the "id" param string. convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.ebuyProductService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
    })
  }


//--------------------------------------------------------------------------------
  addToCart(){
    // console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product.id, this.product.name, this.product.imageUrl, this.product.unitPrice);
    this.ebuycartService.addToCart(theCartItem);
  }
}
