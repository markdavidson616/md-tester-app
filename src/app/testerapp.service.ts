import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tester} from './tester';
import {BehaviorSubject} from 'rxjs';
import {Device} from './device';
import {TesterDevice} from './testerDevice';
import {Bug} from './bug';
import {TestResults} from './testResults';

@Injectable({
  providedIn: 'root'
})
export class TesterAppService {

  countries = new BehaviorSubject<string[]>( []);
  devices = new BehaviorSubject<Device[]>([]);
  testResults = new BehaviorSubject<TestResults[]>([]);

  testers: Tester[] = [];
  testerDevices: TesterDevice[] = [];
  bugs: Bug[] = [];

  constructor(private httpClient: HttpClient) { }

  uploadData() {
    this.uploadTesters();
    this.uploadDevices();
    this.uploadTesterDevices();
    this.uploadBugs();
  }

getResults(selectedCountries: string[], selectedDeviceIds: number[]) {
    const selectedTesterIds: number[] = this.testers.filter(tester => selectedCountries.includes(tester.country))
      .map(tester => tester.testerId);

    const filteredBugs = this.bugs.filter( bug => selectedTesterIds.includes(bug.testerId))
      .filter(bug => selectedDeviceIds.includes(bug.deviceId));

    const reducedFilteredBugs = filteredBugs.reduce((acc, bug) => {
      acc[bug.testerId] = acc[bug.testerId] + 1 || 1;
      return acc;
    }, {});

    const results: TestResults[] = [];

    selectedTesterIds.forEach(testerId => {
    const resultTester = this.testers.find(tester => tester.testerId === testerId);
    const count = reducedFilteredBugs[resultTester.testerId] === undefined ? 0 : reducedFilteredBugs[resultTester.testerId];
    const resultName = resultTester.firstName +  ' ' +  resultTester.lastName + ' (' + resultTester.country + ')';
    const testResult = new TestResults(testerId, resultName, count);
    results.push(testResult);
   });

    results.sort((a, b) => (a.count < b.count) ? 1 : -1);
    this.testResults.next(results);
 }

  uploadTesters() {
    this.httpClient.get('assets/testers.csv', {responseType: 'text'})
      .subscribe(data => {
       const allRows = data.split(/[\n\r]/);

       for (let i = 1; i < allRows.length; i++) {
        const detailRow = allRows[i].split(',');
        try {
          const tester = new Tester(
            Number(detailRow[0].replace(/"/g, '')),
            detailRow[1].replace(/"/g, ''),
            detailRow[2].replace(/"/g, ''),
            detailRow[3].replace(/"/g, ''),
            new Date(detailRow[4].replace(/"/g, '')));
          this.testers.push(tester);
        } catch (e) {
          console.log('Error occurred uploading tester item ', i);
          console.log('Error: ', e.toString());
        }
      }
       console.log('Testers loaded: ', this.testers.length);

       const csvCountries: string[] = [];
       this.testers.forEach(tester => {
        if (!csvCountries.includes(tester.country)) {
          csvCountries.push(tester.country);
        }
      });
       this.countries.next(csvCountries);
    });
  }

  uploadDevices() {
    this.httpClient.get('assets/devices.csv', {responseType: 'text'}).subscribe(data => {
      const allRows = data.split(/[\n\r]/);
      const csvDevices: Device[] = [];

      for (let i = 1; i < allRows.length; i++) {
        const detailRow = allRows[i].split(',');
        try {
          const device = new Device(
            Number(detailRow[0].replace(/"/g, '')),
            detailRow[1].replace(/"/g, ''));
          csvDevices.push(device);
        } catch (e) {
            console.log('Error occurred uploading devices item ', i);
            console.log('Error: ', e.toString());
        }
      }
      console.log('Devices loaded: ', csvDevices.length);
      this.devices.next(csvDevices);
    });
  }

  uploadTesterDevices() {
    this.httpClient.get('assets/tester_device.csv', {responseType: 'text'}).subscribe(data => {
      const allRows = data.split(/[\n\r]/);

      for (let i = 1; i < allRows.length; i++) {
        const detailRow = allRows[i].split(',');
        try {
          const testerDevice = new TesterDevice(
            Number(detailRow[0].replace(/"/g, '')),
            Number(detailRow[1].replace(/"/g, '')));
          this.testerDevices.push(testerDevice);
        } catch (e) {
          console.log('Error occurred uploading tester devices item ', i);
          console.log('Error: ', e.toString());
        }
      }
      console.log('TesterDevices loaded: ', this.testerDevices.length);
    });
  }

  uploadBugs() {
    this.httpClient.get('assets/bugs.csv', {responseType: 'text'})
      .subscribe(data => {
        const allRows = data.split(/[\n\r]/);
        for (let i = 1; i < allRows.length; i++) {
            const detailRow = allRows[i].split(',');
            try {
              const bug = new Bug(
                Number(detailRow[0].replace(/"/g, '')),
                Number(detailRow[1].replace(/"/g, '')),
                Number(detailRow[2].replace(/"/g, ''))
              );
              this.bugs.push(bug);
            } catch (e) {
              console.log('Error occurred uploading bugs item ', i);
              console.log('Error: ', e.toString());
            }
          }
        console.log('Bugs loaded: ', this.bugs.length);
        }
      );
  }

}
