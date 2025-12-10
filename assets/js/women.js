const input = document.getElementById("animated-placeholder");
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


const btn = document.getElementById("toggleCategoriesBtn");
const categories = document.getElementById("fetchCategories");

function setCollapsedHeight() {
  const firstItem = categories.querySelector(".category-item");
  if (!firstItem) return;

  // include text height + margin
  const itemHeight = firstItem.offsetHeight;

  // add a little buffer for safety (e.g., 10px)
  const rowHeight = itemHeight + 45;

  // decide how many rows to show
  const rowsToShow = window.innerWidth < 600 ? 2 : 1;

  categories.style.maxHeight = rowHeight * rowsToShow + "px";
  categories.style.overflow = "hidden";
}

function expandAll() {
  categories.style.maxHeight = categories.scrollHeight + "px";
  categories.style.overflow = "visible";
}

btn.addEventListener("click", () => {
  if (categories.classList.contains("expanded")) {
    categories.classList.remove("expanded");
    btn.textContent = "Show More";
    setCollapsedHeight();
  } else {
    categories.classList.add("expanded");
    btn.textContent = "Show Less";
    expandAll();
  }
});

window.addEventListener("resize", () => {
  if (!categories.classList.contains("expanded")) {
    setCollapsedHeight();
  }
});

window.addEventListener("load", setCollapsedHeight);





document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tab")) {
    // Remove 'active' from all tabs
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));

    // Add 'active' to clicked one
    e.target.classList.add("active");
  }
});

$(document).ready(function () {
  $("#main_banner_carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    navText: ["<", ">"],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }, // always show 3 when screen is wide enough
    },
  });
});


let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scroll Down
    $(".page-scroll-up").removeClass("show");
    // $(".header").removeClass("fixed");
  } else {
    $(".page-scroll-up").addClass("show");
    // $(".header").addClass("fixed");
    // Scroll Up
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Safari
});

// view cart js

const fetchCategory = async () => {
  const fetchCategories = $("#fetchCategories");
  fetchCategories.html(" ");

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" },
    success: function (response) {
      if (response.status !== false && Array.isArray(response)) {
        let categoryItemHtml = "";

        //  console.log(response);

        // ✅ Limit to only first 20 categories
        const limitedCategories = response.slice(0, 20);

        limitedCategories.forEach((item) => {
          categoryItemHtml += `
            <a href="category.html?cat_id=${item.id}" class="category-item">
              <img src="${image_url + item.image_url}" alt="${item.name}" />
              <p>${item.name}</p>
            </a>
          `;
        });

        fetchCategories.html(categoryItemHtml);
      } else {
        fetchCategories.html("<p>No categories found</p>");
      }
    },
    error: function () {
      fetchCategories.html("<p>Failed to load categories</p>");
    }
  });
};



const topfetchCategory = async () => {
  const topfetchCategories = $("#topcateboxw");


  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory", },
    success: function (response) {
      // console.log("Raw Response:", response);




      if (response.status !== false && Array.isArray(response)) {
        let categoryItemHtml = "";

        // ✅ Limit to only first 20 categories
        const categories = response;

        const women = response.filter((item) => item.gender === "women");
        console.log(women)

        women.forEach((item) => {
          categoryItemHtml += `

            <a href="category.html?cat_id=${item.id}" class="cate_box">

         <img src="${image_url + item.image_url}" alt="${item.name}" />
<div class="image_overlay4"></div>

     
    <p>${item.name}</p>
  </a>
        
          `;
        });
        topfetchCategories.html(categoryItemHtml);
      } else {
        topfetchCategories.html("<p>No categories found</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading categories:", error);
      topfetchCategories.html("<p>Failed to load categories</p>");
    }
  });
};

// call function when page loads
$(document).ready(() => {
  topfetchCategory();
});



const flitercat = async () => {

  const topfetchCategories = $(".budget_section");

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" },
    success: function (response) {

      if (response.status !== false && Array.isArray(response)) {
        let categoryItemHtml = "";

        // ✅ Limit to only first 20 categories
        const categories = response;
        const women_categories = response.filter((item) => item.gender === "women")
        women_categories.forEach((item) => {
          categoryItemHtml += `

            <a href="category.html?cat_id=${item.id}" class="budget_box">
<img src=${image_url + item.image_url} alt="">
  <div class="image_overlay"></div>
  <p><span id="sp">Under</span> ₹499 <span id="sp">Dresses</span> </p>

          
            </a>
          `;
        });
        topfetchCategories.html(categoryItemHtml);
      } else {
        topfetchCategories.html("<p>No categories found</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading categories:", error);
      topfetchCategories.html("<p>Failed to load categories</p>");
    }
  });
};



flitercat();




const loadBanner = async () => {
  const mainBannerCarousel = $("#main_banner_carousel");
  const upperBanner = $(".mid-banner");
  const lowerBanner = $("#lower_banner_carousel");

  await $.ajax({
    url: API_URL,
    type: "POST",
    data: { type: "loadBanner" },
    success: function (response) {
      if (response.status !== false) {


        const women_banner = response.filter((item) => item.gender === "women");

        console.log("women all banner", women_banner);


        let mainData = women_banner.filter((item) => item.banner_type === "main");
        let upperData = women_banner.filter((item) => item.banner_type === "upper");
        let lowerData = women_banner.filter((item) => item.banner_type === "lower");

        $(".Collection_name").text(response.banner_type);

        console.log(mainData)
        let bannerData = "";
        let upperHtml = "";
        let lowerHtml = "";



        mainBannerCarousel.trigger("destroy.owl.carousel");
        mainBannerCarousel.html("");
        mainData.map((item) => {


          bannerData += `
                    <div class="item">
                        <div class="card">
                            <img src="${image_url + "banner/" + item.image_url
            }" alt="${item.banner_type}">
                        </div>
                    </div>
                    `;
        });
        mainBannerCarousel.html(bannerData);





        upperBanner.html("");
        upperData.map((item) => {

          upperHtml +=
            `
   
                            <img src="${image_url + "banner/" + item.image_url
            }" alt="${item.banner_type}">
                      <div class="image_overlay3"></div>

  <div class="mid_banner_info">
    <div class="info_text">
    <h3>${item.title}</h3>
    <h4>${item.description}</h4>
    <p>Of-the- moment pieces you can’t miss</p>
    </div>
    <div class="info_button">
    <button onclick="window.location.href='category.html'">shop now</button>
    </div>
  </div>
                    `;
        });
        upperBanner.html(upperHtml);

        lowerBanner.trigger("destroy.owl.carousel");
        lowerBanner.html("");
        lowerData.map((item) => {


          lowerHtml += `
                    <div class="item">
    <div class="card">
        <img src="${image_url + 'banner/' + item.image_url}" alt="${item.banner_type}">

        <div class="shape_label">
            <img src="../assets/images/shape label1.png" alt="">
            <h4>${item.title}</h4>
        </div>

        <div class="shape_label2">
            <img src="../assets/images/shape label 2.png" alt="">
            <h4>${item.description}</h4>
        </div>
    </div>
</div>

                    `;
        });
        lowerBanner.html(lowerHtml);
      }






      mainBannerCarousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1 },
          600: { items: 1.3 },
          1000: { items: 3 }, // always show 3 when screen is wide enough
        },
      });



      lowerBanner.owlCarousel({
        loop: true,
        margin: 2,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        navText: ["<", ">"],
        responsive: {
          0: { items: 1 },
          600: { items: 1 },
          1000: { items: 3 }, // always show 3 when screen is wide enough
        },
      });










    },
  });
};








document.addEventListener('click', function (event) {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-popup');

  if (event.target === input) {
    // If clicked on the input → show popup
    results.style.display = 'block';
    input.focus();
  } else {
    // If clicked anywhere else → hide popup
    results.style.display = 'none';
  }
});




async function GetSubCategory(subId) {
  let formdata = new FormData();
  formdata.append("type", "SubcaregoryList");
  formdata.append("subId", subId);

  // Assuming API_URL and scatei are defined globally or elsewhere
  let req = await fetch(API_URL, {
    method: "POST",
    body: formdata
  });

  let res = await req.json();




  let output = "";

  if (res.length > 0) {

    const subcate_women = res.filter((item) => item.gender === "women");

    subcate_women.forEach((item, index) => {

      const categoryCount = index + 1;

      output += `

<div class="faves_box" onclick="location.href='category.html?cat_id=${item.id}'">
            <img src="${scatei}${item.image_url}"   class="p_img"/ >
            <div class="image_overlays2"></div>
            <div class="faves_info">
                <h3>${item.name}</h3>
                <h2>MIN. 40% OFF</h2>
                <p>Bold &amp; Beautiful Finds</p>
                
            </div>
        </div>

    
      `;
    });
  } else {
    output = "<p>No Sub Category Found</p>";
  }

  document.querySelector(".faves").innerHTML = output;
}

GetSubCategory("all");



const fetchTodayBestDeal = () => {
  const todayBestDealProductContainer = $("#PrintSubCate");
  let userId = localStorage.getItem('userId')

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchTodayBestDeal", userId: userId },
    success: function (response) {
      if (!response || response.status === false || response.length === 0) {
        $("#PrintSubCate").hide();
          $('.trending_title h2').hide();
        return;
      }

      let productHtml = "";

      const trendwomen = response.filter((item)=> item.gender === "women");
 console.log("Discount Count:", trendwomen.length);
      trendwomen.forEach((item , index) => {
        const countdownId = `countdown-${item.id}`;

  const categoryCount = index + 1; 

        // ✅ HTML structure
        productHtml += `
           <div class="Category-box">
       <h1 id='count'>${categoryCount}</h1> 
            
            <a href="singlep.html?pid=${item.id}">
            <div class="images">
        <img src="${image_url + 'product/main/' + item.main_image}" alt="${item.banner_type}"" width="80" class="p_img">
        <div class="image_overlay"></div>
        <b class="cate_name">${item.name}</b> 
         <img src="../assets/images/Rectangle.png" class="label-img2">
       <p class="offer_label_text">MIN ${((item.mrp - item.selling_price) / item.mrp).toFixed(1) * 100}% OFF</p>
        </div>
    
        </a>
        </div>
        `;

        // ✅ Start countdown for each product
    
      });

      // ✅ Add final HTML
      todayBestDealProductContainer.html(productHtml);
    },
    error: function () {
      console.error("Error fetching best deals");
      $("#PrintSubCate").hide();
        $('.trending_title h2').hide();
    },
  });
};



async function GetMainCategory() {
  let formdata = new FormData();
  formdata.append("type", "MainaregoryList");

  let req = await fetch(API_URL, {
    method: "POST",
    body: formdata
  });

  let res = await req.json();
  return res;
}




function fetchRecentlyViewedProducts() {
  const viewed = JSON.parse(localStorage.getItem("recentlyViewedProduct")) || [];




  $("#recent-product").hide();
  $(".product-relative").hide();

  if (viewed.length === 0) {
    console.log("No recently viewed products");
    return;
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "getProductsByIds",
      ids: JSON.stringify(viewed)
    },

    beforeSend: function () {

      $("#recent-product").hide();
      $(".product-relative").hide();
    },

    success: function (response) {
      // console.log("Fetched Products:", response);
      if (!response.status) {
        console.error("Error:", response.message);
        $("#recent-product").hide();
        $(".product-relative").hide();
        return;
      }

      let html = "";
      let products = response.data;

      products.forEach((item) => {
        let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
        let isWishlist = item.is_wishlisted == 1 ? "active" : "";
        let iconLabel = item.is_wishlisted == 1 ? "Remove From Wishlist" : "Add To Wishlist";

        html += `

           <div class="product_card1" >
 <img src="${image_url + "/product/main/" + item.main_image}" alt="" onclick="location.href='singlep.html?pid=${item.id}'">
  <div class="product_info1">
    <h4>${item.description}</h4>
    <div class="price-con">
      <div class="price-box">
      <p class="selling-price">₹${parseInt(item.selling_price)}</p> 
<p class="mrp">₹${parseInt(item.mrp)}</p>

      <p class="discount">${((item.mrp - item.selling_price) / item.mrp).toFixed(1) * 100}% OFF</p>
    </div>
    <div class="wishlist-icons ${isWishlist}" onclick="addToWishlist(${item.id})">
    
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_814_338)">
<path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#979C9E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</g>
<defs>
<clipPath id="clip0_814_338">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
</defs>
</svg>

    </div>
    </div>
  </div>
</div>



         
        `;
      });

      $("#recent-product").html(html);


      $("#recent-product").show();
      $(".product-relative").show();
    },

    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
      $("#recent-product").hide();
    }
  });
}

fetchRecentlyViewedProducts();







// 1
const fetchprodaccordtotittle = () => {

  let userId = localStorage.getItem('userId');

  $.ajax({
    url: API_URL,
    type: "POST",
    data: { type: "fetchprodaccordtotittle1", userId: userId },
    dataType: "json",
    success: function (response) {
      console.log(response);

      if (response && response.length > 0) {

        const women_title1 = response.filter((item) => item.gender === "women");

        // Set the title dynamically
        $(".title-section h2").text(response[0].title_name);

        let html = "";

        women_title1.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

          // Declare variables
          let isWishlist = "";
          let iconLabel = "";

          if (item.is_wishlisted == 1) {
            isWishlist = "active";
            iconLabel = "Remove From Wishlist";
          } else {
            isWishlist = "";
            iconLabel = "Add To Wishlist";
          }

          html += `          
 <div class="product">
            <a class="product-img" href="singlep.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">

              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->

                <!-- Eye Icon with Label -->
              <div class="wishlist-icon ${isWishlist}" onclick="addToWishlist(${item.id})">

    
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_814_338)">
<path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</g>
<defs>
<clipPath id="clip0_814_338">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
</defs>
</svg>

  

             
            </div>
                </div>

           

 <button class="add-to-cart" onclick="addToCartProcess(${item.id
            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>
                    
                    `;


        });

        // Render products
        $("#fetchprodaccordtotittles").html(html);
      } else {
        $("#fetchprodaccordtotittles").html("<p>No products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#fetchprodaccordtotittles").html("<p>Something went wrong.</p>");
    },
  });
};


// 2
const Productfetchaccodtotiitles2 = () => {
  let userId = localStorage.getItem('userId');
  $.ajax({
    url: API_URL,
    type: "POST",
    data: { type: "fetchprodaccordtotittle2", userId: userId },
    dataType: "json",
    success: function (response) {

      if (response && response.length > 0) {

        // Set the title dynamically
        $(".section_tittle_2 h2").text(response[0].title_name);

        let html = "";

        const women_title2 = response.filter((item) => item.gender === "women");
        women_title2.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
          // Declare variables
          let isWishlist = "";
          let iconLabel = "";

          if (item.is_wishlisted == 1) {
            isWishlist = "active";
            iconLabel = "Remove From Wishlist";
          } else {
            isWishlist = "";
            iconLabel = "Add To Wishlist";
          }

          html += `          
          <div class="product">
            <a class="product-img" href="singlep.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">

              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->

                <!-- Eye Icon with Label -->
              <div class="wishlist-icon ${isWishlist}" onclick="addToWishlist(${item.id})">

    
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_814_338)">
<path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</g>
<defs>
<clipPath id="clip0_814_338">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
</defs>
</svg>

  

             
            </div>
                </div>

           

 <button class="add-to-cart" onclick="addToCartProcess(${item.id
            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>
                    `;


        });

        // Render products
        $("#Productfetchaccodtotiitles2").html(html);
      } else {
        $("#Productfetchaccodtotiitles2").html("<p>No products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      $("#Productfetchaccodtotiitles2").html("<p>Something went wrong.</p>");
    },
  });
};

// 3


const fetchnothreeprodsaccordtotittle = () => {
  let userId = localStorage.getItem('userId');

  $.ajax({
    url: API_URL,
    type: "POST",
    data: { type: "fetchprodaccordtotittle3", userId: userId },
    dataType: "json",
    success: function (response) {

      if (response && response.length > 0) {

        $(".section_tittle_3 h2").text(response[0].title_name);

        let html = "";
        const women_title3 = response.filter((item) => item.gender === "women");
        console.log("women titel3" + women_title3)
        women_title3.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

          // Declare variables
          let isWishlist = "";
          let iconLabel = "";

          if (item.is_wishlisted == 1) {
            isWishlist = "active";
            iconLabel = "Remove From Wishlist";
          } else {
            isWishlist = "";
            iconLabel = "Add To Wishlist";
          }

          html += `
        <div class="product">
            <a class="product-img" href="singlep.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">

              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->

                <!-- Eye Icon with Label -->
              <div class="wishlist-icon ${isWishlist}" onclick="addToWishlist(${item.id})">

    
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_814_338)">
<path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</g>
<defs>
<clipPath id="clip0_814_338">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
</defs>
</svg>

  

             
            </div>
                </div>

           

 <button class="add-to-cart" onclick="addToCartProcess(${item.id
            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>
                    
                    `;
        });

        $("#fetchnothreeprodsaccordtotittle").html(html);
      } else {
        $("#fetchnothreeprodsaccordtotittle").html("<p>No products found.</p>");
      }
    },
    error: function () {
      $("#fetchnothreeprodsaccordtotittle").html("<p>Something went wrong.</p>");
    },
  });
};

fetchprodaccordtotittle();
Productfetchaccodtotiitles2();
fetchnothreeprodsaccordtotittle();




let currentData = [];

const loadProductCart = async () => {
  // let userId = localStorage.getItem("userId");

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadProductCart"},
    success: function (response) {

      console.log(response)
      if (response.status !== false) {
        currentData = response;
        renderBestSellerProducts(response);

      }
    },
  });
};



const renderBestSellerProducts = (data) => {
  const bestSellerProducts = $("#bestSellerProducts");
  const bestSellerProduct = $("#bestSellerProduct");

  if (data.status !== false) {
    let productHtml = "";
let product2html = "";

    const womendata = data.filter((item) => item.gender === "women") ;


    womendata.forEach((item) => {


      productHtml += `
           <div class="products" onclick="window.location.href='singlep.html?pid=${item.id}'">
       <img src="${image_url + "/product/main/" + item.main_image}" alt="" >
        <p class='name_title'>${item.description}</p>
            <div class="image_overlays2"></div>
    </div>
          `;
});



womendata.reverse().forEach((item) => {
       let isWishlist = item.isWishlist ? "active" : ""; 
    product2html+= `
     <div class="product">
            <a class="product-img" href="singlep.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${image_url + "/product/main/" + item.main_image}" alt="">
            </a>
              <div class="product_info">

              <p>${item.name}</p>
           
              
              <div class="price-container">
              <div class="price">
              <span class="new-pricebpcs">₹${parseInt(item.selling_price)}/Pcs</span>
              </div>
              <span class="old-pricepcs">MRP ₹${parseInt(item.mrp)} | MOQ: ${item.stock}Pcs</span>
              <div class="discount-label">${Math.round(((item.mrp - item.selling_price) / item.mrp) * 100)}% Margin
  </div>
               <!-- Heart Icon with Label -->

                <!-- Eye Icon with Label -->
              <div class="wishlist-icon ${isWishlist}" onclick="addToWishlist(${item.id})">

    
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_814_338)">
<path d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</g>
<defs>
<clipPath id="clip0_814_338">
<rect width="24" height="24" fill="white"></rect>
</clipPath>
</defs>
</svg>

  

             
            </div>
                </div>

           

 <button class="add-to-cart" onclick="addToCartProcess(${item.id
            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>   

            </div>
                </div>
                    
                    `

                        });
    bestSellerProducts.html("");
    bestSellerProducts.html(productHtml);

      bestSellerProduct.html("");
    bestSellerProduct.html(product2html);
  }
};


