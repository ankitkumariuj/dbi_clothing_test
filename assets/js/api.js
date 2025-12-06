



function addToWishlist(pid) {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    warningAlert("Please login first");
    return;
  }

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "addToWishlist",
      userId: userId,
      pid: pid
    },
    success: function (response) {
      if (response.status) {

        // ⭐ Toggle active icon instantly
        let icon = $(`.wishlist-icon[onclick="addToWishlist(${pid})"]`);
         let icons = $(`.wishlist-icons[onclick="addToWishlist(${pid})"]`);
        icon.toggleClass("active");
        icons.toggleClass("active");

        // OPTIONAL: Change tooltip/label text  
        let newLabel = icon.hasClass("active")
          ? "Remove From Wishlist"
          : "Add To Wishlist";

        icon.attr("title", newLabel);
        
window.location.reload();
      } else {
        warningAlert(response.message);
      }
    }
  });
}



// const addRating = async (pid) => {
    
//     let userId = localStorage.getItem("userId");
    
//   let rating = localStorage.getItem("product_rating");
//   let comment = $(".star-modal-textarea-input").val();

//   if (login_status != "true") {
//     warningAlert("Please login first");
//     openModal();
//     return;
//   }

//   if (rating == null) {
//     warningAlert("Please select at least one star");
//     return;
//   }

//   await $.ajax({
//     url: API_URL,
//     method: "POST",
//     data: {
//       type: "addRating",
//       userId: userId,
//       pid: pid,
//       rating: rating,
//       comment: comment,
//     },
//     success: function (response) {
//       if (response.status == true) {
//         console.log(response);
//         localStorage.removeItem("product_rating");
//         location.reload();
//       }
//     },
//   });
// };



function quickViewChangeImg(action) {
  if (action === undefined) {
    action = 2;
  }

  let activeImg = document.querySelectorAll(".h_product_view_imgs img");
  let activeIndex = -1;
  let imgAction;
  activeImg.forEach((img, i) => {
    if (img.classList.contains("active")) {
      activeIndex = i;
    }
  });
  console.log(activeIndex);
  if (activeIndex === -1) return;
  activeImg.forEach((img) => {
    img.classList.remove("active");
  });
  if (action == 1 && activeIndex > 0) {
    // prev
    activeImg[activeIndex - 1].classList.add("active");
  } else if (action == 2 && activeIndex < activeImg.length - 1) {
    // next
    activeImg[activeIndex + 1].classList.add("active");
  } else {
    activeImg[activeIndex].classList.add("active");
  }
}

// fetch category_priority

const fetchCategoryPriority = async () => {
  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategoryPriority" },
    success: function (response) {
      // console.log(response)
      if (response.status !== false) {
        let sub_name_data = [];

        response.forEach((item, index) => {
          // sub_name और sub_id को comma से अलग array में बदलते हैं
          const subNames = item.sub_name ? item.sub_name.split(",") : [];
          const subIds = item.sub_id ? item.sub_id.split(",") : [];

          sub_name_data.push({
            cat_id: item.cat_id,
            cat_name: item.cat_name,
            sub_id: subIds,
            sub_name: subNames,
          });
        });



        // 👉 अब इस data को UI में render कर सकते हो:
        renderPriorityCategories(sub_name_data);
      }
    },
  });
};

// ✨ Render करने का example function:
function renderPriorityCategories(data) {
  data.forEach((item, index) => {
    // Container ID is 1-based, index is 0-based
    const containerId = `#tab-container-${index + 1}`;

    // Subcategory HTML – reset for every category
    let subHtml = "";

    if (item.sub_id.length > 0 && item.sub_name.length > 0) {
      item.sub_id.forEach((id, subIndex) => {
        const subName = item.sub_name[subIndex];
        subHtml += `
          <div onclick="filterBySubcategory('${id}','${item.cat_id}','product${
          index + 1
        }')" class="tab">${subName}</div>
        `;
      });
    }

    // Inject HTML into respective container
    $(containerId).html(`
      <h2>${item.cat_name}</h2>
      <div class="tabs">
      <div onclick="topProductsByCategory('${item.cat_id}' , 'product${
      index + 1
    }')" class="tab active">Top 20</div>
      ${subHtml}
      </div>
    `);
    topProductsByCategory(item.cat_id, `product${index + 1}`);
  });
}

// 👉 Subcategory पर क्लिक होने पर filter call
function filterBySubcategory(subId, catId, showContainer) {
  console.log("Filtering with sub_id:", subId);

  let userId = localStorage.getItem("userId");
  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchProductBySubCat",
      subCat_id: subId,
      cat_id: catId,
      userId: userId,
    },
    success: function (response) {
      if (response.status != false) {
        let productHtml = "";

        response.map((item) => {
          let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;
  let isWishlist = item.is_wishlisted == 1 ? "active" : "";
          let iconLabel =
            item.is_wishlisted == 1
              ? "Remove From Wishlist"
              : "Add To Wishlist";

          productHtml += `
          
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
               
                </div>

            <div class="icon-container">
                <!-- Eye Icon with Label -->
                <div class="icon-with-label" ${isWishlist}" onclick="addToWishlist(${item.id})">
                    <span class="icon-label">${iconLabel}</span>
                <svg width="12" height="12" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.83411 9.91639C5.75734 9.91684 5.68124 9.90212 5.61017 9.87309C5.5391 9.84406 5.47445 9.80129 5.41995 9.74722L0.887447 5.20889C0.318907 4.63441 0 3.85881 0 3.05056C0 2.24231 0.318907 1.46671 0.887447 0.892225C1.46043 0.320856 2.2366 0 3.04578 0C3.85496 0 4.63113 0.320856 5.20411 0.892225L5.83411 1.52222L6.46411 0.892225C7.0371 0.320856 7.81326 0 8.62245 0C9.43163 0 10.2078 0.320856 10.7808 0.892225C11.3493 1.46671 11.6682 2.24231 11.6682 3.05056C11.6682 3.85881 11.3493 4.63441 10.7808 5.20889L6.24828 9.74722C6.19377 9.80129 6.12913 9.84406 6.05806 9.87309C5.98699 9.90212 5.91088 9.91684 5.83411 9.91639ZM3.04578 1.16639C2.79884 1.16527 2.55413 1.21316 2.32583 1.30729C2.09753 1.40141 1.89018 1.5399 1.71578 1.71472C1.36348 2.06888 1.16572 2.5481 1.16572 3.04764C1.16572 3.54718 1.36348 4.0264 1.71578 4.38056L5.83411 8.50472L9.95245 4.38056C10.3047 4.0264 10.5025 3.54718 10.5025 3.04764C10.5025 2.5481 10.3047 2.06888 9.95245 1.71472C9.59292 1.37505 9.11705 1.18581 8.62245 1.18581C8.12784 1.18581 7.65197 1.37505 7.29245 1.71472L6.24828 2.76472C6.19405 2.8194 6.12953 2.8628 6.05845 2.89241C5.98736 2.92203 5.91112 2.93727 5.83411 2.93727C5.75711 2.93727 5.68086 2.92203 5.60978 2.89241C5.53869 2.8628 5.47417 2.8194 5.41995 2.76472L4.37578 1.71472C4.20138 1.5399 3.99402 1.40141 3.76573 1.30729C3.53743 1.21316 3.29272 1.16527 3.04578 1.16639Z" fill="black"/>
</svg>

                </div>

             
            </div>

 <button class="add-to-cart" onclick="addToCartProcess(${
                              item.id
                            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>`;

        });

        $(`#${showContainer}`).html(productHtml);
      } else {
        $(`#${showContainer}`).html(emptyHtml);
      }
    },
  });
}

const topProductsByCategory = (cat_id, showContainer) => {


  let data = currentData.filter((a) => a.category == cat_id);
  let productHtml = "";



  if (data.length > 0) {
    data.map((item) => {
      let discount = ((item.mrp - item.selling_price) / item.mrp) * 100;

      if (item.is_wishlisted == 1) {
        isWishlist = "active";
        iconLabel = "Remove From Wishlist";
      } else {
        isWishlist = "";
        iconLabel = "Add To Wishlist";
      }

      productHtml += `
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

           

 <button class="add-to-cart" onclick="addToCartProcess(${
                              item.id
                            })"> <i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>         </div> </div>
                    `;

            
    });

    $(`#${showContainer}`).html(productHtml);
  } else {
    $(`#${showContainer}`).html(emptyHtml);
  }
};




const discountFtech = () => {
    $.ajax({
        url: API_URL,
        method: "POST",
        data: { type: "discount" },
        success: function(res){
            console.log("Response:", res);

            // If your API returns an array
            $(".discount_box").empty();
            $(".trend_container").empty();
let separatorcount = 0;
            res.forEach(item => {

                let cardHTML = "";
let trendHtml= "";
                if(item.type === "DISCOUNT"){
                    cardHTML = `
                   <div class="discount-card data-id="${item.id}">
        <span class="extra-label">EXTRA</span>
        <div class="off-amount">
            <span class="currency" >₹</span><span id="off_amount">${item.off_value}</span>
        </div>
        <div class="off-text">OFF</div>
        <div class="haul-amount" >ON HAUL OF ₹<span id="haul_amount">${item.haul_value}</span></div>
    </div>

   `;
      $(".discount_box").append(cardHTML);
    if(separatorcount < 2 ){
      $(".discount_box").append(` <div class="discount-separator"></div>`);
      separatorcount++;
    }
       
  }
  else if(item.type === "TREND"){
    trendHtml+= `
     <div class="trend_box" data-id="${item.id}">
    <h5>TRENDS</h5>
    <h3>UNDER</h3>
    <span> <p>₹  </p>  <h3 id="p_price">${item.trend_price}</h3></span>
 <div class="arrow-button-container">
     <a href="/pages/category.html" class="arrow-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="black"/>
</svg>

    </a>
</div>
  </div>`
  }

              $(".trend_container").append(trendHtml);

             
            });

            attachEditListeners();
        }
    });
};

discountFtech();




// helper function to render star ratings
function renderStars(rating) {
  let html = "";
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) html += `<i class="fas fa-star"></i>`;
  if (halfStar) html += `<i class="fas fa-star-half-alt"></i>`;
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++)
    html += `<i class="far fa-star"></i>`;

  return html;
}


















