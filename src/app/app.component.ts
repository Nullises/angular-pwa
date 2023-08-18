import { Component, OnInit } from "@angular/core";
import { Platform } from "@angular/cdk/platform";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
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
      uniqueGuid: new FormControl(""),
      householdId: new FormControl(""),
      clientId: new FormControl(""),
      firstname: new FormControl(""),
      lastname: new FormControl(""),
      dob: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
      address: new FormControl(""),
      apt: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      zip: new FormControl(""),
      allocatedAmount: new FormControl(""),
      cc: new FormControl(1111),
    });

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event: any) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });

    this.updateOnlineStatus();
    window.addEventListener("online", this.updateOnlineStatus.bind(this));
    window.addEventListener("offline", this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter(
          (evt: any): evt is VersionReadyEvent => evt.type === "VERSION_READY"
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
      window.addEventListener("beforeinstallprompt", (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = "ANDROID";
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode =
        "standalone" in window.navigator &&
        (<any>window.navigator)["standalone"];
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = "IOS";
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

  get uniqueGuidControl() {
    return this.changeCardHolderForm.get("uniqueGuid");
  }

  get householdIdControl() {
    return this.changeCardHolderForm.get("householdId");
  }
  get clientIdControl() {
    return this.changeCardHolderForm.get("clientId");
  }

  get firstnameControl() {
    return this.changeCardHolderForm.get("firstname");
  }
  get lastnameControl() {
    return this.changeCardHolderForm.get("lastname");
  }
  get dobControl() {
    return this.changeCardHolderForm.get("dob");
  }
  get emailControl() {
    return this.changeCardHolderForm.get("email");
  }
  get phoneControl() {
    return this.changeCardHolderForm.get("phone");
  }
  get addressControl() {
    return this.changeCardHolderForm.get("address");
  }
  get aptControl() {
    return this.changeCardHolderForm.get("apt");
  }
  get cityControl() {
    return this.changeCardHolderForm.get("city");
  }
  get stateControl() {
    return this.changeCardHolderForm.get("state");
  }

  get zipControl() {
    return this.changeCardHolderForm.get("zip");
  }

  get allocatedAmountControl() {
    return this.changeCardHolderForm.get("allocatedAmount");
  }

  get ccControl() {
    return this.changeCardHolderForm.get("cc");
  }

  async updateCardHolder() {
    try {
      this.changeCardHolderForm.markAllAsTouched();

      const user = {
        uniqueGuid: this.changeCardHolderForm.value.uniqueGuid,
        householdId: this.changeCardHolderForm.value.householdId,
        clientId: this.changeCardHolderForm.value.clientId,
        firstname: this.changeCardHolderForm.value.firstname,
        lastname: this.changeCardHolderForm.value.lastname,
        dob: this.changeCardHolderForm.value.dob,
        email: this.changeCardHolderForm.value.email,
        phone: this.changeCardHolderForm.value.phone,
        address: this.changeCardHolderForm.value.address,
        apt: this.changeCardHolderForm.value.apt,
        city: this.changeCardHolderForm.value.city,
        state: this.changeCardHolderForm.value.state,
        zip: this.changeCardHolderForm.value.zip,
        allocatedAmount: this.changeCardHolderForm.value.allocatedAmount,
        cc: this.changeCardHolderForm.value.cc,
      };

      alert(JSON.stringify(user));
    } catch (error) {
      console.log("error", error);
    }
  }
}
