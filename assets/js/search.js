window.addEventListener("load", () => {
    if (document.activeElement === searchInput2) {
        searchPopup2.style.display = "block";
        updateResults(searchInput2.value);
    }
});



let products2 = [];

// Fetch products from API
fetch(API_URL + "?type=searchProducts")
  .then(res => res.json())
  .then(data => {
    products2 = data;
  });

const searchInput2 = document.getElementById("search-inputs");
const searchPopup2 = document.getElementById("search-popups");
const resultsList2 = document.getElementById("search-results-lists");
searchPopup2.style.display = "block";
searchPopup2.style.height= '100%';

searchInput2.addEventListener("input", () => {
  const query = searchInput2.value.trim().toLowerCase();
  updateResults(query) ;
});

function updateResults(query) {
  const filtered = products2.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  resultsList2.innerHTML = "";

  if (filtered.length === 0) {
    resultsList2.innerHTML = "<li></li>";
    return;
  }

  filtered.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${image_url}/product/main/${product.image}" alt="${product.name}"
           style="width:40px; height:40px; object-fit:cover; vertical-align:middle; margin-right:8px; border-radius: 8px; border: 1px solid;">
      <span>${product.name} - ₹${Math.round(product.price).toLocaleString("en-IN")}</span>
    `;

    li.addEventListener("click", () => {
      saveProductName(product.name);
      window.location.href = `singlep.html?pid=${product.id}`;
    });

    resultsList2.appendChild(li);
  });
}

// ✅ Function to save product name in localStorage
function saveProductName(name) {
  localStorage.setItem("selectedProductName", name);
  console.log("Saved product name:", name);
}

// Wishlist & Recently Viewed
$(document).ready(function () {
  loadWishlistCount();
});

function updateRecentlyViewed(currentProductId) {
  let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  viewed = viewed.filter((id) => id !== currentProductId);
  viewed.unshift(currentProductId);

  if (viewed.length > 12) viewed.pop();

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
}

function fetchRecentlyViewedProducts() {
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  if (viewed.length === 0) {
    console.log("No recently viewed products");
    return;
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "getProductsByIds",
      ids: JSON.stringify(viewed),
    },
    success: function (response) {
      console.log("Fetched Products:", response);
      if (!response.status) {
        console.error("Error:", response.message);
        return;
      }

      let html = "";
      let products = response.data;

      products.forEach((item) => {
        html += `
          <div class="image_con img" onclick="window.location.href='singlep.html?pid=${item.id}'">
            <img src="${image_url}/product/main/${item.main_image}" alt="${item.name}">
          </div>
        `;
      });

      $(".image_con").html(html);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    },
  });
}

fetchRecentlyViewedProducts();
const input = document.getElementById("search-inputs");
const placeholders = [
  "Search for products...",
  "Search for categories...",
  "Search for brands...",
  "Search for offers..."
];
let index = 0;
let charIndex = 0;
let currentText = "";
let typing = true;

function typeAnimation() {
  if (typing) {
    if (charIndex < placeholders[index].length) {
      currentText += placeholders[index].charAt(charIndex);
      input.setAttribute("placeholder", currentText);
      charIndex++;
      setTimeout(typeAnimation, 100);
    } else {
      typing = false;
      setTimeout(typeAnimation, 2000);
    }
  } else {
    if (charIndex > 0) {
      currentText = currentText.slice(0, -1);
      input.setAttribute("placeholder", currentText);
      charIndex--;
      setTimeout(typeAnimation, 50);
    } else {
      typing = true;
      index = (index + 1) % placeholders.length;
      setTimeout(typeAnimation, 500);
    }
  }
}

typeAnimation();



window.onload = function () {
  setTimeout(function () {
    $(".loader").hide();     
     
  }, 1000); 
};
