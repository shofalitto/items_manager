import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Items } from './classes/item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit {
  listName: 'Inventory Manager';
  url = 'http://localhost:3000/api/items/';

  //item
  id: number;
  name: string;
  description: string;
  count: number;

  post_result: String;
  deposit_withdraw_result: String;


  itemsList: Items;
  singleItem: Items;


  constructor(private http: HttpClient) {}

  getItems() {
    this.ngOnInit()
  }


  postItem(name: String, description: String, count: number) {
    this.http.post(this.url, {
      name: name,
      description: description,
      count: count
    })
      .toPromise()
      .then((data: any) => {
        console.log(data)
        console.log(JSON.stringify(data.json));
        this.post_result = JSON.stringify(name);
      })
      .catch();
  }

  getItemById(id: number) {
    this.http.get(this.url + id)
      .subscribe
      (
        (data: any) => {
          console.log(data)
          this.singleItem = data;
        }
      );
  }

  updateItemById(id: number, name: String, description: String, count: number) {
    this.http.put(this.url + id,{
      name: name,
      description: description,
      count: count
    })
      .toPromise()
      .then((data:any) => {
        console.log(data)
        console.log(JSON.stringify(data.json));
        this.post_result = JSON.stringify("id: "+id);
      })

  }

  deleteItemById(id: number){
    this.http.delete(this.url + id)
      .toPromise()
      .then((data:any) => {
        console.log(data)
        console.log(JSON.stringify(data.json));
        this.post_result = JSON.stringify("id: "+id);
      })
  }
  //
  withdrawItemCount(id: number, count: number){
    this.http.put(this.url+"withdraw" +"/"+ id +"/"+count,{})
      .toPromise()
      .then((data: any) => {
        console.log(data)
        console.log(JSON.stringify(data.json));
        this.deposit_withdraw_result = JSON.stringify(count);
      })
  }

  depositItemCount(id: number, count: number){
    this.http.put(this.url+"deposit" +"/"+ id +"/"+count,{})
      .toPromise()
      .then((data: any) => {
        console.log(data)
        console.log(JSON.stringify(data.json));
        this.deposit_withdraw_result = JSON.stringify(count);
      })
  }

  ngOnInit() {
    this.http.get(this.url)
      .subscribe
      (
        (data: any) => {
          this.itemsList = data;
          console.log(data);
        }
      )
  }


}







