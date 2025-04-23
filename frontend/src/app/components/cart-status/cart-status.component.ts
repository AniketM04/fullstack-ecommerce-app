import { Component, OnInit } from '@angular/core';
import { EbuyCartService } from "../../services/ebuy-cart.service";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private ebuycartService: EbuyCartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }
//--------------------------------------------------------------------------------
  updateCartStatus(){

    // subscribe to the cart totalPrice
    this.ebuycartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.ebuycartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }

}
