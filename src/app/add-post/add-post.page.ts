/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  post = {} as Post;

  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { }

  ngOnInit() {
  }

  async createPost(post:Post){
    if(this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento por favor..."
      })
      await loader.present();

      try {
        await this.firestore.collection("post").add(post);
      }catch (e:any){
        e.message = "Mensaje de error en el post"
        let errormessage = e.message || e.getLocalizedMesaage();

        this.showToast(errormessage);
      }

      await loader.dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  formValidation(){
    if(!this.post.title){
      this.showToast("Ingrese un título");
      return false;
    }
    if(!this.post.details){
      this.showToast("Ingrese una descripción");
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
