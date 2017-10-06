$(document).ready(function(){

	var azureLogicappURL = 'https://prod-27.westeurope.logic.azure.com:443/workflows/1119d87624504ba2adcfb8e12c7cf22d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8WkPtYBCtr6lEq3sbg1JLsgCZshAZK_bCGtaqaiQXTo';

    $('#apartmentResidentsTable').DataTable();

    $('.hiddenParagraph').hide();

    $( "#submitNewGuestButton" ).click(function() {
	  $( "#newGuestForm" ).submit();
	});


    $( ".deleteGuest" ).click(function() {
	  $(this).html('Please wait while deleting your guest...');
	  $(this).css('color', 'blue');
	  $(this).attr('disabled','');
	  var elem_id = $(this).attr('id');
	  var fn_id = "#guestFirstName_"+ elem_id;
	  var firstName = $(fn_id).html()
	  var ln_id = "#guestLastName_"+ elem_id;
	  var lastName = $(ln_id).html()

	  var buildingIdObj = $('#newGuestForm').find('#buildingId')
	  var homeNumberObj = $('#newGuestForm').find('#aptNumber')
	  var buildingId =buildingIdObj.val();
	  var homeNumber =homeNumberObj.val();

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
		  location.reload();
		});
	});


	$('#newGuestForm').submit(function(e) {
		e.preventDefault();
		$(this).append('Please Wait while the guest is being created...');
		var form = $(this);
        $.ajax({
            url: "/uploadNewImage", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false
            success: function(imgUrl)   // A function to be called if request succeeds
            {
                var guestFirstNameObj = form.find('#guestFirstName')
                var guestLastNameObj = form.find('#guestLastName')
                var residentFirstNameObj = form.find('#residentFirstName')
                var residentLastNameObj = form.find('#residentLastName')
                var buildingIdObj = form.find('#buildingId')
                var homeNumberObj = form.find('#aptNumber')

                var guestFirstName = guestFirstNameObj.val();
                var guestLastName = guestLastNameObj.val();
                var residentFirstName = residentFirstNameObj.val();
                var residentLastName = residentLastNameObj.val();
                var buildingId =buildingIdObj.val();
                var homeNumber =homeNumberObj.val();

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
                    "data": "{\n\t\"action\":\"addGuest\",\n\t\"buildingId\":\""+buildingId+"\",\n\t\"aptNum\":"+homeNumber+",\n\t\"firstName\":\""+guestFirstName+"\",\n\t\"lastName\":\""+guestLastName+"\",\n\t\"firstNameOfRes\":\""+residentFirstName+"\",\n\t\"lastNameOfRes\":\""+residentLastName+"\",\n\t\"imageUrl\":[\""+imgUrl+"\"]\n}"

                }

                $.ajax(settings).done(function (response) {
                    location.reload();

                });


            }
        });
	});



	$(".uploadImage").on('submit',function(e) {
        e.preventDefault();

		var id = $(this).attr('id');
		var residentId = id.split('_')[1];

		$.ajax({
			url: "/resident/uploadimage", // Url to which the request is send
			type: "POST",             // Type of request to be send, called as method
			data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
			contentType: false,       // The content type used when sending data to the server.
			cache: false,             // To unable request pages to be cached
			processData:false,        // To send DOMDocument or non processed data file it is set to false
			success: function(filename)   // A function to be called if request succeeds
			{
				$('#images_' + residentId).append("<img data-src=\"holder.js/200x200\" alt=\"200x200\" src=\""+filename+"\" data-holder-rendered=\"true\" style=\"width: 200px; height: 200px;\" class=\"rounded float-left\">")
				$('.uploadButton').attr('disabled',true);
			}
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