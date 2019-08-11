import { Component, OnInit } from '@angular/core';
import {BinService} from '../services/bin.service';
import {Bin} from '../models/bin.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})



export class StatsComponent implements OnInit {

    weekdays = new Array(7);


    readings = [];
    // {String:[{}]}
    locations: String[];
    staticBinInfo;
    allReadings;
    single: any[];
    multi: any[] = [];

    pieData = [];

    view: any[] = [700, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Days';
    showYAxisLabel = true;
    yAxisLabel = 'Avg. Bin Level Left (for last 30 days)';


    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    // line, area
    autoScale = true;

    // piechart legen
    legendTitle = 'Location';


    onSelect(event) {
        //console.log(event);
    }
     normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
        const normalizedObject: any = {}
        for (let i = 0; i < array.length; i++) {
            const key = array[i][indexKey]
            normalizedObject[key] = array[i]
        }
        return normalizedObject as { [key: string]: T }
    }

    getLocation(binLocation) {
        for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i] === binLocation) {
                return this.readings[i];
            }
        }
    }

  constructor(private binService: BinService) {

      this.weekdays[0] = 'Sunday';
      this.weekdays[1] = 'Monday';
      this.weekdays[2] = 'Tuesday';
      this.weekdays[3] = 'Wednesday';
      this.weekdays[4] = 'Thursday';
      this.weekdays[5] = 'Friday';
      this.weekdays[6] = 'Saturday';


      // update pie chart
      this.binService.getLocations().then((locations: [String]) => {

          this.locations = locations;
         // //console.log('got location', locations);
          for (let i = 0; i < this.locations.length ; i++) {
              this.readings[i] = [ {
                  name: 'Monday',
                  value: 0, count: 0
              },
                  {
                      name: 'Tuesday',
                      value: 0 , count: 0     },
                  {
                      name: 'Wednesday',
                      value: 0, count: 0
                  },
                  {
                      name: 'Thursday',
                      value: 0, count: 0
                  },
                  {
                      name: 'Friday',
                      value: 0, count: 0
                  },
                  {
                      name: 'Saturday',
                      value: 0, count: 0
                  },
                  {
                      name: 'Sunday',
                      value: 0, count: 0
                  }];
          }

          this.binService.getBinData().then(
              (binData: Bin[]) => {
                  this.staticBinInfo = binData;
                  this.allReadings = binData;

                   // //console.log('got static info', binData);
                  this.binService.getAllReadings().then(
                      (readings) => {
                          // //console.log('got r eadigns', readings);
                          for (const key in readings) {

                              const date = new Date(readings[key].metadata.time);
                              if (date == null) {
                                  //console.log('date error');
                                  // level = 0;
                              }
                              const hID = readings[key].payload_fields.hardware_id;
                              let level = +readings[key].payload_fields.level;
                                if (isNaN(level) || level == null) {
                                    level = 0;
                                }
                              const binLocation = this.getBinLocation(hID);
                              const dayOfWeek = this.weekdays[date.getDay()];
                              const loc = this.getLocation(binLocation);
                              ////console.log(hID, level, binLocation, loc);
                              for (const key in loc) {
                                  // //console.log(loc[key].name);
                                  if (loc[key].name === dayOfWeek) {
                                    let val = +loc[key].value;
                                    if (isNaN(val) || val == null) {
                                        //console.log('val error');
                                        val = 0;
                                    }
                                    let cnt = +loc[key].count;
                                    cnt += 1;
                                    val += level;
                                    loc[key].value = val;
                                    loc[key].count = cnt;
                                  }
                              }






                          }
                          const dd = [];
                          //console.log(this.readings.length, 'readings lenghth');
                          for (let i = 0; i < this.readings.length ; i++) {
                              // //console.log(this.readings[i]);
                              for (const key in this.readings[i]) {
                                  const dict = this.readings[i][key];
                                  // //console.log(dict);
                                   const val = +dict.value;
                                  const cnt = +dict.count;
                                  let avg = val / cnt;
                                  if(isNaN(avg)){
                                      avg = 0;
                                  }
                                  dict.value = avg;
                                 // //console.log(val,cnt,avg);
                              }
                              dd.push({name: this.locations[i], series: this.readings[i]});
                          }
                          this.multi = dd;
                          //console.log(this.multi);
                      }
                  );
                  // //console.log('got static bin data');
                  // //console.log(binData);

                  this.binService.getBinReadings().then(
                      (readings) => {
                          for (const key in readings) {

                              const date = new Date(readings[key].metadata.time);
                              const hID = readings[key].payload_fields.hardware_id;
                              const level = readings[key].payload_fields.level;
                              const bin = this.getBin(hID);
                              bin.setCurrentLevel(level);
                              bin.setLastUpdated(date);



                          }

                          this.addPieData();
                      }
                  );

              });



      });
  }

    getBin(binID: String) {
        for (const bin of this.staticBinInfo) {
            if (bin.getHarwareID() === binID) {
                return bin;
            }
        }

    }

    getBinLocation(binID: String) {
        for (const bin of this.staticBinInfo) {
            if (bin.getHarwareID() === binID) {
                return bin.getLocationArea();
            }
        }

    }
    addLineData() {
      //console.log('here');

    }

    addPieData() {
        const pData = [];
        for (let i = 0; i < this.locations.length ; i++) {
          let sum = 0;

            for (let j = 0; j < this.staticBinInfo.length; j++) {

              if (this.staticBinInfo[j].location_area === this.locations[i]) {
                  const status = +this.staticBinInfo[j].currentLevel;
                  sum += status;
              }
            }

            pData.push({name: this.locations[i], value: sum});
        }

        // //console.log('updating map');
        this.pieData =  pData;
    }

  ngOnInit() {

      // update line chart


  }


}
