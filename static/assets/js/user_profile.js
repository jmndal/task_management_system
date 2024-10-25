function userProfile() {
  fetch("/admin/api/d/employee/read/?username=" + getCookie("username"))
    .then((response) => {
      return response.json();
    })
    .then((resp) => {
      const emp = resp.result[0];
      var fullName = emp.FirstName + " " + emp.LastName;
      // Left side display
      document.getElementById("emp-name").innerHTML = fullName;
      document.getElementById("emp-job").innerHTML = emp.Job;

      // Overview
      document.getElementById("emp_name").innerHTML = fullName;
      document.getElementById("emp_company").innerHTML = emp.Company;
      document.getElementById("emp_job").innerHTML = emp.Job;
      document.getElementById("emp_country").innerHTML = emp.Country;
      document.getElementById("emp_address").innerHTML = emp.Address;
      document.getElementById("emp_phone").innerHTML = emp.PhoneNumber;
      document.getElementById("emp_email").innerHTML = emp.Email;

      // Edit user
      if (emp.ProfileImage == "undefined" || emp.ProfileImage == "") {
        document.getElementById("profile_image").src = "/static/assets/img/profile-img.png";
        document.getElementById("emp-profile").src = "/static/assets/img/profile-img.png";
      } else {
        document.getElementById("profile_image").src = emp.ProfileImage;
        document.getElementById("emp-profile").src = emp.ProfileImage;
      };
      document.getElementById("firstName").value = emp.FirstName;
      document.getElementById("lastName").value = emp.LastName;
      document.getElementById("company").value = emp.Company;
      document.getElementById("Job").value = emp.Job;
      document.getElementById("Country").value = emp.Country;
      document.getElementById("Address").value = emp.Address;
      document.getElementById("Phone").value = emp.PhoneNumber;
      document.getElementById("Email").value = emp.Email;
      document.getElementById("admin").checked = emp.Admin;
      document.getElementById("active").checked = emp.Active;

      if (emp.Admin === true) {
        document.getElementById("uploadBtn").removeAttribute("hidden");
        document.getElementById("admin_display").style.display = "block";
        document.getElementById("emp-admin").style.display = "block";
        document.getElementById("edit-user-btn").setAttribute("data-set", "admin");
        document.getElementById("edit-user-btn").setAttribute("data-value", emp.ID);
      } else {
        document.getElementById("uploadBtn").setAttribute("hidden", "");
        document.getElementById("admin_display").style.display = "none";
        document.getElementById("emp-user").style.display = "block";
        document.getElementById("edit-user-btn").setAttribute("data-value", emp.ID);

      }
      
      if (emp.Active === true) {
        document.getElementById("emp-active").style.display = "block";
        document.getElementById("emp-inactive").style.display = "none";
      } else {
        document.getElementById("emp-inactive").style.display = "block";
        document.getElementById("emp-active").style.display = "none";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

userProfile();

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

var editUser = document.getElementById("edit-user-btn");

editUser.addEventListener("click", function(e) {
  e.preventDefault();
  var set = this.getAttribute("data-set");

  const id = this.getAttribute("data-value");
  const pFile = document.getElementById("fileInput").files[0];
  const fName = document.getElementById("firstName").value;
  const lName = document.getElementById("lastName").value;
  const company = document.getElementById("company").value;
  const job = document.getElementById("Job").value;
  const country = document.getElementById("Country").value;
  const address = document.getElementById("Address").value;
  const pNumber = document.getElementById("Phone").value;
  const email = document.getElementById("Email").value;
  const admin = document.getElementById("admin").checked ? 1 : 0;
  const active = document.getElementById("active").checked? 1 : 0;

  let formData = new FormData();

  if (set === 'admin') {
    formData.append("_profile_image", pFile);
    formData.append("_first_name", fName);
    formData.append("_last_name", lName);
    formData.append("_email", email);
    formData.append("_admin", admin);
    formData.append("_active", active);
    formData.append("_company", company);
    formData.append("_job", job);
    formData.append("_country", country);
    formData.append("_address", address);
    formData.append("_phone_number", pNumber);
  } else if (set === 'user') {
    formData.append("_first_name", fName);
    formData.append("_last_name", lName);
    formData.append("_email", email);
    formData.append("_company", company);
    formData.append("_job", job);
    formData.append("_country", country);
    formData.append("_address", address);
    formData.append("_phone_number", pNumber);
  }

  this.disabled = true;

  var url = "/admin/api/d/employee/edit/" + parseInt(id) + "/";

  fetch(url, {
    method: "POST",
    headers: {
      "X-CSRF-TOKEN": getCookie("session"),
    },
    body: formData,
  }).then((resp) => {
    if (resp.status == 200) {
      window.location.reload();
    }
  });
})