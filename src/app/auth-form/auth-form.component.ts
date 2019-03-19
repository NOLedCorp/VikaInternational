import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.less']
})
export class AuthFormComponent implements OnInit {
  userForm:FormGroup;
  submitted = false;
  showError = false;
  constructor(public ms:ModalService, private fb: FormBuilder, private us:UserService) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone:[''],
      Password: ['', Validators.required],
      PasswordConfirm: ['', Validators.required]
    });
    this.userForm.valueChanges.subscribe(()=>{
      this.showError = false;
    })
  }
  enter(){
    this.ms.type='enter';
  }
  Auth(){
    this.submitted = true;
    if(this.userForm.invalid){
      return;
    }
    if(this.userForm.value.Password != this.userForm.value.PasswordConfirm){
      return;
    }
    let u = {
      Email:this.userForm.value.Email,
      Name:this.userForm.value.Name,
      Password:this.userForm.value.Password,
      Phone:this.userForm.value.Phone
    }
    
    this.us.regUser(u).subscribe(user => {
      if(user){
        sessionStorage.setItem('user',JSON.stringify(user));
          this.us.user = user;
          this.ms.close();
      }
      else{
          this.showError = true;
      }
      
    });
    
  }

  get f() { return this.userForm.controls; };
  get v() { return this.userForm.value; };
}
