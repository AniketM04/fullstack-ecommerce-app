import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { EbuyShopFormService } from '../../services/ebuy-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { EbuyCartService } from "../../services/ebuy-cart.service";
import { WhitespaceValidators } from "../../validators/whitespace-validators";
import { CheckoutService } from "../../services/checkout.service";
import { Router } from '@angular/router';
import {Order} from 'src/app/common/order';
import {OrderItem} from 'src/app/common/order-item';
import {Purchase} from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private ebuyShopFormService: EbuyShopFormService,
              private ebuycartService:EbuyCartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  // Getter
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ngOnInit(): void {

    this.reviewCartDetails();
//----------------------------------------------------------------------------------------------------------------------------------------------

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), WhitespaceValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),WhitespaceValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });


//----------------------------------------------------------------------------------------------------------------------------------------------
  // populate credit card months

  const startMonth: number = new Date().getMonth() + 1;
  //console.log("StartMonth: " + startMonth);

  this.ebuyShopFormService.getCreditCardMonths(startMonth).subscribe(
    data => {
      //console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    }
  );

  // populate credit card years

  this.ebuyShopFormService.getCreditCardYears().subscribe(
    data => {
      // console.log("Retrieved credit card years: " + JSON.stringify(data));
      this.creditCardYears = data;
    }
  );

  // populate countries

  this.ebuyShopFormService.getCountries().subscribe(
    data => {
      // console.log("Retrieved countries: " + JSON.stringify(data));
      this.countries = data;
    }
  );
  }
//----------------------------------------------------------------------------------------------------------------------------------------------
  reviewCartDetails(){
    // subscribe to cartService.totalQuantity
    this.ebuycartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.ebuycartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }




//----------------------------------------------------------------------------------------------------------------------------------------------
// Copy Shipping to Billing Address
  copyShippingAddressToBillingAddress(checked: boolean) {
    if (checked) {
      this.checkoutFormGroup.controls?.['billingAddress']
        .setValue(this.checkoutFormGroup.controls?.['shippingAddress'].value);

      // fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls?.['billingAddress'].reset();

      // fix for states
      this.billingAddressStates = [];
    }
  }



//----------------------------------------------------------------------------------------------------------------------------------------------
  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order(this.totalQuantity, this.totalPrice);

    // get cart items
    const cartItems = this.ebuycartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem.imageUrl!,
                                                                              tempCartItem.unitPrice!,
                                                                              tempCartItem.quantity,
                                                                              tempCartItem.id!));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  resetCart() {
    // reset cart data
    this.ebuycartService.cartItems = [];
    this.ebuycartService.totalPrice.next(0);
    this.ebuycartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }

//----------------------------------------------------------------------------------------------------------------------------------------------
  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with current month

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.ebuyShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        // console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }



//----------------------------------------------------------------------------------------------------------------------------------------------
  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    // console.log(`${formGroupName} country code: ${countryCode}`);
    // console.log(`${formGroupName} country name: ${countryName}`);

    this.ebuyShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item[state] by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
