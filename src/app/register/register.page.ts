/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
user = {} as User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async register(user: User){
    if(this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere por favor..."
      })
      await loader.present();
      try {
        await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(data =>{
          console.log(data);
          this.navCtrl.navigateRoot("home")
        })
      }catch (e: any) {
        const errorMessage = e.message || e.getLocalizedMessage() || "Error al registrarse";
        this.showToast(errorMessage); // No sobrescribas `e.message` directamente
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
      duration: 4000
    }).then(toastData => toastData.present());
  }
}
