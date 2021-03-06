import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'remember-password',
  templateUrl: './remember-password.component.html',
  styleUrls: ['./remember-password.component.less']
})
export class RememberPasswordComponent implements OnInit {
  userForm:FormGroup;
  submitted = false;
  showInfo = false;
  showError = false;
  constructor(private fb:FormBuilder, private us:UserService, private ls:LoadService) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }
  remember(){
    this.submitted=true;
    if(this.userForm.invalid){
      return;
    }
    this.ls.showLoad=true;
    this.us.rememberPassword(this.userForm.value.Email, this.us.GenPassword()).subscribe((res)=>{
      console.log(res);
      if(res){
        this.ls.showLoad=false;
        this.showInfo = true;
        this.showError=false;
      }
      else{
        this.ls.showLoad=false;
        this.showError = true;
      }
      
    })
  }

  get f() { return this.userForm.controls; }

}
