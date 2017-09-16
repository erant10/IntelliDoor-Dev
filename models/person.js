/*
* Person model
**/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
const config = require('config');


module.exports = {

    // Create Person
    create(personObj, callback) {
        // TODO: implement creating a person
    },

    // Get Person by ID
    getOne(personId, callback) {
        // TODO: implement selecting a person
    }
}