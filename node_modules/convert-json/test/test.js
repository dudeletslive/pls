var assert = require('assert');
var cv2json = require('../');

describe("different data type convert into convert-json", function() {
	describe("csv", function() {
		it("should convert csv and return a json object, setting header false", function(done) {
			cv2json.csv("./sample/sample.csv", function(err, result) {
				var data = [ [ 'aaa', 'bbb', 'ccc' ],
					[ '1', '2', '3' ],
					[ '4', '5', '6' ],
					[ '7', '8', '9' ] 
				]
				assert.equal(err, null);
				assert.deepEqual(result, data);

				done();		
			})
		})

		it("should convert csv and return a json object, setting header true", function(done) {
			cv2json.csv("./sample/sample.csv", {header: true}, function(err, result) {
				var data = [ { aaa: '1', bbb: '2', ccc: '3' },
				  { aaa: '4', bbb: '5', ccc: '6' },
				  { aaa: '7', bbb: '8', ccc: '9' } 
				];

				assert.equal(err, null);
				assert.deepEqual(result, data);

				done();		
			})
		})

		it("should convert xls and return a json object", function(done) {
			cv2json.xls("./sample/sample.xls", function(err, result) {
				console.log(result);
				assert.equal(err, null);

				done();		
			})
		})

		it("should convert xlsx and return a json object", function(done) {
			cv2json.xlsx("./sample/sample.xlsx", function(err, result) {
				console.log(result);
				assert.equal(err, null);

				done();		
			})
		})

		it("should convert xml and return a json object", function(done) {
			cv2json.xml("./sample/sample.xml", function(err, result) {
				console.log(result);
				assert.equal(err, null);

				done();		
			})
		})
	})
})