$(document).ready(function () {
  // Sidebar Toggle
  $('#toggle-btn').click(function () {
    $('.sidebar').toggleClass('show');
  });

  // Calendar Initialization (using FullCalendar)
  $('#calendar').fullCalendar({
    // Add your calendar events and configuration here
  });
});
