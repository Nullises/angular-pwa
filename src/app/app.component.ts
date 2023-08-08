import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;
  modalUsername: any;
  changeCardHolderForm!: FormGroup;

  constructor(private platform: Platform, private swUpdate: SwUpdate) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  public ngOnInit(): void {
    this.changeCardHolderForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
    });

    this.updateOnlineStatus();
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter(
          (evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'
        ),
        map((evt: any) => {
          console.info(
            `currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`
          );
          this.modalVersion = true;
        })
      );
    }

    this.loadModalPwa();
  }

  get usernameControl() {
    return this.changeCardHolderForm.get('username');
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode =
        'standalone' in window.navigator &&
        (<any>window.navigator)['standalone'];
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }

  async updateCardHolder() {
    try {
      this.changeCardHolderForm.markAllAsTouched();

      const user = {
        username: this.changeCardHolderForm.value.username,
      };

      alert(user.username);
    } catch (error) {
      console.log('error', error);
    }
  }
}
