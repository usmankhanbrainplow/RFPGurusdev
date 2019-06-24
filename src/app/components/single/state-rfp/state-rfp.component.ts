import { AdvanceService } from './../../other/advance-search/advance.service';
import { HomeService } from './../../common/home/home.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { StateService } from './state.service';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { SharedData } from '../../../services/shared-service';
import { PagerService } from '../../../services/paginator.service';
declare const $: any;
import * as moment from 'moment';
import { Location } from '@angular/common';
import { SeoService } from '../../../services/seoService';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-state-rfp',
  templateUrl: './state-rfp.component.html',
  styleUrls: ['./state-rfp.component.css',
  '../../local-style/pagination.css',
  '../../local-style/table-normal.css',
  '../../local-style/products-area.css'
],
  providers: [PagerService, SharedData, StateService, HomeService, AdvanceService]
})
export class StateRfpComponent implements OnInit, OnDestroy {
  date;
  check(date) {

    this.date = moment(date, this.formats, true).isValid()
    //    
    return this.date;
  }
  formats = [
    moment.ISO_8601,
    "YYYY/MM/DD"
  ];
  item;
  state;
  record: any = [];
  pageValues;
  pager: any = {};
  pageSizeOptions;
  currentUser;

  constructor(private advanceServ: AdvanceService, private homeServ: HomeService, public dialog: MatDialog, private pagerService: PagerService, public _shareData: SharedData, private _nav: Router, private _serv: StateService, private route: ActivatedRoute, private _location: Location, private seoService: SeoService) {
    localStorage.removeItem('member');
  }
  // MatPaginator Inputs
  length = 0;
  pageSize = '50';
  matpageSizeOptions = [10, 20, 35, 50];
  back() {
    this._location.back();
  }

  status;
  local;
  uname;
  subscribe;
  // MatPaginator Output
  pageEvent: PageEvent;
  endRequest;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.matpageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  subscribe_data() {
    this._serv.staterecord(this.state, this.pageSize, 1).subscribe(
      data => {
        this.record = data['Results'];
        this.item = data['totalItems']
        this.length = this.item;
      });
  }
  page(pageSize) {
    if (pageSize) {
      // alert(pageSize)
      this.pageSize = pageSize;
      // if (localStorage.getItem('statepage') == null) {
      //   // var page_num: number = Number(localStorage.getItem('statepage'));
      //   alert('if wali ' + pageSize)
      //   this.setPage(pageSize);
      // } else {
        // alert(this.pageSize)
        this.setPage(1);
      // }
    }
    else {
      delete this.pageSize;
    }
    // this.setPage(this.pageSize)
  }
  setPage(page) {
    localStorage.setItem('statepage', page);
    // alert(this.pageSize)
    this.route.queryParams

      .subscribe(params => {
        this.state = params.state

        // --------------- SEO Service ---------------
        // setting the page title 
        this.seoService.setTitle(params.state);

        // Updating Open Graph
        this.seoService.updateOGTitle(params.state);
        this.seoService.updateOGURL(window.location.href);

        // setting CanonicalURL
        this.seoService.createLinkForCanonicalURL();

        // setting twitter
        this.seoService.updateTwitterTitle(params.state);

        this.seoService.updateTwitterTitle('rfp bid sites,rfp bidding sites, bid sites, rfp usa, government rfp website, rfp consulting firm, rfp consulting firm in dallas, rfp project management, rfp project management services, rfp search engine, rfp project management services, rfp proposal, rfp consulting, government rfp, digital marketing rfp, rfp management, website rfp example, rfp services, rfp for audit services, agency rfp, best rfp software, data management rfp, energy efficiency rfp, rfp for property management services, energy storage rfp, rfp business, rfp contract terms, rfp government bids, government rfp search, rfp aggregator, best rfp database, rfp database, government rfp database, rfp sites, rfp online, find rfp, find rfp bid sites, find rfp bid, find rfp bids, Government Request for Proposal, rfp search, rfp process, marketing rfp database, architectural rfp database, architectural design bids, bid finder, government bids, government contracts, contract bidding websites, construction bidding websites, best construction bid sites, free rfp bid sites, public rfp database')

        // --------------- SEO Service End ---------------

        this.endRequest = this._serv.staterecord(this.state, this.pageSize, page).subscribe(
          data => {
            this.record = data['Results'];
            this.item = data['totalItems']
            this.length = this.item;
            this.pager = this.pagerService.getPager(this.item, page, this.pageSize);
            // this.pager = this.pagerService.getPager(response['Total Result'], page, this.item);
// 
          });
      })
  }
  unsubscribe_data() {
    this._serv.unsub_staterecord(this.state, this.pageSize, 1).subscribe(
      data => {
        this.record = data['Results'];
        this.item = data['totalItems']
        this.length = this.item;
      });
  }
  memberonly() {
    this.route.queryParams

      .subscribe(params => {
        this.state = params.state
        if (!this.local) {
          this._nav.navigate(['signin']);
          localStorage.setItem('member', 'state' + this.state)

        }
        else if (!this.subscribe) {
          this._nav.navigate(['pricing']);

          localStorage.setItem('member', 'state' + this.state)

        }
      })

  }
  move() {
    this.route.queryParams

      .subscribe(params => {
        this.state = params.state
        localStorage.setItem('location', 'state' + this.state)
      })
  }
  download(info) {
    this._serv.downloadFile(info).subscribe(
      data => {
        if (data['status'] = "200") {
          swal(
            'File Downloaded Successfully!',
            '',
            'success'
          )
        }
      },
      error => {

      });
  }
  adminlogin;
  ngOnInit() {
    window.scroll(0, 0);
    window.onscroll = function () { myFunction() };

    var header = document.getElementById("MYHeader");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }
    if (localStorage.getItem('currentadmin')) {
      this.adminlogin = localStorage.getItem('currentadmin')
    }
    // if (localStorage.getItem('statepage')) {
    //   var page_num: number = Number(localStorage.getItem('statepage'));
    //   this.setPage(page_num);
    // } else {
    //   this.setPage(1);
    // }
    this.setPage(1);
    this._shareData.returnState().subscribe(
      data => {
        this.state = data;
        if (!data) {
          this.route.queryParams
            .subscribe(params => {
              this.state = params.state
            })
        }
      })
    this.check_login()
  }

  ngOnDestroy() {
    this.endRequest.unsubscribe();
  }
  single(query) {
    let sth = 'rfp/' + query;
    this._nav.navigate([sth]);
  }

  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this._serv.staterecord(this.state, event.pageSize, event.pageIndex + 1).subscribe(
      data => {
        this.record = data['Results'];
        this.item = data['totalItems']
        this.length = this.item;
      });
  }
  id;
  doc;
  check_trial(id,url) {
    if (this.subscribe == "Trial Subscription user") {
      this.advanceServ.trial_document(id).subscribe(
        data => {
          if (data['status'] == 'True') {
            this.doc = data['status'];
            window.open(data['web_info'], '_blank');
          }
        },
        error => {
          if (error.status == 400) {
            swal({
              type: 'error',
              title: "Bad request!",
              showConfirmButton: true,
              width: '512px',
              confirmButtonColor: "#090200",
            });
          }
          else if (error.status == 403) {
            swal({
              type: 'error',
              title: "Your have already downloaded 5 documents",
              showConfirmButton: true,
              width: '512px',
              confirmButtonColor: "#090200",
            });
          }
          else if(error.status == 406){
            swal({
              type: 'error',
              title: "Your free trial has been expired",
              showConfirmButton: true,
              width: '512px',
              confirmButtonColor: "#090200",
            });
          }
        })
    } else if (this.subscribe == "Subscribe user") {

      window.open(url, '_blank');

    }

  }
  check_login() {
    if (localStorage.getItem('currentadmin')) {
      this.subscribe = localStorage.getItem('currentadmin')
    }
    if (localStorage.getItem('currentUser')) {
      this.local = localStorage.getItem('currentUser');
      let pars = JSON.parse(this.local);
      this.uname = pars.username
      this.homeServ.usersubscribe(this.uname).subscribe(
        data => {
          if (data['Response'] == "Subscribe user" || data['Response'] == "Trial Subscription user") {
            this.subscribe = data['Response']
            return false
          }
        });
    }
    else {
      return true
    }
  }
}
