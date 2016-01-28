"use strict";

function TableData() {

  this.arrayOfOverlaps = [];


  this.content = {rows: [
    {rowID: 1, product: "Widgets", customer: "Tesco", measure: "Gross Sales Price", value: 1, validFromDay: 20130101,  validToDay: 20130401},
   {rowID: 2, product: "Widgets", customer: "Tesco", measure: "Gross Sales Price", value: 1.5, validFromDay: 20130301,  validToDay: 20131231},
   {rowID: 3, product: "Widgets", customer: "Tesco", measure: "Gross Sales Price", value: 2, validFromDay: 20130401,  validToDay: 20150101},
   {rowID: 4, product: "Widgets", customer: "Tesco", measure: "Distribution Cost", value: 5, validFromDay: 20130101,  validToDay: 20130401},
   {rowID: 5, product: "Widgets", customer: "Tesco", measure: "Distribution Cost", value: 6, validFromDay: 20130301,  validToDay: 20140401},
   {rowID: 6, product: "Widgets", customer: "Tesco", measure: "Distribution Cost", value: 7, validFromDay: 20131231,  validToDay: 20150101},
   {rowID: 7, product: "Widgets", customer: "Asda",  measure: "Gross Sales Price", value: 100, validFromDay: 0, validToDay: 99999999},
   {rowID: 8, product: "Widgets", customer: "Asda",  measure: "Gross Sales Price", value: 200, validFromDay: 20131231,  validToDay: 20150101},
   {rowID: 9, product: "Widgets", customer: "Asda",  measure: "Distribution Cost", value: 2, validFromDay: 20130301,  validToDay: 20131231},
   {rowID: 10, product: "Widgets", customer: "Asda",  measure: "Distribution Cost", value: 3, validFromDay: 20140401,  validToDay: 20150101}
  ]};

}


TableData.prototype.sortTable = function() {

  //sort table by product+customer+measure+validFromDay
  this.content.rows.sort(function(a,b) {
    if(a.product+a.customer+a.measure+a.validFromDay < b.product+b.customer+b.measure+b.validFromDay) {
      return -1;
    }
    if(a.product+a.customer+a.measure+a.validFromDay > b.product+b.customer+b.measure+b.validFromDay) {
      return 1;
    }
    // a must equal b
    return 0;
  });

};


TableData.prototype.matchRows = function(i,j) {
  // match rows with the same product, customer and measure
  var a = this.content.rows[i];
  var b = this.content.rows[j];
  return (a.product+a.customer+a.measure) === (b.product+b.customer+b.measure);
};


TableData.prototype.overlaps = function() {
  //sort table by product+customer+measure+validFromDay
  this.sortTable();
  //iterate through table
  //where two ajacent rows match and dates overlap
  //record pair of such rows(A)
  for ( var i = 0, len = this.content.rows.length; i < len-1; i++ ) {
    if(this.matchRows(i,i+1)) {
      // rows match
      if(this.content.rows[i].validToDay >= this.content.rows[i+1].validFromDay) {
        //dates overlap
        //record overlapping rows
        this.arrayOfOverlaps.push([i,i+1]);
      }
    }
  }
};




TableData.prototype.removeOverlap = function() {
  var that = this;
  //iterate through matches with overlap dates
  that.overlaps();
  that.arrayOfOverlaps.forEach(function(pair) {
    if(that.content.rows[pair[0]].measure == 'Gross Sales Price') {
      //for sales, to be prudent, give lower value priority over higher where dates overlap(B)
        //for row 1 and 2
          if(that.content.rows[pair[0]].value < that.content.rows[pair[1]].value) {
            //where value 1 is lower than 2 overwrite row 2 validFromDay with row 1 validToDay+1
            that.content.rows[pair[1]].validFromDay = that.content.rows[pair[0]].validToDay.addDays(1);
          } else {
            //where value 1 is higher than 2 overwrite row 1 validToDay with row 2 validFromDay-1
            that.content.rows[pair[0]].validToDay = that.content.rows[pair[1]].validFromDay.addDays(-1);
          }

    } else {
      //for costs, to be prudent, give higher value prioriy over lower where dates overlap(B)
        //for row 1 and 2
        if(that.content.rows[pair[0]].value > that.content.rows[pair[1]].value) {
            //where value 1 is higher than 2 overwrite row 2 validFromDay with row 1 validToDay+1
            that.content.rows[pair[1]].validFromDay = that.content.rows[pair[0]].validToDay.addDays(1);
          } else {
            //where value 1 is lower than 2 overwrite row 1 validToDay with row 2 validFromDay-1
            that.content.rows[pair[0]].validToDay = that.content.rows[pair[1]].validFromDay.addDays(-1);
          }
    }
  });
  //set the validToDay of any row that contains 99999999 in validFromDay to 99999999 as should not be used
  this.content.rows.forEach(function(item) {
    if(item.validFromDay === 99999999) {
      item.validToDay = 99999999;
    }
    console.log(item);
  });

    //Assumptions (C)
    //===============

    //Remove overlap so that any period shows maximum distribution cost or minimum sale price to be prudent.

    //Assume that item iwth date spanning 00000000 to 99999999 covers entire period so set overlapping itmes to start and end at 99999999 as not used.

    //Assume that data is financial data so needs to be treated as such.

    //Also assume that widgets are fungible and so cannot be tracked.

    //The sale price and distribution cost are set for different number of units so are not comparable.

    //

};


Number.prototype.addDays = function(days) {
  if(this != 99999999 ) {
    var d = new Date();
    var strDate = this.toString();
    d.setFullYear(strDate.slice(0,4),strDate.slice(4,6)-1,strDate.slice(6,8));
    d.setTime(d.getTime() +  (days * 24 * 60 * 60 * 1000));
    return d.getFullYear()*10000 + ((d.getMonth()+1)/12*12)*100 + d.getDate();
  } else {

    return this;
  }
};

