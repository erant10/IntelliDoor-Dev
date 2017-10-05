$(document).ready(function(){

	var azureLogicappURL = 'https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo';

    $('.myTable').DataTable();

	$( "#submitNewHomeButton" ).click(function() {
	  $( "#newHomeForm" ).submit();
	});

	$('#newHomeForm').submit(function(e) {
		e.preventDefault();
		console.log('New home form was submitted');

		var homeNumberObj = $(this).find('#HomeNumber')
		var buildingIdObj = $(this).find('#BuildingId')

		var homeNumber = homeNumberObj.val();
		var buildingId = buildingIdObj.val();

		console.log(homeNumber);
		console.log(buildingId);

		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo",
		  "method": "POST",
		  "headers": {
		    "content-type": "application/json",
		    "cache-control": "no-cache"
		},
		  "processData": false,
		  "data": "{\n\t\"action\": \"addApt\",\n    \"aptNum\": "+homeNumber+",\n    \"buildingId\": \""+buildingId+"\"\n}"
		}

		$.ajax(settings).done(function (response) {
		  console.log(response);
		  console.log("SUCCESS!");
		  $("#newHomeModal").modal('hide');
		});

	});



	
	$( ".submitNewResidentButton" ).on('click',function() {
		$( "#newResidentForm" ).submit();
	});

	$('#newResidentForm').submit(function(e) {
		e.preventDefault();

		console.log("will add resident");

		var buildingIdObj = $(this).find('#BuildingId')
		var homeNumberObj = $(this).find('#HomeNumber')
		var firstNameObj = $(this).find('#FirstName')
		var lastNameObj = $(this).find('#LastName')
		var userObj = $(this).find('#user')
		var passwordObj = $(this).find('#password')
		var emailObj = $(this).find('#email')
		var phoneObj = $(this).find('#phone')
		var imageURLObj = $(this).find('#imageUrl')
		var isDefaultObj = $(this).find('#isDefault')

		var buildingId = buildingIdObj.val();
		var homeNumber = homeNumberObj.val();
		var firstName = firstNameObj.val();
		var lastName = lastNameObj.val();
		var user = userObj.val();
		var password = passwordObj.val();
		var email = emailObj.val();
		var phone = phoneObj.val();
		var imageURL =imageURLObj.val();
		var isDefault = isDefaultObj.val();
	
		console.log(' buildingId: ' + buildingId);
		console.log('homeNumber: ' + homeNumber);
		console.log('firstName: ' + firstName);
		console.log('lastName: ' +lastName);
		console.log('user: ' +user);
		console.log('password: ' +password);
		console.log('email: ' +email);
		console.log('phone: ' +phone);
		console.log('imageURL: ' +imageURL);

		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo",
		  "method": "POST",
		  "headers": {
		    "content-type": "application/json",
		    "cache-control": "no-cache",
		  },
		  "processData": false,
		  "data": "{\n\t\"action\":\"addResident\",\n\t\"buildingId\":\""+buildingId+"\",\n\t\"aptNum\":"+homeNumber+",\n\t\"firstName\":\""+firstName+"\",\n\t\"lastName\":\""+lastName+"\",\n\t\"user\" : \""+user+"\",\n\t\"password\" : \""+password+"\",\n\t\"email\" : \""+email+"\",\n\t\"phone\" : \""+phone+"\",\n\t\"imageUrl\" : [\""+imageURL+"\"],\n\t\"isDefault\" :"+isDefault+"\n\t\n}"
		}

		$.ajax(settings).done(function (response) {
		  console.log(response);
		  $("#newResidentModal").modal('hide');
		  $('.myTable').each(function() {
		  	//TODO - find the way to refresh !
    		dt = $(this).dataTable();
    		dt.fnDraw();
		  });	
		});


	});


	$( ".deleteResidentButton" ).on('click',function() {
	  	console.log("will delete resident");
	  	// console.log($(this).closest ('tr'));
	  	// var buttonsRow = $(this).closest ('tr');
	  	var row = $(this).closest("tr"),       // Finds the closest row <tr> 
	    	tds = row.find("td");
	    var fullnameTd = tds[0];
		var fullname = $(fullnameTd).text();
	    var fullNameArr = fullname.split(' ');

	    var fn = fullNameArr[0];	
	    var ln = fullNameArr[1];



	    var buttonIDArr = this.id.split('_');
	    var aptFullNum = buttonIDArr[2]; //for example "building1-apt15"

		console.log(fn +" "+ ln);
		console.log(aptFullNum);

		var aptNameArr = aptFullNum.split('-'); 
		var aptShortName = aptNameArr[1];//for example "apt15"
		var aptNum = aptShortName.slice(3);
		console.log(aptNum);

	  	var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo",
		  "method": "POST",
		  "headers": {
		    "content-type": "application/json",
		    "cache-control": "no-cache",
		    "postman-token": "1e3b7fe0-b6f1-52d1-c630-b8e2facd154e"
		  },
		  "processData": false,
		  "data": "{\n\t\"action\":\"removeResident\",\n\t\"buildingId\":\"building1\",\n\t\"aptNum\":"+aptNum+",\n\t\"firstName\":\""+fn+"\",\n\t\"lastName\":\""+ln+"\"\n}"
		}

		$.ajax(settings).done(function (response) {
		  console.log(response);
		  console.log("SUCCESS!");
		});

	});


});