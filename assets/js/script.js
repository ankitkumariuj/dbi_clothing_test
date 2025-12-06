

const API_URL = "https://dbifashion.dbidemo.online/backend/dashboard/frontendapi/index.php";
const image_url =
  "https://dbifashion.dbidemo.online/backend/dashboard/backendapi/newapi/images/";
const scatei =
  "https://dbifashion.dbidemo.online/backend/dashboard/backendapi/newapi/images/subimages/";

  const review_image= "https://dbifashion.dbidemo.online/backend/dashboard/frontendapi/";

const loginModal = document.getElementById("loginModal");
const loginModalBox = loginModal.querySelector(".modal");
const closeLoginModalWrapper = document.querySelector(
  ".close-login-modal-wrapper"
);
const BODY = document.querySelector("body");




function openModal() {
const login_status = localStorage.getItem("login_status");


  if (login_status) {
    setTimeout(() => {
      location.href = "profile.html";
    }, 500);
  } else {
    
    setTimeout(() => {
      location.href = "login.html";
    }, 500);
  }
}



function closeModal() {

  loginModalBox.classList.remove("modal-slide-ups");
  loginModalBox.classList.add("modal-slide-downs");


  BODY.style.overflow = "auto";

  setTimeout(() => {
    closeLoginModalWrapper.classList.remove("active");
    loginModalBox.classList.remove("active", "modal-slide-downs");
    loginModal.classList.remove("active");
  }, 500); 
}



$("#swich-to-sign_up-content").click(() => {
  $(".signup-input-box").removeClass("hide");
  $(".sign_in_title").addClass("hide");
  $(".sign_up_title").removeClass("hide");
  $("#for_sign_up").removeClass("hide");
  $("#for_sign_in").addClass("hide");
  $(".btn-submit-text").text("Sign Up");
});
$("#swich-to-sign_in-content").click(() => {
  $(".signup-input-box").addClass("hide");
  $(".sign_in_title").removeClass("hide");
  $(".sign_up_title").addClass("hide");
  $("#for_sign_up").removeClass("hide");
  $("#for_sign_in").addClass("hide");
  $(".btn-submit-text").text("Log In");
});

$("#creat-account").change(function () {
  $("#creat-account-dropdown-item").toggleClass("hide", !this.checked);
});
$("#different-address").change(function () {
  $("#different-address-dropdown-item").toggleClass("hide", !this.checked);
});

function openSearch() {
  document.getElementById("searchModal").classList.add("active");
  document.querySelector(".search_wrapper_overlay").classList.add("active");
}

function closeSearch() {
  document.getElementById("searchModal").classList.remove("active");
  document.querySelector(".search_wrapper_overlay").classList.remove("active");
}

$('#icon-btn').click(function(){
  location.href="../pages/search.html"
})

$(".k_eye_icon").click(function () {
  const input = $("#login_password_input");
  const icon = $(this).find("i");

  if (input.attr("type") === "password") {
    input.attr("type", "text");
    icon.removeClass("fa-eye").addClass("fa-eye-slash");
  } else {
    input.attr("type", "password");
    icon.removeClass("fa-eye-slash").addClass("fa-eye");
  }
});

// Close on outside click
window.onclick = function (event) {
  const searchModal = document.getElementById("searchModal");
  if (event.target === searchModal) {
    searchModal.style.display = "none";
  }
};

$(".hamberger-menu-icon").click(() => {
  $(".menu-sidebar-container").addClass("active");
  $(".wrapper-overlay").addClass("active");
  $("body").css("overflow", "hidden");
});

$(".close-menu-sidebar , .wrapper-overlay").click(() => {
  $(".menu-sidebar-container").removeClass("active");
  $(".wrapper-overlay").removeClass("active");
  $("body").css("overflow", "auto");
});

$(".m-login-btn , .m-register-btn").click(() => {
  $(".menu-sidebar-container").removeClass("active");
  $(".wrapper-overlay").removeClass("active");
  setTimeout(() => {
    openModal();
  }, 180);
});

$(document).on("click", ".sd-dropdown-icon", function (e) {
  e.preventDefault();
  $(this).toggleClass("active");

  var menu = $(this).closest(".dropdown-pli").next(".dropdown-menu");
  var menuHeight = menu[0].scrollHeight;

  if (!menu.hasClass("active")) {
    menu.addClass("active");
    menu.css("height", menuHeight + "px");
  } else {
    menu.removeClass("active");
    menu.css("height", "0");
  }
});

if (login_status == "true") {
  $(".m-btn-content").html(`
    <div class="m-btn m-login-btn" onclick="logout()"><a>LogOut</a></div>
    `);
}

function logout() {
  localStorage.removeItem("login_status");
  localStorage.removeItem("userId");
  localStorage.removeItem('name');
  localStorage.removeItem('phone');
  location.reload();
}

const emptyHtml = `
<div class="empty-cart-messages">
  <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Cart empty"></div>
</div>
`;


function loadWishlistCount() {
  const wishlistIconBadge = $(".wishlist-icon-badge");
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    wishlistIconBadge.html("0"); // 🚀 clear when no user
    return;
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadWishlistCount", userId: userId, t: new Date().getTime() },
    success: function (response) {
      // 🚀 Ensure response is valid and update count accordingly
      if (response && response.status !== false && response.total_items > 0) {
        wishlistIconBadge.html(response.total_items);
      } else {
        wishlistIconBadge.html("0"); // 🚀 reset badge if no items
      }
    },
    error: function () {
      wishlistIconBadge.html("0"); // 🚀 safe fallback on error
    }
  });
}




// category fetch for search bar 
const searchcategory = () => {
    $.ajax({
        url: API_URL,
        method: "POST",
        dataType: "json",
        data: { type: "fetchCategory" },
        success: function(res) {
            
            if (Array.isArray(res) && res.length > 0) {
                let options = '<option value="">Categories</option>';

                res.forEach(function(cat) {
                    options += `<option value="${cat.id}">${cat.name}</option>`;
                });

                $(".search-category").html(options);
            }
        }
    });
};

function goToCategory(selectEl) {
    const categoryId = selectEl.value;
    if (categoryId) {
        window.location.href = "category.html?cat_id=" + categoryId;
    }
}





let products = [];

// Fetch products from API
fetch(API_URL + "?type=searchProducts")
  .then(res => res.json())  
  .then(data => {
    products = data; 
    
    });
    

const searchInput = document.getElementById("search-input");
const searchPopup = document.getElementById("search-popup");
const resultsList = document.getElementById("search-results-list");

// Show popup on input focus
searchInput.addEventListener("focus", () => {
  searchPopup.style.display = "block";
  updateResults("");
});

// Hide popup when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    searchPopup.style.display = "none";
  }
});

// Update results on input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  updateResults(query);
});

function updateResults(query) {
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) // case-insensitive
  );

  resultsList.innerHTML = "";

  if (filtered.length === 0) {
    resultsList.innerHTML = "<li>No products found</li>";
    return;
  }

  filtered.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${image_url}/product/main/${product.image}" alt="${product.name}" 
           style="width:40px; height:40px; object-fit:cover; vertical-align:middle; margin-right:8px;">
      <span>${product.name} - ₹${Math.round(product.price).toLocaleString("en-IN")}</span>
    `;

    // On click → redirect to product details page
    li.addEventListener("click", () => {
       saveProductName(product.name);
      window.location.href = `singlep.html?pid=${product.id}`;
    });

    resultsList.appendChild(li);
  });
}

$(document).ready(function () {
  loadWishlistCount();
});


function gotoback(){
  window.history.back();
}









const productName = localStorage.getItem("selectedProductName");

if (productName) {
  document.getElementById("product-title").textContent = productName;
}


function saveProductName(name) {
  localStorage.setItem("selectedProductName", name);
}



