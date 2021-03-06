import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { CadastroPage } from '../cadastro/cadastro';
import { MessageProvider } from '../../providers/message/message.provider'; 
import { LoadingProvider } from '../../providers/loading/loading.provider';
import { UserService } from '../../services/user.service';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public formLogin;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private msgProvider: MessageProvider, private loadingProvider: LoadingProvider,
    private userService: UserService) {
    this.formLogin = new FormGroup({
      email: new FormControl("", Validators.compose([
        Validators.required, Validators.email     
      ])),
      password: new FormControl("", Validators.compose([
        Validators.required, Validators.minLength(6)
      ]))
    })
    console.log(this.formLogin);
  }

  login(usuario) {
    const loading = this.loadingProvider.loadingDefault('Conectando...');
    loading.present();
    this.userService.login(usuario).subscribe(response => {
      this.userService.setToken(response.token, usuario.password).then(param => {
        loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
      })      
    }, (err) => {
      loading.dismiss();
      this.msgProvider.showMessageToast('Email ou senha inválidos.', undefined, 'top');
    })
  }

  registrar() {
    this.navCtrl.push(CadastroPage);
  }

  resetSenha(login) {
    const modalResetSenha = this.modalCtrl.create('ModalResetSenha', {email: login.email}, { enableBackdropDismiss: false });

    modalResetSenha.present();

    modalResetSenha.onWillDismiss((data) => {
      if (data === 'sucesso')
      this.msgProvider.showMessageToast('Email enviado com sucesso !!!', undefined, 'top');
    })
  }

}