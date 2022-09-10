import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  runInfo?: any;
  currentDate = moment().format('DD-MM-YYYY');
  selectedDate = this.currentDate.toString();

  constructor(private runningService: RunningDataService) { }

  ngOnInit(): void {
    console.log("CURRENT DATE: " + this.currentDate)
    this.runningService.getAllRuns().subscribe((runs) => {
      console.log(runs);
    })

    let start = moment('2022-07-10').format('YYYY-MM-DD');

    let end = moment('2022-07-30').format('YYYY-MM-DD');
    //  new Date('2022-07-30').toISOString().slice(0, 10);

    console.log(start, end);
    this.runningService.getSpecificRuns(start, end).subscribe((runs) => {
      console.log(runs);
      this.runInfo = runs;
    })

    // let run = {runDate: '2022-07-10', distance: 5, notes: "easy"}
    // console.log(run);

    // this.runningService.addNewRun(run.runDate, run.distance, run.notes).subscribe((runs) => {
    //   console.log(run);
    // })

    let test = moment(start).format('DD-MM-YYYY')


  }

  logRun() {

  }
  

}
