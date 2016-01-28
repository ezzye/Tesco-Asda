"use strict";

describe('Analyse Meta Data',function() {

  var tableData;

  beforeEach(function() {
  tableData = new TableData();
  });


  describe('Test data', function() {

    it('table of values available', function() {
      expect(tableData.content.rows[0].rowID).toEqual(1);
    });

    it('removes overlapping dates on similar rows', function() {
      tableData.removeOverlap();
      expect(tableData.content.rows[7].validToDay).toEqual(99999999);
    });


  });



});