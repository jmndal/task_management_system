function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function abbreviateName(fullName) {
  const nameParts = fullName.trim().split(" ");

  const firstInitial = nameParts[0].charAt(0).toUpperCase() + ".";
  const lastName = nameParts[nameParts.length - 1];

  const abbreviatedName = `${firstInitial} ${lastName}`;

  return abbreviatedName;
}

function displayName() {
  fetch("/admin/api/d/employee/read/?username=" + getCookie("username"))
    .then((response) => {
      return response.json();
    })
    .then((resp) => {
      const emp = resp.result[0];

      if (emp.Admin == true) {
        document.getElementById("emp_admin").style.display = "block";
      } else {
        document.getElementById("emp_admin").style.display = "none";
      }

      var fullName = emp.FirstName + " " + emp.LastName;
      var empName = document.getElementsByClassName("employee_name");
      empName[0].innerHTML = abbreviateName(fullName);
      empName[1].innerHTML = fullName;
      document.getElementById("employee_job").innerHTML = emp.Job;

      if (emp.ProfileImage == "undefined" || emp.ProfileImage == "") {
        document.getElementById("employee_profile").src = "/static/assets/img/profile-img.png";
      } else {
        document.getElementById("employee_profile").src = emp.ProfileImage;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

displayName();

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'collapsed' class from all nav-links
      navLinks.forEach(function (otherLink) {
        otherLink.classList.add("collapsed");
      });

      // Remove 'collapsed' class from the clicked link
      this.classList.remove("collapsed");
    });
  });
});

function formatDate(date) {
  const dateObj = new Date(date);

  // Define options for formatting the date
  const options = { year: "numeric", month: "long", day: "2-digit" };

  // Format the date to "January 06, 2024"
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}