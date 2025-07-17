// Google Maps Initialization
window.initMap = function () {
  const defaultLocation = { lat: -36.8485, lng: 174.7633 }; // Auckland
  const mapElement = document.getElementById("map");

  if (!mapElement) return;

  const map = new google.maps.Map(mapElement, {
    center: defaultLocation,
    zoom: 14,
  });

  const input = document.getElementById("location");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      map.setCenter(place.geometry.location);
      map.setZoom(17);

      new google.maps.Marker({
        map,
        position: place.geometry.location,
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navButtons = document.querySelector(".nav-buttons");

  if (hamburger && navButtons) {
    // Initially hide nav on smaller screens
    if (window.innerWidth <= 1024) {
      navButtons.classList.add("hidden");
    }

    hamburger.addEventListener("click", () => {
      navButtons.classList.toggle("hidden");
    });
  }

  // NEXT BUTTON only if dropdown has a selection
  const issueSelect = document.getElementById("issue-type");
  const nextButton = document.getElementById("next-button");

  issueSelect.addEventListener("change", function () {
    console.log("Selected:", this.value);
    nextButton.disabled = this.value === "";
  });

  if (issueSelect && nextButton) {
    issueSelect.addEventListener("click", () => {
      // Check that value is not empty string
      if (issueSelect.value !== "") {
        nextButton.disabled = false;
      }
    });
  }

  // Optional: handle clicks
  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      alert("Back button clicked (replace this with actual logic)");
    });
  }

  if (nextButton && issueSelect) {
    nextButton.addEventListener("click", () => {
      if (issueSelect.value !== "") {
        // Redirect to next page
        window.location.href = "report.html";
      }
    });
  }
});

// Character Counter
function updateCounter(id) {
  const textarea = document.getElementById(id);
  const counter = document.getElementById(`${id}-counter`);
  counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
}

// Dummy Functions
function removeImage() {
  document.getElementById("image-upload").value = "";
}

function cancelReport() {
  if (confirm("Are you sure you want to cancel this report?")) {
    document.querySelector("form").reset();
    updateCounter("description");
    updateCounter("suggestions");
  }
}

// Activate Submit Button When Required Fields Are Valid
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("report-form");
  const submitBtn = document.getElementById("submit-report");
  const description = document.getElementById("description");
  const dateInput = document.getElementById("report-date");

  function checkFormValidity() {
    const isValid = description.value.trim() && dateInput.value.trim();
    submitBtn.disabled = !isValid;
  }

  if (form) {
    description.addEventListener("input", checkFormValidity);
    dateInput.addEventListener("input", checkFormValidity);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Report submitted successfully!");
      form.reset();
      updateCounter("description");
      submitBtn.disabled = true;
    });
  }
});
