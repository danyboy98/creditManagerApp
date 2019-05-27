import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { baseURL } from '../shared/baseurl';
import { UserService } from '../services/user.service';
import { User } from '../shared/user';
import { Transfer } from '../shared/transfers';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Recepient } from '../shared/recepient';


@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {

  //backend interaction variables
  BaseURL;
  user: User;
  formErrors = [];
  total = 0;
  formValue: Transfer;


  // Form varibles
  transferForm: FormGroup;
  first = true;
  Message = false;
  stop = false;
  msg;
  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'pattern': 'Full Name must be all characters.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'amount': {
      'required': 'Amount is required.',
      'pattern': 'Amount must contain only numbers.'
    },
  };

  // constructor and onInit()
  @ViewChild('tform') transferFormDirective;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location) {

    this.BaseURL = baseURL;

  }

  ngOnInit() {
    
    const id = +this.route.snapshot.params["id"];
    this.userService.getUser(id.toString()).subscribe((user) => this.user = user);

    this.transferForm = this.fb.group({
      recepients: this.fb.array([
        this.fb.group({
          name: ['', [
            Validators.required,
            Validators.pattern('[A-Za-z ]+'),
            Validators.minLength(2),
            Validators.maxLength(25)
          ]],
          amount: [0, [
            Validators.required,
            Validators.pattern('[0-9]+')
          ]]
        })
      ])
    });
    if (this.first) {
      this.first = false;
      var fields = {
        name: '',
        amount: ''
      }
      this.formErrors.push(fields);
    }
    this.transferForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    
  }
  //methods

  get recepients() {
    return this.transferForm.get('recepients') as FormArray;
  }
  addRecepient() {
    const recepient = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern('[A-Za-z ]+'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      amount: [0, [
        Validators.required,
        Validators.pattern('[0-9]+')
      ]]
    });
    this.recepients.push(recepient);
    var fields = {
      name: '',
      amount: ''
    }
    this.formErrors.push(fields);
  }

  deleteRecepient(i) {
    this.recepients.removeAt(i);
    this.formErrors.pop();
  }

  onValueChanged(data?: any) {
    if (!this.formErrors) { return }
    const formArr = this.recepients;
    for (let form of formArr.controls) {
      for (var i = 0; i < this.formErrors.length; i++) {
        for (const field in this.formErrors[i]) {
          if (this.formErrors[i].hasOwnProperty(field)) {
            const control = form.get(field); 
            if (control.dirty && control && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[i][field] = '';
                  this.formErrors[i][field] += messages[key] + ' ';
                  this.checkTotal();
                }
              }
            }
          }
        }
      }

    }
  }
  checkTotal() {
    for(var index in this.transferForm.value) {
      // console.log(this.transferForm.value);
    }
  }
  onSubmit(): void {
    const form = {
      userId: this.user.id.toString(),
      recepients: this.transferForm.value
    };
    this.formValue = form;
    this.userService.transaction(this.formValue).subscribe((msg) => {
      if(msg) {
        this.stop = true;
      }
      else {
        this.goBack();
        this.goBack();
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
  tryAgain() {
    this.stop = false;
  }
  
}