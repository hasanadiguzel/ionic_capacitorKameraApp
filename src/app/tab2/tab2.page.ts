import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  photo: SafeResourceUrl;
  imageDataUrl: any;

  constructor(private sanitizer: DomSanitizer, private fireBaseStorage: AngularFireStorage, private afDB: AngularFireDatabase) {}

  async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.imageDataUrl = image.dataUrl;
    this.upload();
  }

  upload()
  {
    const fileName = new Date().getTime() + '.jpg';
    const path = `resimler/${fileName}`;
    var storageRef = this.fireBaseStorage.storage.ref();
    var uploadTask = storageRef.child(path).putString(this.imageDataUrl, 'data_url');
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, function(error) {

    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
      });
    });

    let kayit = {
      ad: fileName,
      yol: path
    };

    this.afDB.list('/resimler').push(kayit);

  }
}
