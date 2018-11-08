var map = null;

function getRecentActivities() {
    var token = window.localStorage.getItem("authToken");
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", displayMostRecentActivity);
    xhr.responseType = "json";   
    xhr.open("GET", "/activities/recent/10");
    xhr.setRequestHeader("x-auth", token);
    xhr.send();
}

function displayMostRecentActivity() {
   document.getElementById("main").style.display = "block";

   if (this.status === 200) {
	   // If there's at least one activity, draw the map
	   var latitude = 0.0;
	   var longitude = 0.0;
       var activityReport = "No activities have been reported in the last ten days.";
   
	   if (this.response.activities.length > 0) {
	      var latitude = this.response.activities[this.response.activities.length-1].latitude;
	      var longitude = this.response.activities[this.response.activities.length-1].longitude;
		
	      // Report number of activities
	      activityReport = this.response.activities.length +
		                  " activites have been uploaded in the last ten days. The most recent activity (shown above) was " +
		                  this.response.activities[this.response.activities.length-1].date;
	   }
	    
	   // EXTRA CREDIT
	   //potholeText.innerHTML = activityReport;
	   // Create a map centered at the most recent pothole location
      /*var uluru = {lat: latitude, lng: longitude};
      var map = new google.maps.Map(document.getElementById('map'), {
		   zoom: 9,
		   center: uluru
	   });
	    
	   // Add markers for all act            
      for (var pothole of this.response.potholes) {
         uluru = {lat: pothole.latitude, lng: pothole.longitude};
         var marker = new google.maps.Marker({
            position: uluru,
            map: map,
            label: {
               text: "" + pothole.totalHits,
               color: 'black',
               fontSize: "10px"
            },
		   });
      }  */              
    }
    else if (this.status === 401) {
        window.localStorage.removeItem("authToken");
        window.location = "signin.html";
    }
    else {
    	// ?
        //potholeText.innerHTML = "Error communicating with server.";
    }    
}

// Executes once the google map api is loaded, and then sets up the handler's and calls
function initRecent() {
    // Allow the user to refresh by clicking a button.
    document.getElementById("refreshRecent").addEventListener("click", getRecentActivities);
    getRecentActivities();
}

// Handle authentication on page load
$(function() {
   // If there's no authToekn stored, redirect user to 
   // the sign-in page (which is index.html)
   if (!window.localStorage.getItem("authToken")) {
      window.location.replace("index.html");
   }
});
