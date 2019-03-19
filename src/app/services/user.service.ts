import { Good, NewUser, User, UserInfo } from './models';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CartItem } from './models';
import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { ModalService } from './modal.service';
// import { OnInit } from '@angular/core';

@Injectable()
export class UserService{
    public user:User;
    baseUrl:string='http://client.nomokoiw.beget.tech/vi/';

    constructor(private router:Router, private http: HttpClient, private ms:ModalService){
        if(localStorage.getItem('user')){
            let u:User = JSON.parse(localStorage.getItem('user'));
            this.getUserById(u.UserId);
        }
        if(sessionStorage.getItem('user')){
            let u:User = JSON.parse(sessionStorage.getItem('user'));
            this.getUserById(u.UserId);
        }
    }

    /**
     * Вход пользователя по Email и паролю
     * Возвращает false если пользователь не найден
     * @param email Email пользователя для входа
     * @param password Пароль пользователя для входа
     */
    loginUser(email:string, password:string){
        return this.http.get<User>(this.baseUrl + 'UserController.php?Key=get-user&Email='+email+'&Password='+password);
    }

    /**
     * Регистрация пользователя
     * Возвращает false если пользователь с таким Email уже существует
     * @param user Объект типа NewUser
     */
    regUser(user:NewUser){
        return this.http.post<User>(this.baseUrl + 'UserController.php?Key=add-user', user);
    }

    /**
     * Изменение Email и Телефона пользователя
     * Если новый Email уже существует возвращает false
     * @param userInfo Объект содержащий UserId, Email, Phone
     */
    updateUserInfo(userInfo:UserInfo){
        return this.http.post(this.baseUrl + 'UserController.php?Key=update-user-info', userInfo);
    }

    logOut(){
        if(localStorage.getItem('user')){
            localStorage.removeItem('user');
        }
        if(sessionStorage.getItem('user')){
            sessionStorage.removeItem('user');
        }
        this.user = null;
        this.router.navigate(['/']);

    }

    /**
     * Получение пользователя по Id
     * @param id идентификатор пользователя
     */
    getUserById(id){
        this.http.get<User>(this.baseUrl + 'UserController.php?Key=get-user-by-id&Id='+id).subscribe(user => {
            if(user){
                
                this.user = user;
                localStorage.setItem('user',JSON.stringify(user));
                return true;
            }
            
        }, error => {
            return false;
        }) 
    }
}

