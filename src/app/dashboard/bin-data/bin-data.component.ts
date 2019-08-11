import { Component, OnInit } from '@angular/core';
import {Bin} from '../../models/bin.model';
import {BinService} from '../../services/bin.service';

@Component({
  selector: 'app-bin-data',
  templateUrl: './bin-data.component.html',
  styleUrls: ['./bin-data.component.css']
})
export class BinDataComponent implements OnInit {

  constructor(private binService: BinService) { }
  bins: Bin[];
  ngOnInit() {


  }

}
