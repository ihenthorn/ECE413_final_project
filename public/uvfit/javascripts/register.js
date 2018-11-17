function sendReqForSignup() {
  var email = document.getElementById("email").value;
  var fullName = document.getElementById("fullName").value;
  var password = document.getElementById("password").value;
  var passwordConfirm = document.getElementById("passwordConfirm").value;

  // FIXME: More thorough validation should be performed here. 
  if (password != passwordConfirm) {
    var responseDiv = document.getElementById('ServerResponse');
    responseDiv.style.display = "block";
    responseDiv.innerHTML = "<p>Password does not match.</p>";
    return;
  }
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", signUpResponse);
  xhr.responseType = "json";
  xhr.open("POST", '/users/register');
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({email:email,fullName:fullName, password:password}));
  
  var responseDiv = document.getElementById('ServerResponse');
  responseDiv.style.display = "block";
  responseDiv.innerHTML = "<p>Waiting for server response.</p>";
}

function signUpResponse() {
  
  var responseDiv = document.getElementById('ServerResponse');
  responseDiv.style.display = "block";
  //responseDiv.innerHTML = "<p>Inside \"signUpResponse\" function.</p>";
  responseDiv.innerHTML += "\n<p>Inside \"signUpResponse\" function. this.status = " + this.status + "</p>";
  
  
  // 200 is the response code for a successful GET request
  //if (this.status === 201) {
  if (this.status < 400) {
    responseDiv.innerHTML += "\n<p>this.status < 400</p>";
    if (this.response.success) {
      responseDiv.innerHTML += "\n<p>this.response.success == true</p>";
      // Change current location to the signin page.
      window.location = "signin.html";
    } 
    else {
      responseHTML += "<ol class='ServerResponse'>";
      for (key in this.response) {
        responseHTML += "<li> " + key + ": " + this.response[key] + "</li>";
      }
      responseHTML += "</ol>";
    }
  }
  else {
    // Use a span with dark red text for errors
    responseHTML = "<span class='red-text text-darken-2'>";
    responseHTML += "Error: " + this.response.error;
    responseHTML += "</span>"
  }

  // Update the response div in the webpage and make it visible
  var responseDiv = document.getElementById('ServerResponse');
  responseDiv.style.display = "block";
  responseDiv.innerHTML = responseHTML;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("signup").addEventListener("click", sendReqForSignup);
});
