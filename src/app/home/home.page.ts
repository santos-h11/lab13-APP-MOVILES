import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  posts:any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore) {}

    ionViewWillEnter(){
      this.getPosts();
    }

    async getPosts(){
        let loader = await this.loadingCtrl.create({
          message: "Espere por favor..."
        });
        await loader.present();

      try {
        this.firestore.collection('post')
        .snapshotChanges()
        .subscribe((data:any[]) =>{
          this.posts = data.map((e:any) =>{
            return{
              id: e.payload.doc.id,
              title: e.payload.doc.data()['title'],
              details: e.payload.doc.data()['details']
            }
          });
        });
        await loader.dismiss();
          }catch (e:any){
          e.message = "mensaje de error al home"
          let errormessage = e.message || e.getLocalizedMesaage();

          this.showToast(errormessage);
        }
      }

    async deletePost(id:string){
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento por favor..."
      });
      await this.firestore.doc("post/"+id).delete();
      await loader.dismiss();
    }

    showToast(message: string){
      this.toastCtrl.create({
        message: message,
        duration: 4000
      }).then(toastData => toastData.present());
    }

  }
