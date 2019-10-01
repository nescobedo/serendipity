import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DynamicFormModel, DynamicFormService } from 'dynamic-forms';

import { AuthService, User } from 'auth';

import { LoggerService } from 'utils';

const REGISTER_FORM = 'register-form';

@Component({
  selector: 'auth-local-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  public formModel: DynamicFormModel;

  private returnUrl: string;

  constructor(private authService: AuthService,
              private dynamicFormService: DynamicFormService,
              private route: ActivatedRoute,
              private router: Router,
              private logger: LoggerService) {}

  public ngOnInit() {

    this.logger.info('RegisterComponent: ngOnInit()');

    if (this.authService.isAuthenticated()) {

      this.router.navigate(['/']);

    } else {

      this.createForm();
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  }

  async createForm() {

    this.formModel = await this.dynamicFormService.getFormMetadata(REGISTER_FORM);
    this.formGroup = this.dynamicFormService.createGroup(this.formModel);
  }

  public ngOnDestroy() {
    this.logger.info('RegisterComponent: ngOnDestroy()');
  }

  //
  // Misc
  //

  public isValid() {

    let valid = true;

    if (this.formGroup) {
      valid = this.formGroup.valid;
    }

    return valid;
  }

  //
  // Command events
  //

  public onSubmit() {

    // <dynamic-form (keyup.enter)="onSubmit()" ... >

    if (this.isValid()) {

      const user: User = new User(
        this.formGroup.controls['username'].value,
        this.formGroup.controls['password'].value,
        this.formGroup.controls['givenName'].value,
        this.formGroup.controls['familyName'].value
      );

      this.authService.createUserWithEmailAndPassword(user).catch(error => {

        if (error.details.message) {
          window.alert(error.details.message);
        } else {
          window.alert(error.message);
        }

      });
    }

  }

}
