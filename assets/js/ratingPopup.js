function openRatingPopup(id) {
  const userid = localStorage.getItem('userId');

  if (userid !== null) {
    $(".rating_review_popup_container").addClass('active');
    $("body").css("overflow", "hidden");
    $(".wrapper-overlay").addClass("active");


    // Restore previous rating
    const stars = document.querySelectorAll('.svg-star');
    let rating = localStorage.getItem("product_rating");

    if (rating != null) {
      let clickedIndex = rating - 1;
      stars.forEach((s, i) => {
        s.classList.toggle('active', i <= clickedIndex);
      });
    }

  } else {
    warningAlert(' please Login First ');
  }
}

function closeRatingPopup() { 
  $(".rating_review_popup_container").removeClass("active"); 
  $("body").css("overflow", "auto"); 
  $(".wrapper-overlay").removeClass("active"); 
}
$(".wrapper-overlay").on("click", closeRatingPopup); 
$(".open-rating-btn").on("click", function () { 
  const id = $(this).data("id");
   openRatingPopup(id); 
  });
