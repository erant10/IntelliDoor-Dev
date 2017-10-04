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


});