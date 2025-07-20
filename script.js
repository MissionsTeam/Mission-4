// MAP LOGIC
let map; // Global reference so we can access it outside initMap
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
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateCounter("description");

  const hamburger = document.querySelector(".hamburger");
  const navButtons = document.querySelector(".nav-buttons");

  if (hamburger && navButtons) {
    if (window.innerWidth <= 1024) {
      navButtons.classList.add("hidden");
    }

    hamburger.addEventListener("click", () => {
      navButtons.classList.toggle("hidden");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const toggleMapBtn = document.getElementById("toggle-map");
    const mapContainer = document.getElementById("map-container");

    if (toggleMapBtn && mapContainer) {
      toggleMapBtn.addEventListener("click", () => {
        const isVisible = mapContainer.style.display === "block";
        mapContainer.style.display = isVisible ? "none" : "block";
        toggleMapBtn.textContent = isVisible
          ? "Choose Location on Map"
          : "Hide Map";

        // Trigger map resize if being shown
        if (!isVisible && map) {
          setTimeout(() => {
            google.maps.event.trigger(map, "resize");
            map.setCenter({ lat: -36.8485, lng: 174.7633 }); // recentre after resize
          }, 200);
        }
      });
    }
  });

  const issueSelect = document.getElementById("issue-type");
  const nextButton = document.getElementById("next-button");

  if (issueSelect && nextButton) {
    issueSelect.addEventListener("change", function () {
      nextButton.disabled = this.value === "";
    });

    issueSelect.addEventListener("click", () => {
      if (issueSelect.value !== "") {
        nextButton.disabled = false;
      }
    });

    nextButton.addEventListener("click", () => {
      if (issueSelect.value !== "") {
        window.location.href = "report.html";
      }
    });
  }

  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      alert("Back button clicked (replace this with actual logic)");
    });
  }

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

    // ✅ Replaced this block to redirect to survey.html if form is valid
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const locationInput = document.getElementById("location");
      const descriptionValid = description.value.trim() !== "";
      const dateValid = dateInput.value.trim() !== "";
      const locationValid = locationInput && locationInput.value.trim() !== "";

      if (descriptionValid && dateValid && locationValid) {
        window.location.href = "survey.html"; // redirect to the success page
      } else {
        alert("Please fill in all required fields before submitting.");
      }
    });
  }
});

function updateCounter(id) {
  const textarea = document.getElementById(id);
  const counter = document.getElementById(`${id}-counter`);
  if (textarea && counter) {
    counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
  }
}

function removeImage() {
  document.getElementById("image-upload").value = "";
}

function cancelReport() {
  if (confirm("Are you sure you want to cancel this report?")) {
    document.querySelector("form").reset();
    updateCounter("description");
  }
}

document.getElementById("submit-review").addEventListener("click", () => {
  const appeal = document.querySelector('input[name="appeal"]:checked');
  const satisfaction = document.querySelector(
    'input[name="satisfaction"]:checked'
  );

  if (!appeal || !satisfaction) {
    alert("Please select a rating for both appeal and satisfaction.");
    return;
  }

  // Show modal success message
  document.getElementById("review-success-modal").style.display = "flex";

  // 🔒 Disable the button to prevent re-submission
  document.getElementById("submit-review").disabled = true;
});
