

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
$('#humburger').click(function(){
  location.href="../pages/profile.html"
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






function goToCategory(selectEl) {
    const categoryId = selectEl.value;
    if (categoryId) {
        window.location.href = "category.html?cat_id=" + categoryId;
    }
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









