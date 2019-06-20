import { HomeService } from './../../common/home/home.service';
import { Component, OnInit, Compiler } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import swal from 'sweetalert2';
import { SharedData } from '../../../services/shared-service';
import { PagerService } from '../../../services/paginator.service';
import { AllRfpsService } from './all-rfps.service';
declare const $: any;
import * as moment from 'moment';
import { Location } from '@angular/common';
import { SeoService } from '../../../services/seoService';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-all-rfps',
  templateUrl: './all-rfps.component.html',
  styleUrls: ['./all-rfps.component.css',
              '../../local-style/pagination.css',
              '../../local-style/table-normal.css',
              '../../local-style/products-area.css'

],
  providers: [PagerService, AllRfpsService, SharedData, HomeService]
})
export class AllRfpsComponent implements OnInit {
  item;
  back() {
    this._location.back();
  }
  state;
  record: any = [];
  currentUser;
  length = 0;
  constructor(public homeServ: HomeService, public dialog: MatDialog, private _compiler: Compiler, private pagerService: PagerService, public _shareData: SharedData, private _nav: Router, private _serv: AllRfpsService, private route: ActivatedRoute, private _location: Location, private seoService: SeoService) {
    localStorage.removeItem('member');
  }
  ngOnInit() {
    window.scroll(0, 0);
    window.onscroll = function () { myFunction() };
    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;

    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }

    // --------------- SEO Service ---------------
    // setting the page title 
    this.seoService.setTitle('Latest RFPs');

    // Updating Open Graph
    this.seoService.updateOGTitle('Latest RFPs');
    this.seoService.updateOGURL(window.location.href);

    // setting CanonicalURL
    this.seoService.createLinkForCanonicalURL();

    // setting twitter
    this.seoService.updateTwitterTitle('Latest RFPs');

    this.seoService.addMetaKeyWords(this.keyWords);

    // --------------- SEO Service End ---------------

    if (localStorage.getItem('latestpage')) {
      var page_num: number = Number(localStorage.getItem('latestpage'));
      this.setPage(page_num);
    } else {
      this.setPage(1);
    }
    // this.setPage(1);
    this.check_login()
    if (localStorage.getItem('currentadmin')) {
      this.adminlogin = localStorage.getItem('currentadmin')
    }
  }
  formats = [
    moment.ISO_8601,
    "YYYY/MM/DD"
  ];
  // MatPaginator Inputs
  // length
  pageSize = "10";
  matpageSizeOptions = [10, 20, 35, 50];
  pager: any = {};
  end;
  status;
  local;
  uname;
  subscribe;
  date;

  check(date) {

    this.date = moment(date, this.formats, true).isValid()

    return this.date;


  }
  memberonly() {

    if (!this.local) {
      this._nav.navigate(['pricing']);
      localStorage.setItem('member', 'latest-rfp');
    }
    else if (!this.subscribe) {
      this._nav.navigate(['pricing']);
      localStorage.setItem('member', 'latest-rfp');

    }
  }
  move() {
    localStorage.setItem('location', 'latest-rfp')
  }
  page(pageSize) {
    if (pageSize) {
      this.pageSize = pageSize;
      // if (localStorage.getItem('latestpage')) {
      //   var page_num: number = Number(localStorage.getItem('latestpage'));
      //   this.setPage(page_num);
      // } else {
        this.setPage(1);
      // }
    }
    else {
      delete this.pageSize;
    }
  }
  enter: any = [];
  setPage(page) {
    localStorage.setItem('latestpage', page);
    this._serv.latestrfpecord(this.pageSize, page).subscribe(
      data => {

        this.record = data['results'];

        this.item = data['totalItems'];

        this.pager = this.pagerService.getPager(this.item, page, this.pageSize);

      },
      error => {
        this.record.splice(0, this.record.length);

      });
    this._compiler.clearCache()
  }
  download(info) {
    // alert(info)
    this._serv.downloadFile(info).subscribe(
      data => {
        if (data['status'] = "200") {
          swal(
            'File Downloaded Successfully!',
            '',
            'success'
          )
        }
      });
  }
  adminlogin;


  openNav() {
    document.getElementById("mySidebar").style.width = "250px";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
  }

  single(query) {
    let sth = 'rfp/' + query;
    this._nav.navigate([sth]);
  }
  doc;
  check_trial(id, web_info) {
    if (this.subscribe == "Trial Subscription user") {
      this._serv.trial_document(id).subscribe(
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
    }
    else if (this.subscribe == "Subscribe user") {
      window.open(web_info, '_blank');
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
  keyWords = "rfp bid sites,rfp bidding sites, bid sites, rfp usa, government rfp website, rfp consulting firm, rfp consulting firm in dallas, rfp project management, rfp project management services, rfp search engine, rfp project management services, rfp proposal, rfp consulting, government rfp, digital marketing rfp, rfp management, website rfp example, rfp services, rfp for audit services, agency rfp, best rfp software, data management rfp, energy efficiency rfp, rfp for property management services, energy storage rfp, rfp business, rfp contract terms, rfp government bids, government rfp search, rfp aggregator, best rfp database, rfp database, government rfp database, rfp sites, rfp online, find rfp, find rfp bid sites, find rfp bid, find rfp bids, Government Request for Proposal, rfp search, rfp process, marketing rfp database, architectural rfp database, architectural design bids, bid finder, government bids, government contracts, contract bidding websites, construction bidding websites, best construction bid sites, free rfp bid sites, public rfp database";
}