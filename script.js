// MAP LOGIC
let map;
let marker;

window.initMap = function () {
  const defaultLocation = { lat: -36.8485, lng: 174.7633 };
  const mapElement = document.getElementById("map-interactive");

  if (!mapElement) return;

  map = new google.maps.Map(mapElement, {
    center: defaultLocation,
    zoom: 14,
  });

  const input = document.getElementById("location");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.setCenter(place.geometry.location);
    map.setZoom(17);

    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
  });

  map.addListener("click", (event) => {
    const latLng = event.latLng;

    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      const input = document.getElementById("location");
      if (status === "OK" && results[0]) {
        input.value = results[0].formatted_address;
      } else {
        input.value = `Lat: ${latLng.lat()}, Lng: ${latLng.lng()}`;
      }
      checkFormValidity(); // Ensure form validation updates after map selection
    });
  });
};

// GLOBAL EVENTS
document.addEventListener("DOMContentLoaded", () => {
  updateCounter("description");

  console.log("DOM loaded and script.js is running");

  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navButtons = document.querySelector(".nav-buttons");
  if (hamburger && navButtons && window.innerWidth <= 1024) {
    navButtons.classList.add("hidden");
    hamburger.addEventListener("click", () => {
      navButtons.classList.toggle("hidden");
    });
  }

  // Map toggler
  const toggleMapBtn = document.getElementById("toggle-map");
  const mapContainer = document.getElementById("map-container");
  if (toggleMapBtn && mapContainer) {
    toggleMapBtn.addEventListener("click", () => {
      const isVisible = mapContainer.style.display === "block";
      mapContainer.style.display = isVisible ? "none" : "block";
      toggleMapBtn.textContent = isVisible
        ? "Choose Location on Map"
        : "Hide Map";

      if (!isVisible) {
        setTimeout(() => {
          if (!map) {
            initMap();
          } else {
            google.maps.event.trigger(map, "resize");
            map.setCenter({ lat: -36.8485, lng: 174.7633 });
          }
        }, 300);
      }
    });
  }

  // Dropdown logic
  const issueSelect = document.getElementById("issue-type");
  const nextButton = document.getElementById("next-button");
  if (issueSelect && nextButton) {
    issueSelect.addEventListener("change", () => {
      nextButton.disabled = issueSelect.value === "";
    });

    nextButton.addEventListener("click", () => {
      if (issueSelect.value !== "") {
        const formSection = document.getElementById("report-form");
        if (formSection) {
          formSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Back button placeholder
  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      cancelReport();
    });
  }

  // Form validation and submission
  const form = document.getElementById("report-form");
  const submitBtn = document.getElementById("submit-report");
  const description = document.getElementById("description");
  const dateInput = document.getElementById("report-date");
  const locationInput = document.getElementById("location");

  function checkFormValidity() {
    const isValid =
      description.value.trim() &&
      dateInput.value.trim() &&
      locationInput.value.trim();
    submitBtn.disabled = !isValid;
  }

  if (form) {
    // Ensure validation on all inputs
    ["input", "change"].forEach((event) => {
      description.addEventListener(event, () => {
        updateCounter("description");
        checkFormValidity();
      });
      dateInput.addEventListener(event, checkFormValidity);
      locationInput.addEventListener(event, checkFormValidity);
    });

    // Run once in case fields are pre-filled
    checkFormValidity();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!submitBtn.disabled) {
        window.location.href = "survey.html";
      }
    });
  }

  // Review section logic
  if (window.location.pathname.includes("survey.html")) {
    const reviewSubmit = document.getElementById("submit-review");
    if (reviewSubmit) {
      reviewSubmit.addEventListener("click", () => {
        const appeal = document.querySelector('input[name="appeal"]:checked');
        const satisfaction = document.querySelector(
          'input[name="satisfaction"]:checked'
        );

        if (!appeal || !satisfaction) {
          alert("Please select a rating for both appeal and satisfaction.");
          return;
        }

        document.getElementById("review-success-modal").classList.add("show");
        reviewSubmit.disabled = true;
      });
    }
  }
});

// CHARACTER COUNTER
function updateCounter(id) {
  const textarea = document.getElementById(id);
  const counter = document.getElementById(`${id}-counter`);
  if (textarea && counter) {
    counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
  }
}

// IMAGE UPLOAD LOGIC
function removeImage() {
  document.getElementById("image-upload").value = "";
}

// CANCEL REPORT LOGIC
function cancelReport() {
  if (confirm("Are you sure you want to cancel this report?")) {
    window.location.href = "categories.html";
  }
}
