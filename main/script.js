function toggleHotelInput(show) {
  var hotelInput = document.getElementById("hotel-name-container");
  if (show) {
    hotelInput.style.display = "block";
    document.getElementById("hotel-name").setAttribute("required", "required");
  } else {
    hotelInput.style.display = "none";
    document.getElementById("hotel-name").removeAttribute("required");
  }
}

function updateHotelToggleValue() {
  const selectedOption = document.querySelector('input[name="hotel-toggle"]:checked').value;
  const pickupInput = document.getElementById('pickup-option');

  if (selectedOption === "hotel") {
    pickupInput.value = "Hotel/Villa Pickup";
  } else {
    pickupInput.value = "Meeting at Sangthong Tours office 09:30AM";
  }
}


// Initialize EmailJS with your Public Key
(function () {
  emailjs.init("75YY32s6jFAHKaIYl");
})();

// Function to generate a random booking ID
function generateBookingID() {
  const today = new Date();
  const datePart = today.toISOString().split('T')[0].replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${datePart}-${randomPart}`;
}

// Function to calculate the total price
function calculateTotalPrice() {
  const selectedPackage = document.querySelector('input[name="package"]:checked');
  if (!selectedPackage) return 0; // Guard against null if no package is selected
  
  const adultPrice = parseInt(selectedPackage.dataset.adult) || 0;
  const childPrice = parseInt(selectedPackage.dataset.child) || 0;

  const adultQty = parseInt(document.getElementById('adult-quantity').value) || 0;
  const childQty = parseInt(document.getElementById('children-quantity').value) || 0;

  const total = (adultQty * adultPrice) + (childQty * childPrice);
  document.getElementById('total-amount').innerText = `${total} THB`;
  return total;
}

// Attach event listeners for price calculation
document.querySelectorAll('input[name="package"], #adult-quantity, #children-quantity').forEach(input => {
  input.addEventListener('change', calculateTotalPrice);
});

// Attach event listeners to hotel-toggle radio buttons
document.querySelectorAll('input[name="hotel-toggle"]').forEach(input => {
  input.addEventListener('change', updateHotelToggleValue);
});

// Function to display the booking summary
function displayBookingSummary(formData) {
  const summary = `
    <p><strong>Booking ID:</strong> ${formData.booking_id}</p>
    <p><strong>Package:</strong> ${formData.package_name}</p>
    <p><strong>Full Name:</strong> ${formData.full_name}</p>
  <p><strong>Pickup Option:</strong> ${formData.pickup_option}</p>
    <p><strong>Hotel/Villa:</strong> ${formData.hotel_name}</p>
    <p><strong>Adults:</strong> ${formData.adult_quantity}</p>
    <p><strong>Children:</strong> ${formData.children_quantity}</p>
    <p><strong>Infants:</strong> ${formData.infant_quantity}</p>
    <p><strong>Whatsapp:</strong> ${formData.whatsapp}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Tour Date:</strong> ${formData.tour_date}</p>
<p><strong>Remark/Special Note:</strong> ${formData.remark}</p>
    <p><strong>Total Amount:</strong> <span style="color: red;">${formData.total_amount} THB</span></p>
    
  
    <!-- Red Font Note -->
    <p style="color: red;">Note: Kindly pay this amount at the counter when arrived at Sangthong Tours office on the tour activity date.</p>
    <!-- Pickup time and Booking confirmation Note -->
    <p>Pickup time and booking confirmation will be sent to your email/WhatsApp within an hour of reservation.</p>
  `;
  document.getElementById('booking-summary').innerHTML = summary;
  
  // Hide the form and show the success page
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('success-page').style.display = 'block';

  // Scroll to the top of the summary page
  window.scrollTo(0, 0);
}

// Form Submission Handler
document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Prevent duplicate form submissions
  if (this.dataset.submitting === "true") {
    return;
  }
  this.dataset.submitting = "true"; // Mark form as submitting

  // Generate and assign Booking ID
  const bookingID = generateBookingID();
  document.getElementById('booking-id').value = bookingID; // Set in hidden input

  const selectedPackage = document.querySelector('input[name="package"]:checked').value;
  const totalAmount = calculateTotalPrice();

  // Update the hotel-toggle value before submitting
  updateHotelToggleValue();

  const formData = {
    booking_id: bookingID,
    package_name: selectedPackage,
    full_name: document.getElementById('full-name').value,
    hotel_name: document.getElementById('hotel-name').value,
    adult_quantity: document.getElementById('adult-quantity').value,
    children_quantity: document.getElementById('children-quantity').value,
    infant_quantity: document.getElementById('infant-quantity').value,
    whatsapp: document.getElementById('whatsapp').value,
    email: document.getElementById('email').value,
    tour_date: document.getElementById('tour-date').value,
    remark: document.getElementById('remark').value,
    total_amount: totalAmount,
    pickup_option: document.getElementById('pickup-option').value, // Corrected field
};
  // Clear any existing hidden input fields for total amount
  const existingTotalAmountFields = document.querySelectorAll('input[name="total_amount"]');
  existingTotalAmountFields.forEach(field => field.remove());

  // Append total amount to the form before sending it to EmailJS
  const totalAmountField = document.createElement('input');
  totalAmountField.type = 'hidden';
  totalAmountField.name = 'total_amount'; // This should match the EmailJS template field
  totalAmountField.value = totalAmount;
  this.appendChild(totalAmountField);



  // Send the form data using EmailJS
  emailjs.sendForm('service_s6c8fmm', 'template_2uti6pa', this)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);

function sendToLine(formData) {
    const lineToken = "HJElCnwuckGZHomP7xoYBlZGHWayX3fV4APjg5ayPCJ"; // Replace with your LINE Notify token

    const message = 
        `📢 *New Booking Received* \n
        📌 Booking ID: ${formData.booking_id} \n
        🌊 Package: ${formData.package_name} \n
        👤 Name: ${formData.full_name} \n
        🏨 Hotel/Villa: ${formData.hotel_name || "N/A"} \n
        👨‍👩‍👧‍👦 Adults: ${formData.adult_quantity}, Children: ${formData.children_quantity}, Infants: ${formData.infant_quantity} \n
        📅 Tour Date: ${formData.tour_date} \n
        💰 Total Amount: ${formData.total_amount} THB \n
        📱 Whatsapp: ${formData.whatsapp} \n
        ✉️ Email: ${formData.email} \n
        📝 Remark: ${formData.remark} \n
        🚖 Pickup Option: ${formData.pickup_option}`;

    fetch("https://notify-api.line.me/api/notify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${HJElCnwuckGZHomP7xoYBlZGHWayX3fV4APjg5ayPCJ}`
        },
        body: `message=${encodeURIComponent(message)}`
    })
    .then(response => response.json())
    .then(data => {
        console.log("LINE Notify Response:", data);
        if (data.status !== 200) {
            alert(`LINE Notify Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("LINE Notify Error:", error);
        alert("Failed to send LINE message. Check the console for details.");
    });
}

      displayBookingSummary(formData);
      document.getElementById('contact-form').reset(); // Reset form
      this.dataset.submitting = "false"; // Reset submission flag
    })
    .catch((error) => {
      console.log('FAILED...', error);
      alert('Form submission failed!');
      this.dataset.submitting = "false"; // Reset submission flag in case of failure
    });
});

// Set the minimum date for the tour date input to tomorrow
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];
document.getElementById('tour-date').setAttribute('min', minDate);

// Function to set default selections on page load
function setDefaultSelections() {
  // Set "Full Day Snorkeling Tour" as default
  document.querySelector('input[name="package"][value="Full Day Snorkeling Tour"]').checked = true;

// Set default package selection to "Full Day Snorkeling Tour"
  const defaultPackage = document.querySelector('input[name="package"][value="full-day-snorkeling"]');
  if (defaultPackage) {
    defaultPackage.checked = true;
  }


  // Set "Meeting at Sangthong Tours office 09:30 AM" as default
  document.querySelector('input[name="hotel-toggle"][value="no-hotel"]').checked = true;

  // Ensure the pickup option hidden input is updated
  document.getElementById('pickup-option').value = "Meeting at Sangthong Tours office 09:30AM";
}

// Book Again Button
document.getElementById('book-again').addEventListener('click', function () {
  document.getElementById('success-page').style.display = 'none';
  document.getElementById('contact-form').style.display = 'block';
  document.getElementById('contact-form').reset();
});

// Set default values and calculate the total amount on page load
window.addEventListener('DOMContentLoaded', function () {
  // Set default adult quantity to 1
  document.getElementById('adult-quantity').value = 1;
  
  
  // Set default total amount by calling the calculateTotalPrice function
  calculateTotalPrice();

  // Set default hotel-toggle value
  updateHotelToggleValue();
});