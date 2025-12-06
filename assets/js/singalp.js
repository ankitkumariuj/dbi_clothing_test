function initMainCarousel() {
  const $carousel = $("#main_banner_carousel");

  // Destroy if already initialized
  if ($carousel.hasClass("owl-loaded")) {
    $carousel.trigger("destroy.owl.carousel");
    $carousel.html($carousel.find('.owl-stage-outer').html()); // cleanup
  }

  // Re-Initialize
  $carousel.owlCarousel({
    items: 1,
    loop: true,
    autoplay: false,
    dots: true,
    nav: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  });
}





document.querySelectorAll('.size-item').forEach(item => {
  item.addEventListener('click', function () {

    document.querySelectorAll('.size-item').forEach(i => i.classList.remove('selected'));


    this.classList.add('selected');

    console.log('Selected Size:', this.getAttribute('data-size'));
  });
});





const urlParams = new URLSearchParams(window.location.search);
let pid = urlParams.get("pid");
const vid = urlParams.get("vid");

const fetchprodid = () => {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchprodid", vid: vid },
    success: function (res) {
      pid = res.product_id;
    }
  });
};




let cat_id;
let userId = localStorage.getItem("userId");

let highlights = [];

const loadSingalProduct = async () => {

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadSingalProduct", pid: pid, vid: vid, userId: userId },
    success: function (response) {
      console.log(response);

      if (response && response.status !== false) {
        loadHighlight(response);
        renderSinglaProduct(response);
         globalResponse = response;
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error, xhr.responseText);
    }
  });
};


const loadHighlight = (product) => {
  let prod_id = product?.data?.id;

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "foronlyhighlights", prod_id: prod_id },
    success: function (response) {
      if (response.status && response.data) {
        let product = response.data;


        let titles = product.title ? product.title.split(",") : [];
        let descriptions = product.title_descr ? product.title_descr.split(",") : [];

        if (titles.length && descriptions.length) {
          let highlightHtml = "";

          titles.forEach((t, i) => {
            let desc = descriptions[i] || "";
            highlightHtml += `
              <div style="margin-bottom: 9px;" class="highlight-item">
                <strong>${t}:</strong>&nbsp;&nbsp;${desc}
                </div>
               
            `;
          });

          $("#product-details-content").html(highlightHtml);
        } else {
          console.log("Highlights not available in product");
        }
      } else {
        console.log("Invalid API response");
      }
    }
  });
};

const renderSinglaProduct = (response) => {
    const productWrapper = $(".product-details");
    const data = response.data;

    if (!data) {
        console.error("No product data found");
        return;
    }

    let sliderHtml = "";

  
    // MAIN IMAGE
    if (data.main_image) {
        sliderHtml += `
            <div class="item">
                <div class="card">
                    <img src="${image_url + "product/main/" + data.main_image}" alt="Main Image">
                </div>
            </div>`;
    }

    // MULTIPLE IMAGES
    if (data.images && data.images.length > 0) {
        data.images.forEach(img => {
            sliderHtml += `
                <div class="item">
                    <div class="card">
                        <img src="${image_url + "product/multiple/" + img}" alt="Product Image">
                    </div>
                </div>`;
        });
    }

    $("#main_banner_carousel").html(sliderHtml);
    initMainCarousel(); 


    const variants = data.variants || [];
    let variantHTML = "";
    let variantsizeHTML = ""; 

    const uniqueColors = new Set();
    const uniqueSizes = new Set();
    const allVariants = [];

   
    if (data.color && data.size) {
        allVariants.push({
            id: data.id, 
            color: data.color,
            size: data.size,
            mrp: data.mrp,
            selling_price: data.selling_price,
            single_image: data.main_image, 
            isMainProduct: true 
        });
    }
    

    allVariants.push(...variants);
console.log(allVariants.length)

    if (allVariants.length === 0) {
       
        $(".color_container").css("display", "none");
        $(".selector-title").css("display", "none"); 
    } else {
        $("#variantContainer").css("display", "block");

        allVariants.forEach(v => {
        
            if (v.size) {
                uniqueSizes.add(v.size);
            }

           
            if (v.color && !uniqueColors.has(v.color)) {
                

                let imageSource = v.single_image;
                if (v.isMainProduct) {
                    imageSource = "product/main/" + v.single_image;
                } else {
                    imageSource = "variant/main/" + v.single_image;
                }

                variantHTML += `
                    <div class="color-item" data-color="${v.color}" id="variant-${v.id}"onclick="loadvariant(globalResponse, ${v.id})" >
                        <div class="color-box">
                            ${imageSource
                                ? `<img src="${image_url + imageSource}" alt="${v.color} Variant Image">`
                                : `<div style="background:${v.color}; width:30px; height:30px; border-radius:50%;"></div>`
                            }
                            <i class="fas fa-check check-icon" style="display: none;"></i>
                        </div>
                        <div class="color-name">${v.color}</div>
                    </div>`;
                uniqueColors.add(v.color); 
            }

        });


        uniqueSizes.forEach(size => {
            variantsizeHTML += `<div class="size-item">${size}</div>`;
        });

        $("#variantContainer").html(variantHTML);
        $("#sizeContainer").html(variantsizeHTML); 
    }


    if(response.pid == true){
        cat_id = data.category;
    }
    
    let isWishlist = data.is_wishlisted == 1 ? "active" : "";
    let star = "";
    for (let i = 1; i <= Math.round(data.average_rating || 0); i++) { 
        star += '<i class="star" style="font-style: normal; color: rgba(39, 39, 39, 1); font-size: 17px;" >★</i>';
    }
    
    let productInfoHtml = `
     <div class="icon_container">
            <div class="svg-box">
                <div id="svg" onclick="window.location.href='/pages/view-cart.html'">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.23999 5.11334V4.46667C5.23999 2.96667 6.50458 1.49334 8.07658 1.35334C9.949 1.18001 11.528 2.58667 11.528 4.34001V5.26001" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.4799 14.6667C13.2886 14.6667 13.7916 13.5933 13.9383 12.2867L14.4623 8.28667C14.651 6.66 14.1619 5.33334 11.1786 5.33334H5.58925C2.60594 5.33334 2.11687 6.66 2.30551 8.28667L2.82951 12.2867C2.97623 13.5933 3.47927 14.6667 6.28791 14.6667H10.4799Z" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.8262 8H10.8325" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.93485 8H5.94113" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<div class="mobile-footer-icon-badge mini-cart-badge" data-count="0" id="cartcount">0</div>

                </div>

                <div id="svg" class="wishlist_btn ${isWishlist}" onclick="addToWishlist(${data.id})">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.4861 2.56665C13.3747 2.56671 14.8708 4.02899 14.8708 5.79321C14.8708 7.95177 13.8257 9.68625 12.5037 10.9788C11.1765 12.2761 9.60564 13.0903 8.66187 13.3977L8.65796 13.3997C8.60686 13.4169 8.5068 13.4329 8.38354 13.4329C8.26044 13.4328 8.16116 13.4169 8.11011 13.3997L8.10522 13.3977C7.16133 13.0902 5.59051 12.2762 4.26343 10.9788C2.94139 9.68625 1.89722 7.95177 1.89722 5.79321C1.89728 4.02895 3.39329 2.56665 5.28198 2.56665C6.39734 2.56671 7.37695 3.08101 7.98901 3.86743C8.08368 3.98901 8.22946 4.05971 8.38354 4.05981C8.53761 4.05981 8.68334 3.9889 8.77808 3.86743C9.38988 3.08135 10.3772 2.56665 11.4861 2.56665Z" stroke="#FD3E75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </div>


                <div id="svg">
                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9861 6.43347C14.5013 6.64014 15.5283 7.87347 15.5283 10.5735V10.6601C15.5283 13.6401 14.2777 14.8335 11.1546 14.8335H6.60632C3.48328 14.8335 2.23267 13.6401 2.23267 10.6601V10.5735C2.23267 7.89347 3.24573 6.66014 5.71901 6.44014" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.88403 10.4998V2.91309" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.2245 4.4003L8.88399 2.16696L6.54346 4.4003" stroke="#272727" stroke-linecap="round" stroke-linejoin="round"/>
<path opacity="0.01" fill-rule="evenodd" clip-rule="evenodd" d="M0.500067 16.5L0.500067 0.5L17.2681 0.5L17.2681 16.5L0.500067 16.5Z" stroke="#272727"/>
</svg>

                </div>
            </div>
        </div>
        <div class="product-detail">
            <div class="product-title">${data.name}</div>
            <div class="seller-info">Sold by: ${data.description}</div>
            <div class="price-row">
                <div class="prices">
                    <span class="current-price">₹${data.selling_price}/Pcs</span>
                    <div class="div">
                        <span class="discount-badge">${Math.round(((data.mrp - data.selling_price) / data.mrp) * 100)}% Margin</span>
                        <span class="mrp">MRP ₹${data.mrp}</span>
                    </div>
                </div>
                <div class="qty-box">MOQ: ${data.stock} Pcs</div>
            </div>
            <div class="off-banner">
                <div class="offer-banner">
                    <svg width="350" height="67" viewBox="0 0 350 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M342.971 0C346.853 0 350 3.147 350 7.029V26.8C344.247 26.8 339.584 29.8 339.584 33.5C339.584 37.085 343.96 40.012 349.464 40.191L350 40.2V59.971C350 63.853 346.853 67 342.971 67H7.029C3.147 67 0 63.853 0 59.971V40.2C5.753 40.2 10.417 37.2 10.417 33.5C10.417 29.8 5.753 26.8 0 26.8V7.029C0 3.147 3.147 0 7.029 0H342.971Z" fill="#EFEFEF" stroke="#838383"/>
                    </svg>
                    <div class="banner">
                        <div class="offer-text">
                            <i class="fas fa-fire" style="color:#ff9800;"></i> Best offer for you 🔥<br>
                            <P>Minimum order value ₹5,000.0</P>
                        </div>
                        <button class="offer-button">Upto 65% Margin</button>
                    </div>
                </div>
            </div>
            <div class="selector-section">
                <div class="selector-title">
                    Available Colors 
                    <span style="font-weight:400; color:#777;">(Minimum ${allVariants.length} Colors required)</span>
                </div>
                <div id="variantContainer" class="color_container">
                    <div class="color-options">
                        ${variantHTML}
                    </div>
                </div>
            </div>
            <div class="selector-section">
                <div class="size-header">
                    <div class="selector-title">Available Size Sets</div>
                    <div class="size-chart-link">Size Chart <i class="fas fa-chevron-right"></i></div>
                </div>
                <div id="sizeContainer" class="size-options"> 
                    ${variantsizeHTML}
                </div>
            </div>

            <hr style="border:0; border-top: 1px solid #eee; margin: 15px 0;" />

            <div class="action-bar">
                <button class="wishlist_btn ${isWishlist}" onclick="addToWishlist(${data.id})">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.9995 24.4992C13.846 24.5 13.6938 24.4706 13.5516 24.4126C13.4095 24.3545 13.2802 24.269 13.1712 24.1608L4.10619 15.0842C2.96911 13.9352 2.3313 12.384 2.3313 10.7675C2.3313 9.151 2.96911 7.59979 4.10619 6.45083C5.25216 5.30809 6.80449 4.66638 8.42286 4.66638C10.0412 4.66638 11.5936 5.30809 12.7395 6.45083L13.9995 7.71083L15.2595 6.45083C16.4055 5.30809 17.9578 4.66638 19.5762 4.66638C21.1946 4.66638 22.7469 5.30809 23.8929 6.45083C25.0299 7.59979 25.6678 9.151 25.6678 10.7675C25.6678 12.384 25.0299 13.9352 23.8929 15.0842L14.8279 24.1608C14.7188 24.269 14.5896 24.3545 14.4474 24.4126C14.3053 24.4706 14.1531 24.5 13.9995 24.4992Z" fill="#A9A9A9"/>
                    </svg>
                </button>
                <button class="add-to-cart-btn" id="addToCartBtn"
                    data-product-id="${data.id}"
                    onclick="addToCartHandler(this)">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="addcart">Add to cart</span>
                </button>
            </div>

            <hr style="border:0; border-top: 1px solid transparent; margin: 15px 0;">
            <div class="collapsible" data-content-id="product-details-content">
                Product Details <i class="fas fa-chevron-down arrow"></i> 
            </div>
            <div class="collapsible-content" id="product-details-content" >
               <p></p>
            </div> 
            <div class="collapsible" data-content-id="services-policy-content"> Services & Policy <i class="fas fa-chevron-down arrow"></i> 
            </div> 
            <div class="collapsible-content" id="services-policy-content"> 
                <ul id="service-policy">
                    <li>Cash on Delivery available </li>
                    <li> 7 Day Return Policy </li>
                    <li> Free Shipping above ₹1000 </li>
                    <li>Contact Customer Service if you need any help.</li>
                </ul> 
            </div> 
            <div class="collapsible" data-content-id="customer-reviews-content"> Customer reviews <i class="fas fa-chevron-down arrow"></i>
            </div> 
            <div class="collapsible-content" id="customer-reviews-content">
                <div class="rating_count">
                    <div className="rating_outvalue">
                        <p><strong>${Number(data.average_rating || 0).toFixed(1)}</strong> out of 5</p>
                    </div>
                    <div class="rating_view">
                        ${star}
                        <p>${data.total_reviews} Ratings</p>
                    </div>
                </div>
                <div id="ratingBreakdown">
                    <div class="rate-row"><span>5 ★</span><div class="bars"><div class="fills f5"></div></div><span class="p5">0%</span></div>
                    <div class="rate-row"><span>4 ★</span><div class="bars"><div class="fills f4"></div></div><span class="p4">0%</span></div>
                    <div class="rate-row"><span>3 ★</span><div class="bars"><div class="fills f3"></div></div><span class="p3">0%</span></div>
                    <div class="rate-row"><span>2 ★</span><div class="bars"><div class="fills f2"></div></div><span class="p2">0%</span></div>
                    <div class="rate-row"><span>1 ★</span><div class="bars"><div class="fills f1"></div></div><span class="p1">0%</span></div>
                </div>

<div class="review_images">
<h5>Reviews</h5>
<div class="all_review_img">

</div>
</div>

                <div id="rate_wraper">
                    <p>No reviews yet.</p>
                </div>
            </div>
        </div>
    `;

    productWrapper.html(productInfoHtml);

 document.querySelectorAll('.color-item').forEach(item => {
  const color = item.getAttribute('data-color');
  if (color) {

    item.style.backgroundColor = color;
    console.warn('Invalid color in data-color:', color);
  }


  item.addEventListener('click', function () {

    document.querySelectorAll('.color-item').forEach(i => i.classList.remove('selected'));
    document.querySelectorAll('.check-icon').forEach(icon => icon.remove());
    this.classList.add('selected');
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fas', 'fa-check', 'check-icon');
    this.querySelector('.color-box').appendChild(checkIcon);
  });
}); 
    document.querySelectorAll(".collapsible").forEach(col => {
        col.addEventListener("click", function () {
            this.classList.toggle("active");
            const content = document.getElementById(this.dataset.contentId);

            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
}



function addToCartHandler(btn) {
  const productId = $(btn).attr("data-product-id");
  const variantId = $(btn).attr("data-variant-id") || null;
loadAddToCart();
  addToCartProcess(productId, variantId, btn);
  showConfetti();
  $('#addcart').text("Add to cart Done");

}






const addToWishlist = async (pid) => {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    warningAlert("please login first");
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "post",
    data: { type: "addToWishlist", userId: userId, pid: pid },
    success: function (response) {
      if (response.status == true) {
       loadWishlistCount();
        loadSingalProduct();
        loadCartCount();
        // window.location.reload();
      } else {
        alert(response.msg);
        
      }
    },
  });
};





const loadRelativeProduct = async () => {
  const productRelative = $(".similar-products-list");

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "loadProductsByCategory",
      pid: pid,
      cat_id: cat_id,
      userId: userId,
    },
    success: function (response) {

      console.log("relative product:", response);


      if (Array.isArray(response) && response.length > 0) {
        let productHtml = "";

        response.forEach((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
          let isWishlist = item.is_wishlisted == 1 ? "active" : "";

          productHtml += `
            <div class="product">
                <a class="product-img" href="singlep.html?pid=${item.id}">
                  <img src="${image_url}product/main/${item.main_image}" alt="">
                </a>
                <div class="product_info" style="padding-inline: 3%">
                    <p>${item.description}</p>
                    <div class="price-container">
                        <div class="price">
                            <span class="new-pricebpcs">₹${item.selling_price}/Pcs</span>
                        </div>
                        <span class="old-pricepcs">MRP ₹${item.mrp} | MOQ: ${item.stock}Pcs</span>
                        <div class="discount-label">${Math.round(discount)}% Margin</div>
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
                    
                </div>
            </div>
          `;
        });

        productRelative.html(productHtml);
      } else {
        productRelative.html("<p class='no-products'>No related products found.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
      productRelative.html("<p class='error'>Failed to load products.</p>");
    },
  });
};



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
      ids: JSON.stringify(viewed)
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
        // console.log(item.main_image)

        let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

        let isWishlist = item.is_wishlisted == 1 ? "active" : "";
        let iconLabel = item.is_wishlisted == 1 ? "Remove From Wishlist" : "Add To Wishlist";

        html += `
            <div class="product">
                <a class="product-img" href="singlep.html?pid=${item.id}">
                  <img src="${image_url}product/main/${item.main_image}" alt="">
                </a>
                <div class="product_info" style="padding-inline: 3%">
                    <p>${item.description}</p>
                    <div class="price-container">
                        <div class="price">
                            <span class="new-pricebpcs">₹${item.selling_price}/Pcs</span>
                        </div>
                        <span class="old-pricepcs">MRP ₹${item.mrp} | MOQ: ${item.stock}Pcs</span>
                        <div class="discount-label">${Math.round(discount)}% Margin</div>
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
                    
                </div>
            </div>`;

      });

      $(".similar-products-lists").html(html);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    }
  });
}

fetchRecentlyViewedProducts();




const fetchProductRating = async () => {
  let productAllRatings = $("#rate_wraper");

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchProductRating", pid: pid },
    success: function (response) {
      console.log(response);

       const imageArray = response.map(item => item.image);
    console.log(imageArray);
      const container = $(".all_review_img");

    imageArray.forEach(imgSrc => {
     const img = `<img src="${review_image}/images/reviews/${imgSrc}" alt="Review Image"/>`;
container.append(img);

    });

      if (response != false) {
        let ratingCount = 0;
        let stars = "";
        let reviewStarContainer = $(".item-review-star");
        let len = response.length;
        let reviewHtml = "";

        let count = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        response.map((item) => {
          count[item.rating]++;

          ratingCount = ratingCount + parseInt(item.rating);

          let star = "";
          for (i = 1; i <= item.rating; i++) {
            star += '<i class="star" style="font-style: normal; color: black">★</i>';
          }

          function timeAgo(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            const intervals = {
              year: 31536000,
              month: 2592000,
              week: 604800,
              day: 86400,
              hour: 3600,
              minute: 60,
              second: 1
            };

            for (const unit in intervals) {
              const value = Math.floor(seconds / intervals[unit]);
              if (value > 0) {
                return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
              }
            }

            return "just now";
          }

          reviewHtml += `
            <div class="rating-wrapper">
              <div class="rate_user_d">
                <h2 class="rating-title">${item.fullname}</h2>
                <div class="commit">${item.comment}</div>
                <p>${timeAgo(item.created_at)}</p>
              </div>
              <div class="rating-review-section">
                <div class="rating-left">
                  <div class="stars" id="star-container">
                    ${star} (${item.rating})
                  </div>
                  <img src=${review_image + "images/reviews/" + item.image} style="    height: 68px;
    width: 68px;
    object-fit: cover;
    object-position: top;
    border-radius: 4px;"/>
                </div>
              </div>
            </div>
          `;
        });

        // ========= SHOW PERCENTAGES =========
        for (let i = 1; i <= 5; i++) {
          let percent = (count[i] / len) * 100 || 0;

          $(`.f${i}`).css("width", `${percent}%`);
          $(`.p${i}`).text(`${percent.toFixed(0)}%`);
        }

        // ========= AVERAGE RATING =========
        let avg = (ratingCount / len).toFixed(1);

        for (i = 1; i <= Math.round(avg); i++) {
          stars += `★`;
        }

        reviewStarContainer.html(`
          ${stars} <span style="color: gray; font-size: 14px;">(${len} reviews)</span>
        `);

        productAllRatings.html(reviewHtml);
        $("#show-review").html(`Reviews (${len})`);
           $('.rating_count').show();  
        $('#ratingBreakdown').show();
      } else {
        productAllRatings.html("Not Any reviews");
        $('.rating_count').hide();  
        $('#ratingBreakdown').hide();
      }
    },
  });
};

fetchProductRating();





const loadvariant = (response, id) => {

  const product = response.data;
  const allVariants = product.variants || [];


  const variant = allVariants.find(v => v.id == id);

  console.log("Filtered Variant:", variant);


  if (!variant) {
    console.warn("Variant not found, loading product data only...");

    $(".mrp").text(`MRP ₹${product.mrp}`);
    $(".current-price").text(`₹${product.selling_price}/Pcs`);
    $('.discount-badge').text(`${Math.round(((product.mrp - product.selling_price ) / product.mrp) * 100)}% Margin`)

    let sliderHtml = "";


    if (product.main_image) {
      sliderHtml += `
      <div class="item">
        <div class="card">
          <img src="${image_url}product/main/${product.main_image}" alt="Main Image">
        </div>
      </div>`;
    }

    // Multiple product images
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        sliderHtml += `
        <div class="item">
          <div class="card">
            <img src="${image_url}product/multiple/${img}" alt="Product Image">
          </div>
        </div>`;
      });
    }

    $("#main_banner_carousel").html(sliderHtml);
    initMainCarousel();

    $("#sizeContainer").html(`<div class="size-item">${product.size}</div>`);

    return;
  }


  $(".mrp").text(`MRP ₹${variant.mrp}`);
  $(".current-price").text(`₹${variant.selling_price}/Pcs`);

  let sliderHtml = "";

  // Variant single image
  if (variant.single_image) {
    sliderHtml += `
      <div class="item">
        <div class="card">
          <img src="${image_url}variant/main/${variant.single_image}" alt="Main Image">
        </div>
      </div>`;
  }

  // Variant multiple images
  if (variant.images && variant.images.length > 0) {
    variant.images.forEach(img => {
      sliderHtml += `
        <div class="item">
          <div class="card">
            <img src="${image_url}variant/multiple/${img}" alt="Variant Image">
          </div>
        </div>`;
    });
  }

  $("#main_banner_carousel").html(sliderHtml);
  initMainCarousel();

let discount = 0;

// Variant available → use variant discount
if (variant && variant.mrp && variant.selling_price) {
    const vMrp = parseFloat(variant.mrp);
    const vSell = parseFloat(variant.selling_price);

    if (vMrp > 0) {
        discount = ((vMrp - vSell) / vMrp) * 100;
    }
}

// Variant NOT available → use product discount
else {
    const pMrp = parseFloat(data.mrp);
    const pSell = parseFloat(data.selling_price);

    if (pMrp > 0) {
        discount = ((pMrp - pSell) / pMrp) * 100;
    }
}

// Final rounded %
let finalDiscount = Math.round(discount);

// Update HTML
$(".discount-badge").html(`${finalDiscount}% Margin`);

  
  const size = variant.size || product.size || "N/A";

  const sizeHTML =
    size !== "disabled"
      ? `<div class="size-item">${size}</div>`
      : `<div class="sp-size-box disabled">N/A</div>`;

  $("#sizeContainer").html(sizeHTML);

  $("#addToCartBtn")
    .attr("data-product-id", product.id)
    .attr("data-variant-id", variant.id);
};






