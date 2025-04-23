import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import {EbuyCartService} from "../../services/ebuy-cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private ebuycartService: EbuyCartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
//--------------------------------------------------------------------------------
  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.ebuycartService.cartItems;

    // subscribe to the cart totalPrice
    this.ebuycartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.ebuycartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // compute cart total price and quantity
    this.ebuycartService.computeCartTotals();
  }
//--------------------------------------------------------------------------------
  incrementQuantity(theCartItem: CartItem){
    this.ebuycartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem: CartItem){
    this.ebuycartService.decrementQuantity(theCartItem);
  }
  remove(theCartItem: CartItem){
    this.ebuycartService.remove(theCartItem);
  }
}
