import {FormControl, ValidationErrors} from "@angular/forms";

export class WhitespaceValidators {

  // whitespace validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors {

    // check if string contains whitespace
    if((control.value != null) && (control.value.trim().length === 0)){

      // return error object: String invalid
      return { 'notOnlyWhitespace': true };

    } else {
      // Invalid String
      return  null;
    }
  }
}
