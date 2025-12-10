

const API_URL = "https://dbifashion.dbidemo.online/backend/dashboard/frontendapi/index.php";
const image_url =
  "https://dbifashion.dbidemo.online/backend/dashboard/backendapi/newapi/images/";
const scatei =
  "https://dbifashion.dbidemo.online/backend/dashboard/backendapi/newapi/images/subimages/";

  const review_image= "https://dbifashion.dbidemo.online/backend/dashboard/frontendapi/";


let login_status = localStorage.getItem("login_status");
function opencart(){
let login_status = localStorage.getItem("login_status");
  if(login_status !== "true"){
    warningAlert('Please Login First');
  }
  else{
    window.location.href="../pages/view-cart.html";
  }
}

function openwishlist(){
const login_status = localStorage.getItem("login_status");
  if(login_status !== "true"){
    warningAlert('Please Login First');
  }
  else{
    window.location.href="../pages/wishlist.html";
  }
}

function openModal() {
let login_status = localStorage.getItem("login_status");


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





$('#icon-btn').click(function(){
  location.href="../pages/search.html"
})



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
    localStorage.removeItem('email');
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


// Hide popup when clicking outside



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



const successAlert = (msg) => {
  Swal.fire({
    title: "",
    text: msg,
    icon: "success",
    showConfirmButton: false,
    customClass: {
      icon: "swal-custom-icon",
      htmlContainer: "swal-custom-text",
      container: "my-swal-success-container",
    },
    timer: 1500,
  });
};

const warningAlert = (msg) => {
  Swal.fire({
    title: "",
    text: msg,
    icon: "warning",
    showConfirmButton: false,
    customClass: {
      icon: "swal-custom-icon",
      htmlContainer: "swal-custom-text",
      container: "my-swal-warning-container",
    },
    timer: 1000,
  });
};








