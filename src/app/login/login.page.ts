/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {} as User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async login(user:User){
    if(this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento por favor..."
      })
      await loader.present();

      try {
        await this.afAuth.signInWithEmailAndPassword(user.email, user.password).then(data =>{
          console.log(data);
          this.navCtrl.navigateRoot("home")
        })
      }catch (e:any){
        e.message = "Usuario no registrado"
        let errormessage = e.message || e.getLocalizedMesaage();

        this.showToast(errormessage);
      }

      await loader.dismiss();
    }
  }

  formValidation(){
    if(!this.user.email){
      this.showToast("Ingrese un email");
      return false;
    }
    if(!this.user.password){
      this.showToast("Ingrese una clave");
      return false;
    }
    return true;
  }

  showToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 5000
    }).then(toastData => toastData.present());
  }

}
