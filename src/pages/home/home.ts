import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentUserAppProfiles: Observable<{}[]>;
  currentUserPhones: Observable<{}[]>;

  constructor(db: AngularFirestore) {
    this.currentUserAppProfiles = db.collection('appProfiles', ref => ref.where('owner', '==', 'JpPfT3V1cFqNh44f54Dn')).valueChanges();

    this.currentUserAppProfiles.subscribe(res => {
      console.log(res)
    })

    this.currentUserPhones = db.collection('phones', ref => ref.where('owner', '==', 'JpPfT3V1cFqNh44f54Dn').where('test', '==', 'abcdx')).valueChanges();

    this.currentUserPhones.subscribe(res => {
      console.log('a', res)

      // console.log(res[0].appProfile.path)

      // this.currentUserPhones = db.collection(res[0].appProfile.path).valueChanges();

      // this.currentUserPhones.subscribe(res => {
      //   console.log(res)
      // })

    })




  }

}
