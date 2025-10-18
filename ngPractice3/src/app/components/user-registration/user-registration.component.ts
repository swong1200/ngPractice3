import { HttpClient } from '@angular/common/http';
import { UsernameService } from '../../services/username.service';
import { Component, input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Observable,
  of,
  map,
  Subscription,
  debounceTime,
  filter,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss',
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  userRegForm!: FormGroup;
  subscriptions: Subscription[] = [];
  users: any[] = [];

  constructor(private usernameService: UsernameService) {}

  ngOnInit(): void {
    this.userRegForm = new FormGroup(
      {
        // required, minimum length of 3
        username: new FormControl(
          '',
          [Validators.required, Validators.minLength(3)],
          [this.checkUserName()]
        ),
        // required, validates the email format
        email: new FormControl('', [Validators.required, Validators.email]),
        // required, min length of 6
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        // required, must match the value of the password field
        confirmpassword: new FormControl('', [Validators.required]),
        // optional, becomes required if the user select "Phone"
        phone: new FormControl(),
        // required
        contactmethod: new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator }
    );

    this.subscriptions.push(
      this.usernameService.getUsers().subscribe({
        next: (res: any) => {
          res.forEach((item: any) => {
            this.users = [...this.users, item];
          });
        },
      })
    );

    this.contactmethod?.valueChanges.subscribe((value) => {
      if (value === 'phone') {
        this.phone?.setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]);
      } else {
        this.phone?.clearValidators();
      }

      this.phone?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: any) => sub.unsubscribe());
  }

  get username() {
    return this.userRegForm.get('username');
  }
  get email() {
    return this.userRegForm.get('email');
  }
  get password() {
    return this.userRegForm.get('password');
  }
  get confirmpassword() {
    return this.userRegForm.get('confirmpassword');
  }
  get phone() {
    return this.userRegForm.get('phone');
  }
  get contactmethod() {
    return this.userRegForm.get('contactmethod');
  }

  checkUserName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      const userExists = this.users.some(
        (user) => user.username === control.value
      );

      return of(userExists ? { userNameTaken: true } : null);
    };
  }

  registerUser() {
    console.log('Form properly submitted', this.userRegForm.value);
    this.userRegForm.reset();
  }
}

// Validator function to check if password and confirmpassword match
function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmpassword')?.value;
  return password === confirmPassword ? null : { passwordMatch: false };
}
