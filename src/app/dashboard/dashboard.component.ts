import { Component, OnInit } from '@angular/core';
import {latLng, tileLayer, icon, marker, Map, circle, polygon, Popup, Layer, LayerGroup, DivIcon, DivIconOptions} from 'leaflet';
import {BinService} from '../services/bin.service';
import {Bin} from '../models/bin.model';
import 'leaflet.markercluster';
import { SocketService } from 'app/services/socket.service';



declare var $: any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit {

     map: Map;
     ioConnection: any;
     zoom = 13;
     iconGreenBloop = '/assets/img/markers/green-bloop.png';
     iconOragneBloop = '/assets/img/markers/orange-bloop.png';
     iconRedBloop = '/assets/img/markers/red-bloop.png';
     iconGreen = '/assets/img/markers/final-marker-green.png';
     iconOrange = '/assets/img/markers/final-marker-orange.png';
     markerShadow = '/assets/img/marker-shadow.png';
     iconRed = '/assets/img/markers/final-marker-red.png';
        // iconOrange =
     areaList = [];
     locations: String[];
     selectedAreas = [];
     selectedBins: Bin[];
     staticBinInfo: Bin[];
     dropdownSettings = {};
     layers = [];
     layerGroup: LayerGroup = new LayerGroup();
     aggregatedLayerGroup: LayerGroup = new LayerGroup();



    options = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            })
        ],
        zoom: this.zoom, minZoom: 10, maxZoom: 16,
        center: latLng([ -37.720761, 145.047955 ])
    };



    constructor(private binService: BinService, private socketService: SocketService) {}

    getBin(binID: String) {
        for (const bin of this.staticBinInfo) {
            if (bin.getHarwareID() === binID) {
                return bin;
            }
        }
    }

    ngOnInit() {
        // connect to the socket
        this.socketService.initSocket();
        this.ioConnection = this.socketService.onNewReading().subscribe(
            (readings) => {
                // subscribe to real-time bin readings
                console.log('koi mil gya');

                //update readings
                for (const key in readings) {

                    const date = new Date(readings[key].metadata.time);
                    const hID = readings[key].payload_fields.hardware_id;
                    const level = readings[key].payload_fields.level;
                    const bin = this.getBin(hID);
                    bin.setCurrentLevel(level);
                    bin.setLastUpdated(date);



                }

                this.updateMap();
            }
        );

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true
        };



        this.binService.getLocations().then((locations: [String]) => {

            this.locations = locations;
            this.areaList = this.locations;
            this.selectedAreas = this.locations;

            this.binService.getBinData().then(
                (binData: Bin[]) => {
                    ////console.log('got static bin data');
                    ////console.log(binData);
                    this.staticBinInfo = binData;
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
                            this.selectedBins = this.staticBinInfo;

                            this.updateMap();
                        }
                    );

                });



        });


    }

    // filters bins based on location selected and then creates marker to show on the map
    updateMap() {


        this.selectedBins = [];
        // filter bins for selected locations
           // //console.log(this.staticBinInfo.length);
        for (let i = 0; i < this.staticBinInfo.length; i++) {

            const result = this.selectedAreas.indexOf(this.staticBinInfo[i].getLocationArea()) !== -1 ;
            if (result) {
               this.selectedBins.push(this.staticBinInfo[i]);

            }

        }

        // //console.log(this.selectedBins);
        // //
        //console.log('update map based on zoom', this.zoom);
        if (this.zoom >= 13) {

            this.showZoomedMarkers();
        } else {
            this.showAggregatedMarkers();
        }
    }

    showAggregatedMarkers() {
        //console.log('show affrefated markers');
        // //console.log('selctd bins');
        // //console.log(this.selectedBins, this.selectedAreas);
        this.aggregatedLayerGroup.clearLayers();
        this.layerGroup.removeFrom(this.map);

        const clusterDetails = [];

        const binInfo = this.selectedBins;
        for (const key in this.selectedAreas) {

            const location = this.selectedAreas[key];

            let sumLat = 0.0;
            let sumLon = 0.0;
            let sumPercent = 0.0;
            let locationCount = 0;

            ////console.log(location);
            for (const k in binInfo) {
                ////console.log(binInfo[k]);
                if (binInfo[k].getLocationArea() === location) {
                    locationCount++;
                    const lat = +binInfo[k].getLocation().latitude;
                    const lon = +binInfo[k].getLocation().longitude;
                    const per = +binInfo[k].getCurrentLevel();
                    sumLat += lat;
                    sumLon += lon;
                    sumPercent = sumPercent + ((isNaN(per)) ? 0 : per);

                }

            }

            const avgLat = sumLat / locationCount;
            const avgLon = sumLon / locationCount;
            const avgPercent = sumPercent / locationCount;
            const mapAccess = this.map;
            // //console.log('here');
            // //console.log(avgLat, avgLon, avgPercent, location);
            // add marker
            let iconPath = this.iconGreenBloop;
            if (avgPercent >= 50) {
                iconPath = this.iconGreenBloop;

            } else if (avgPercent >= 20) {
                iconPath = this.iconOragneBloop;
            } else {
                // shored
                iconPath = this.iconRedBloop;
            }
            const ic = new DivIcon({html: `<div style="position: relative; text-align: center; color:white">
                <img width="60" height="60" src=${iconPath} >
  
                <p style="position: absolute; top:30%; left:33%; font-size: 16px; font-weight: bold">${Math.trunc(avgPercent)}</p>
                    </div>`, className:'tet', iconSize:[60, 60], iconAnchor:[30, 30]});

            const p = marker([ avgLat, avgLon ], {
                icon: ic
            });
            p.bindPopup(`<p style="margin: 0px; font-size: 10px">Average Percent left in ${locationCount} bins:</p>
            <p style="margin: 0px; font-size: 10px; font-weight: bold"> ${Math.trunc(avgPercent)}%</p><p style="margin: 0px; font-size: 10px"> Location: ${location}</p>`);
            p.on('mouseover', function (e) {
                this.openPopup();
            });
            p.on('mouseout', function (e) {
                this.closePopup();
            });

            p.on('click', function (e) {
                mapAccess.flyTo([avgLat, avgLon], 13);
            });

            this.aggregatedLayerGroup.addLayer(p);
        }
        this.aggregatedLayerGroup.addTo(this.map);


    }

    zoomTo(latlng) {
        this.map.flyTo(latlng, 13);
    }

    showZoomedMarkers() {
       //console.log('start zoomed');
        // use selectedBins to show markers
        this.aggregatedLayerGroup.removeFrom(this.map);
        this.layerGroup.clearLayers();

        for (let i = 0 ; i < this.selectedBins.length ; i++) {
            const binID = this.selectedBins[i].getHarwareID();
            let binCapacityLeft = +this.selectedBins[i].getCurrentLevel();
            let binMax = +this.selectedBins[i].getCapacity();
            let lastTime = this.selectedBins[i].getLastUpdated();

            // check Nan
            if( lastTime == null) {
                //console.log('lastTime not defined for', binID);
                lastTime = new Date();
            }


            if (isNaN(binCapacityLeft) || isNaN(binMax)) {
                //console.log('ERROR: Min capacity left invalid', binID, binMax, binCapacityLeft, lastTime);
                binCapacityLeft = 56;
                binMax = 120;

            }
            let percent =  ( 100.0 * binCapacityLeft) / binMax  ;
            let iconString = this.iconGreen;
            if (percent >= 60.0) {
                // 80% empty so use green
                iconString = this.iconGreen;
            } else if (percent >= 20.0) {
                // use orange
                iconString = this.iconOrange;
            } else {
                // use red
                iconString = this.iconRed;

            }


            const p = marker([ +this.selectedBins[i].getLocation().latitude, +this.selectedBins[i].getLocation().longitude ], {
                icon: icon({
                    iconSize: [ 30, 50 ],
                    iconAnchor: [ 15, 50 ],
                    iconUrl: iconString,
                    shadowUrl: this.markerShadow
                })
            });
            p.on('click', this.onMarkerClick.bind(this));


            const binLocation = this.selectedBins[i].getLocationArea();
            const binOrganeBackground = '#F5CBA7';
            const binSafeBackground = '#D5F5E3';
            const  binRedBackground = '#FADBD8';
            const randomImageNumber = Math.floor(Math.random() * 3) + 1  ;
            const customPopup = `<!DOCTYPE html>
            <html>
            <head>
            <style>
            .card {
                margin-bottom: 5px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%;
            }
            .card:hover {
                box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
            }
            .leaflet-popup-content {
                width: 180px;
                margin: 5px 5px;
            }
            .h6 {
                margin: 5px;
            }
            .container {
                padding: 1px;
                width: auto;
            }
            .binID {
	            color:#48cfad;
	            font-size:18px;
	            font-weight:300;
            }
            .binDetails {
                color: #FFFFFF;
                font-weight: bold;
            }

            </style>
            </head>
            <body>
            <div class="card" style="background-color: #47C1C8">
              <div class="container" style="padding: 5px;" >
                <p class="binDetails" style = "margin:0px; font-size: 12px">${binID}</p>
                <p class="binDetails" style = "margin:0px; font-size: 12px">${ binLocation }</p>
                <p class="binDetails" style = "margin:0px; font-size: 8px">Last Updated: ${ lastTime.toDateString() }</p>
              </div>
            </div>
            <div class="card" style="padding:5px;" >
              <div class="container">
                    <div class="container" style="float:left; width:50%">
                        <img src="/assets/img/binimg${randomImageNumber}.png" style="border-radius:5px" width="70" height="80"></img>
                    </div>
                    <div class="container" style="float:left; width:50%">
                    <div>Max Capacity:</div>
                    <div style="color:#47C1C8; font-size:16px; font-weight: bold">${ binMax}</div>
                    <div>Capacity Left:</div>
                    <div style="color:#47C1C8; font-size:16px; font-weight: bold">${ binCapacityLeft}</div>
                    </div>
                    
                </div>
            </div>
            </body>
            </html> `;
            p.bindPopup(customPopup);
            this.layerGroup.addLayer(p);
        }

        this.layerGroup.addTo(this.map);

    }

    onMarkerClick(t) {

    }



    onItemSelect (item: any) {

        this.selectedAreas.push(item);
        this.updateMap();
    }
    onSelectAll (items: any) {
        this.selectedAreas = this.locations;
        this.updateMap();

    }

    onItemDeSelect(item: any) {

        delete  this.selectedAreas[this.selectedAreas.indexOf(item)];
        this.updateMap();
    }

    onItemDeSelectAll(item: any) {
        this.selectedAreas = [];
        this.updateMap();

    }




    onMapReady(map: Map) {


        this.map = map;
        this.zoom = map.getZoom();

    }

    onZoomLevelChange(map) {

        const newZoom = +map.target._zoom;
        //console.log('old zoom', this.zoom, 'new zoom', newZoom);
        // show zoomed if zoom changes from 12 to 13
        if ( (newZoom === 13) || (newZoom === 12)) {
            this.zoom = newZoom;
            //console.log('changing type');
            this.updateMap();
        }
    }

    testClick(x) {
        //console.log('onZoomLevelChangebutton clicked');


        this.binService.getBinData().then(
            (d) => {
                //console.log(d);
            }
        );
    }


}
