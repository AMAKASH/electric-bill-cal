import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  getTime() {
    return '10:00:00';
  }

  timeDifference(date1: any, date2: any) {
    let diff = date2.getTime() - date1.getTime();
    if (diff > 0) {
      let h: string;
      let m: string;
      let s: string;
      let msec = diff;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      if (hh <= 9) {
        h = '0' + hh;
      } else {
        h = hh.toString();
      }
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      if (mm <= 9) {
        m = '0' + mm;
      } else {
        m = mm.toString();
      }
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      if (ss <= 9) {
        s = '0' + ss;
      } else {
        s = ss.toString();
      }

      return h + ':' + m + ':' + s;
    } else {
      return 0 + ':' + 0 + ':' + 0;
    }
  }
}
