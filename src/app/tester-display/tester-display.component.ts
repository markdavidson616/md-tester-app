import {Component, OnDestroy, OnInit} from '@angular/core';
import {TesterAppService} from '../testerapp.service';
import {Device} from '../device';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TestResults} from '../testResults';

@Component({
  selector: 'app-tester-display',
  templateUrl: './tester-display.component.html',
  styleUrls: ['./tester-display.component.css']
})
export class TesterDisplayComponent implements OnInit, OnDestroy {

  countries: string[] = [];
  devices: Device[] = [];

  testerForm: FormGroup;

  countrySubscription: Subscription;
  deviceSubscription: Subscription;
  resultsSubscription: Subscription;
  valChangesSubscription: Subscription;

  testResults: TestResults[] = [];

  constructor(private testerAppService: TesterAppService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.testerAppService.uploadData();
    this.countrySubscription = this.testerAppService.countries.subscribe(countries => this.countries = countries);
    this.deviceSubscription = this.testerAppService.devices.subscribe(devices => this.devices = devices);

    this.testerForm = this.formBuilder.group({
      countryControl: [[], [Validators.required]],
      deviceControl: [[], [Validators.required]]
    });

    this.valChangesSubscription = this.testerForm.valueChanges.subscribe(() => {
      const selectedCountries = this.testerForm.controls.countryControl.value;
      const selectedDevices = this.testerForm.controls.deviceControl.value;
      if ((Array.isArray(selectedCountries) && selectedCountries.length > 0) &&
        (Array.isArray(selectedDevices) && selectedDevices.length > 0)) {
        this.testerAppService.getResults(selectedCountries, selectedDevices);
      }
    });

    this.resultsSubscription = this.testerAppService.testResults.subscribe(testResults => this.testResults = testResults);
  }

  onCountrySelectAll() {
    this.testerForm.controls.countryControl.patchValue(this.countries);
  }

  onCountryReset() {
    this.testerForm.controls.countryControl.patchValue([]);
  }

  onDeviceSelectAll() {
   const allDeviceIds: number[] = [];
   this.devices.forEach(device => {
      allDeviceIds.push(device.deviceId);
    });
   this.testerForm.controls.deviceControl.patchValue(allDeviceIds);
  }

  onDeviceReset() {
    this.testerForm.controls.deviceControl.patchValue([]);
  }

  ngOnDestroy() {
    this.countrySubscription.unsubscribe();
    this.deviceSubscription.unsubscribe();
    this.valChangesSubscription.unsubscribe();
    this.resultsSubscription.unsubscribe();
  }

}
