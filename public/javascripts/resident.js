$(document).ready(function(){

	var azureLogicappURL = 'https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo';

    $('#apartmentResidentsTable').DataTable();

    $('.hiddenParagraph').hide();

    $( "#submitNewGuestButton" ).click(function() {
      console.log('submitting');	
	  $( "#newGuestForm" ).submit();
	});


    $( ".deleteGuest" ).click(function() {
      console.log('deleting guest');	
	  
	  var elem_id = $(this).attr('id');
	  var fn_id = "#guestFirstName_"+ elem_id;
	  var firstName = $(fn_id).html()
	  var ln_id = "#guestLastName_"+ elem_id;
	  var lastName = $(ln_id).html()

	  console.log('firstname is: ' +firstName);
	  console.log('lastName is: ' +lastName);

	  var buildingIdObj = $('#newGuestForm').find('#buildingId')
	  var homeNumberObj = $('#newGuestForm').find('#aptNumber')
	  var buildingId =buildingIdObj.val();
	  var homeNumber =homeNumberObj.val();

	  console.log('buildingId is: ' +buildingId);
	  console.log('home number is: ' +homeNumber);

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
		  "data": "{\n\t\"action\":\"removeGuest\",\n\t\"buildingId\":\""+buildingId+"\",\n\t\"aptNum\":"+homeNumber+",\n\t\"firstName\":\""+firstName+"\",\n\t\"lastName\":\""+lastName+"\"\n}"
		}

		$.ajax(settings).done(function (response) {
		  console.log(response);
		});
	});


	$('#newGuestForm').submit(function(e) {
		e.preventDefault();
		console.log('New Guest form was submitted');

		var guestFirstNameObj = $(this).find('#guestFirstName')
		var guestLastNameObj = $(this).find('#guestLastName')
		var residentFirstNameObj = $(this).find('#residentFirstName')
		var residentLastNameObj = $(this).find('#residentLastName')
		var buildingIdObj = $(this).find('#buildingId')
		var homeNumberObj = $(this).find('#aptNumber')
		var imageURLObj = $(this).find('#guestImageURL')

		var guestFirstName = guestFirstNameObj.val();
		var guestLastName = guestLastNameObj.val();
		var residentFirstName = residentFirstNameObj.val();
		var residentLastName = residentLastNameObj.val();
		var buildingId =buildingIdObj.val();
		var homeNumber =homeNumberObj.val();
		var imageURL =imageURLObj.val();
		var imageURLArr = [imageURL];

		console.log('Gust name: ' + guestFirstName);
		console.log('Gust last name: ' + guestLastName);
		console.log('resident name: ' + residentFirstName);
		console.log('resident last name: ' +residentLastName);
		console.log('buildingId is: ' +buildingId);
		console.log('home number is: ' +homeNumber);
		console.log('IMG URL is: ' +imageURL);

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
		  "data": "{\n\t\"action\":\"addGuest\",\n\t\"buildingId\":\""+buildingId+"\",\n\t\"aptNum\":"+homeNumber+",\n\t\"firstName\":\""+guestFirstName+"\",\n\t\"lastName\":\""+guestLastName+"\",\n\t\"firstNameOfRes\":\""+residentFirstName+"\",\n\t\"lastNameOfRes\":\""+residentLastName+"\",\n\t\"imageUrl\":[\""+imageURL+"\"]\n}"
		  
		}

		$.ajax(settings).done(function (response) {
		  console.log(response);
		  $("#newGuestModal").modal('hide');
		});

	});



	//TODO : Complete the uploadImage flow
	$(".uploadImage").on('submit',function(e) {
		e.preventDefault();
		$.ajax({
			url: "http://localhost:3000/resident/uploadimage", // Url to which the request is send
			type: "POST",             // Type of request to be send, called as method
			data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
			contentType: false,       // The content type used when sending data to the server.
			cache: false,             // To unable request pages to be cached
			processData:false,        // To send DOMDocument or non processed data file it is set to false
			success: function(response)   // A function to be called if request succeeds
			{
				console.log(response)
			}
		});
	});


});