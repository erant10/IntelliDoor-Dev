$(document).ready(function(){

	var azureLogicappURL = 'https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo';

    $('.myTable').DataTable();

    //Creating new apartment
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



	//Creating new Resident

	$( ".openNewResidentModalButton" ).on('click',function() {
		var homeId = $(this).attr('id');
		console.log("The HomeID issss : " + homeId);
		$('#HomeId').val(homeId);
	});

	$( ".submitNewResidentButton" ).on('click',function() {
		$( "#newResidentForm" ).submit();
	});



	$('#newResidentForm').submit(function(e) {
        e.preventDefault();
        console.log('will add resident');
        var form = $(this);
        $.ajax({
            url: "/uploadNewImage", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,        // To send DOMDocument or non processed data file it is set to false
            success: function (imgUrl)   // A function to be called if request succeeds
            {
                var buildingIdObj = form.find('#BuildingId')
                var homeIdObj = form.find('#HomeId')
                var firstNameObj = form.find('#FirstName')
                var lastNameObj = form.find('#LastName')
                var userObj = form.find('#user')
                var passwordObj = form.find('#password')
                var emailObj = form.find('#email')
                var phoneObj = form.find('#phone')

                var buildingId = buildingIdObj.val();
                var homeId = homeIdObj.val(); //for example "building1-apt15"
                var firstName = firstNameObj.val();
                var lastName = lastNameObj.val();
                var user = userObj.val();
                var password = passwordObj.val();
                var email = emailObj.val();
                var phone = phoneObj.val();
                var isDefault;
                if ($('input#isDefault').is(':checked')) {
                    isDefault = 1;
                } else {
                    isDefault = 0;
                }

                //Get aptNum from HomeID
                var aptNameArr = homeId.split('-');
                var aptShortName = aptNameArr[1];//for example "apt15"
                var aptNum = aptShortName.slice(3);

                console.log('buildingId: ' + buildingId);
                console.log('homeNumber: ' + aptNum);
                console.log('firstName: ' + firstName);
                console.log('lastName: ' + lastName);
                console.log('user: ' + user);
                console.log('password: ' + password);
                console.log('email: ' + email);
                console.log('phone: ' + phone);
                console.log('imageURL: ' + imgUrl);
                console.log('isDefault: ' + isDefault);


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
                    "data": "{\n\t\"action\":\"addResident\",\n\t\"buildingId\":\"" + buildingId + "\",\n\t\"aptNum\":" + aptNum + ",\n\t\"firstName\":\"" + firstName + "\",\n\t\"lastName\":\"" + lastName + "\",\n\t\"user\" : \"" + user + "\",\n\t\"password\" : \"" + password + "\",\n\t\"email\" : \"" + email + "\",\n\t\"phone\" : \"" + phone + "\",\n\t\"imageUrl\" : [\"" + imgUrl + "\"],\n\t\"isDefault\" :" + isDefault + "\n\t\n}"
                }

                $.ajax(settings).done(function (response) {
                    console.log(response);
                    $("#newResidentModal").modal('hide');
                    var table = $('#residentTable_' + homeId).DataTable();
                    table.row.add([
                        firstName + ' ' + lastName,
                        user,
                        email,
                        phone,
                        isDefault,
                        '<button id="deleteResidentFromApt_' + user + '_' + homeId + '" class="deleteResidentButton btn-link" style="color:red">delete</button>'
                    ])
                        .rows()
                        .invalidate()
                        .draw();
                });
            }
        });
	});


	//Deleting Resident
	// $( ".deleteResidentButton" ).on('click',function() {
	$(document.body).on('click','.deleteResidentButton',function() {
	  	console.log("will delete resident");


	  	//Getting first name and last name
	  	var row = $(this).closest("tr"),       // Finds the closest row <tr> 
	    	tds = row.find("td");
	    var fullnameTd = tds[0];
		var fullname = $(fullnameTd).text();
		console.log('fullname:'+fullname);
	    var fullNameArr = fullname.split(' ');
	    console.log(fullNameArr);
	    var fn = fullNameArr[0];	
	    var ln = fullNameArr[1];

	    //Getting Apartment number
	    console.log('ID:'+this.id);
	    var buttonIDArr = this.id.split('_');
	    console.log('buttonIDArr:'+buttonIDArr);

	    var button = $(this);

	    var homeId = buttonIDArr[2]; //for example "building1-apt15"
	    console.log(aptNameArr);
		var aptNameArr = homeId.split('-');
		console.log(aptNameArr);

		var aptShortName = aptNameArr[1];//for example "apt15"
		var aptNum = aptShortName.slice(3);

		console.log(fn +" "+ ln);
		console.log(homeId);
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
		  var table = $('#residentTable_'+homeId).DataTable();
		  table.row(button.closest("tr").get(0)).remove().draw();

		});

	});


});