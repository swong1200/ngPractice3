import { HttpClient } from '@angular/common/http';
import { UsernameService } from '../../services/username.service';
import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of, map, Subscription, debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
    userRegForm!: FormGroup;
    subscriptions: Subscription[] = []

    constructor (private usernameService: UsernameService) {}

    ngOnInit(): void {
        this.userRegForm = new FormGroup({
            // required, minimum length of 3
            username: new FormControl('', [Validators.required, Validators.minLength(3)], [this.checkUserName()]),
            // required, validates the email format
            email: new FormControl('', [Validators.required, Validators.email]),
            // required, min length of 6
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            // required, must match the value of the password field
            confirmpassword: new FormControl('', [Validators.required]),
            // optional, becomes required if the user select "Phone"
            phone: new FormControl(),
            // required
            contactmethod: new FormControl('', Validators.required)
        }, { validators: passwordMatchValidator })
    
        this.subscriptions.push(
            this.usernameService.getUsers().subscribe()
        )    
        console.log(this.subscriptions[0])
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub: any) => sub.unsubscribe())
    }

    checkUserName(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> => {
            
            // const resultObs = this.http.post('https://jsonplaceholder.typicode.com/users', control.value)
            return control.valueChanges.pipe(
                debounceTime(1000),
                filter((input) => {
                    console.log(this.usernameService.getUsers() !== input)
                    return this.usernameService.getUsers() !== input
                })
            )
            
            // return resultObs.pipe(
            //     map((res) => {
            //         if (res) {
            //             return { usernameExist: "the username already exists" };
            //         } else {
            //             return null;
            //         }
            //     })
            // )
            // if (true) {
            //     return of({error: 'error'})
            // } else {
            //     return of(null)
            // }
        }

    }

    registerUser() {
        console.log(this.userRegForm.value)
    }
}

// Validator function to check if password and confirmpassword match
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { passwordMatch: false };
}


