// Select and display image
document.getElementById("uploadBtn").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onloadend = function () {
      var base64String = reader.result;

      // Check if the result is correct
      if (base64String.startsWith("data:image/")) {
        document.getElementById("profile_image").src = base64String;
      } else {
        console.error("File is not a valid image.");
      };

    };

    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
  } else {
    console.error("No file selected.");
  };
});

// Submit form
var form = document.getElementById("userForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const pFile = document.getElementById("fileInput").files[0];
  const admin = document.getElementById("admin").checked ? 1 : 0;
  const active = document.getElementById("active").checked ? 1 : 0;
  const fName = document.getElementById("firstname").value;
  const lName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const uName = document.getElementById("username").value;
  const pWord = document.getElementById("current-password").value;
  const cPany = document.getElementById("company").value;
  const job = document.getElementById("job").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const pNumber = document.getElementById("phone_number").value;

  if (form.checkValidity() === false) {
    console.log("Form validation failed.");
  } else {
    var url = "/admin/api/d/employee/add/";
    let formData = new FormData();
    formData.append("_profile_image", pFile);
    formData.append("_first_name", fName);
    formData.append("_last_name", lName);
    formData.append("_email", email);
    formData.append("_username", uName);
    formData.append("_password", pWord);
    formData.append("_admin", admin);
    formData.append("_active", active);
    formData.append("_company", cPany);
    formData.append("_job", job);
    formData.append("_country", country);
    formData.append("_address", address);
    formData.append("_phone_number", pNumber);

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector("button[type='submit']");

    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-TOKEN": getCookie("session"),
      },
      body: formData,
    })
      .then((resp) => {
        submitButton.disabled = true;
        if (resp.status == 200) {
          window.location.reload();
        } else {
          console.error("Failed to submit the form:", resp.status);
          submitButton.disabled = false;
        }
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);
        submitButton.disabled = false;
      });
  };
});