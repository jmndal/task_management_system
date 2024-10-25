$(document).ready(function () {
  $("#member").select2({
    allowClear: true,
    width: "100%",
    templateSelection: function (data, container) {
      $(container)
        .find("span.select2-selection__choice__remove")
        .replaceWith('<i class="bi bi-x-lg ms-1" aria-hidden="true"></i>');
      return data.text;
    },
  });

  // Add Bootstrap form-control and form-select classes to match the styling
  $(".select2-container .select2-selection--multiple").addClass(
    "form-control form-select"
  );

  // Adjust height and padding to match the original form-control and form-select styles
  $(".select2-container .select2-selection--multiple").css({
    height: "calc(3.5rem + calc(var(--bs-border-width) * 2))",
    "min-height": "calc(3.5rem + calc(var(--bs-border-width) * 2))",
    padding: "1rem 0.75rem",
    "line-height": "1.25",
    border: "var(--bs-border-width) solid var(--bs-border-color)",
    "border-radius": "var(--bs-border-radius)",
  });

  $('button[type="reset"]').click(function () {
    $("#member").val(null).trigger("change");
  });
});

var formTask = document.querySelector("#taskForm");
var createTask = formTask.querySelector("button[type='submit']");

createTask.addEventListener("click", function (e) {
  if (formTask.checkValidity() === false) {
    console.log("Form validation failed.");
  } else {
    e.preventDefault();

    var selectElement = document.querySelector("#member");
    var member = Array.from(selectElement.selectedOptions).map(
      (option) => option.value
    );

    var formData = {
      member_id: member,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      due_date: document.getElementById("due_date").value,
      priority_level: document.getElementById("priority_level").value,
      status: document.getElementById("status").value,
    };

    var submitButton = formTask.querySelector("button[type='submit']");

    fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
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
  }
});
