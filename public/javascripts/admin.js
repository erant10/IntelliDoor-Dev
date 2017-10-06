$(document).ready(function(){

	var azureLogicappURL = 'https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo';

    $('.myTable').DataTable();

    //Creating new apartment
	$( "#submitNewHomeButton" ).click(function() {
	  $( "#newHomeForm" ).submit();
	});

	$('#newHomeForm').submit(function(e) {
		$(this).append('Please Wait while the home is being created...')
		e.preventDefault();
		var homeNumberObj = $(this).find('#HomeNumber')
		var buildingIdObj = $(this).find('#BuildingId')

		var homeNumber = homeNumberObj.val();
		var buildingId = buildingIdObj.val();

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
		  location.reload();

		});

	});



	//Creating new Resident

	$( ".openNewResidentModalButton" ).on('click',function() {
		var homeId = $(this).attr('id');
		$('#HomeId').val(homeId);
	});

	$( ".submitNewResidentButton" ).on('click',function() {
		$( "#newResidentForm" ).submit();
	});



	$('#newResidentForm').submit(function(e) {
        e.preventDefault();
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

                    //Update DB of new default user if needed
                    if(isDefault === 1) {

                        var settings2 = {
                            "async": true,
                            "crossDomain": true,
                            "url": "/update",
                            "method": "POST",
                            "headers": {
                                "content-type": "application/json",
                                "cache-control": "no-cache"
                            },
                            "processData": false,
                            "data": "{\n\t\"buildingId\": \""+buildingId+"\",\n\t\"aptNum\": "+aptNum+",\n\t\"user\": \""+user+"\"\n}"
                        };

	                    $.ajax(settings2).done(function (response) {
	                    	console.log("update DB of a new Default resident. result: " + response)
	                    });
                    }

                    $('.uploadButton').attr('disabled',true);
                    $("#newResidentModal").modal('hide');
                    var table = $('#residentTable_' + homeId).DataTable();
                    table.row.add([
                        firstName + ' ' + lastName,
                        user,
                        email,
                        phone,
                        (isDefault === 1),
                        '<button id="deleteResidentFromApt_' + user + '_' + homeId + '" class="deleteResidentButton btn-link" style="color:red">delete</button>'
                    ])
                        .rows()
                        .invalidate()
                        .draw();

                    $('#newResidentForm')[0].reset();

                });
            }
        });
	});


	//Deleting Resident
	// $( ".deleteResidentButton" ).on('click',function() {
	$(document.body).on('click','.deleteResidentButton',function() {
	  	//Getting first name and last name
	  	var row = $(this).closest("tr"),       // Finds the closest row <tr> 
	    	tds = row.find("td");
	    var fullnameTd = tds[0];
		var fullname = $(fullnameTd).text();
	    var fullNameArr = fullname.split(' ');
	    var fn = fullNameArr[0];
	    var ln = fullNameArr[1];

	    //Getting Apartment number
	    var buttonIDArr = this.id.split('_');

	    var button = $(this);

	    var homeId = buttonIDArr[2]; //for example "building1-apt15"
		var aptNameArr = homeId.split('-');

		var aptShortName = aptNameArr[1];//for example "apt15"
		var aptNum = aptShortName.slice(3);

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
		  var table = $('#residentTable_'+homeId).DataTable();
		  table.row(button.closest("tr").get(0)).remove().draw();

		});

	});

	$('input:file').change(
        function(){
            if ($(this).val()) {
                $('.uploadButton').attr('disabled',false);
                // or, as has been pointed out elsewhere:
                // $('input:submit').removeAttr('disabled'); 
            } 
        }
    );



});