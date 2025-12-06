let allProducts = [];


function changeLayout(columns, a) {
  const grid = document.getElementById("products");
  const item = document.querySelectorAll(".product");
  const itemDesc = document.querySelectorAll(".product-desc");
  if (columns === 1) {
    if (window.innerWidth < 500) {
      grid.style.gridTemplateColumns = "2fr";
    } else {
      grid.style.gridTemplateColumns = "1fr";
      item.forEach((p) => p.classList.add("list-style"));
      itemDesc.forEach((para) => para.classList.add("active"));
    }
  } else if (columns === 2) {
    if (item[0].classList.contains("list-style")) {
      item.forEach((p) => p.classList.remove("list-style"));
      itemDesc.forEach((para) => para.classList.remove("active"));
    }

    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  } else if (columns === 3) {
    if (item[0].classList.contains("list-style")) {
      item.forEach((p) => p.classList.remove("list-style"));
      itemDesc.forEach((para) => para.classList.remove("active"));
    }
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  } else if (columns === 4) {
    if (item[0].classList.contains("list-style")) {
      item.forEach((p) => p.classList.remove("list-style"));
      itemDesc.forEach((para) => para.classList.remove("active"));
    }
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (columns === 5) {
    if (item[0].classList.contains("list-style")) {
      item.forEach((p) => p.classList.remove("list-style"));
      itemDesc.forEach((para) => para.classList.remove("active"));
    }
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
  }

  const btn = document.querySelectorAll(".layout-buttons button");

  btn.forEach((b) => {
    b.classList.remove("active");
    a.classList.add("active");
  });
}





function toggleCategory() {
  const list = document.getElementById("category-list");
  const toggleBtn = document.getElementById("category-toggle");
  if (list.style.display === "none") {
    list.style.display = "block";
    toggleBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
  } else {
    list.style.display = "none";
    toggleBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
  }
}


async function GetSubCategory(subId) {
  formdata = new FormData();
  formdata.append("type", "SubcaregoryList");
  formdata.append("subId", subId);
  req = await fetch(API_URL, { method: "POST", body: formdata });
  res = await req.json();
  let PrintSubCate = "";

  if (res.length > 0) {
    res.map((item) => {
      console.log(item)
      PrintSubCate += ` 
      <a href="category.html?subCat_id=${item.id}&cate_id=${item.category_id}"><div class="Category-Box">
      <h6>${item.name}</h6>
      </div></a>`;
    });
  } else {
    PrintSubCate = "No Sub Category Found";
  }
  $("#PrintSubCate").html(PrintSubCate);
}
async function GetMainCategory() {
  formdata = new FormData();
  formdata.append("type", "MainaregoryList");
  req = await fetch(API_URL, { method: "POST", body: formdata });
  res = await req.json();
  return res;
}


// Universal toggle
document.addEventListener("click", function (e) {
  if (e.target.closest(".toggle-header")) {
    const header = e.target.closest(".toggle-header");
    const icon = header.querySelector(".toggle-icon");
    const content = header.nextElementSibling;

    if (!content.classList.contains("active")) {
      content.classList.add("active");
      icon.innerHTML = '<i class="fa-solid fa-minus"></i>';
    } else {
      icon.innerHTML = '<i class="fa-solid fa-plus"></i>';
      content.classList.remove("active");
    }
  }

  // Color selection (event delegation)
  if (e.target.closest(".color-circle")) {
    e.target.closest(".color-circle").classList.toggle("active");
  }

  // Size button toggle (event delegation)
  if (e.target.closest(".filter-button")) {
    e.target.closest(".filter-button").classList.toggle("active");
  }
});


$("#category-list , .color-circle , .filter-button").click(() =>{
   $(".sidebar").removeClass("active");
  $(".wrapper-overlay").removeClass("active");
  $("body").css("overflow", "auto");
});

$(".sidebar-filter-open").click(() => {
  $(".sidebar").addClass("active");
  $(".wrapper-overlay").addClass("active");
  $("body").css("overflow", "hidden");
});
$(".close-filter-sidebar , .wrapper-overlay").click(() => {
  $(".sidebar").removeClass("active");
  $(".wrapper-overlay").removeClass("active");
  $("body").css("overflow", "auto");
});

// loadproductsBYcategory

let productData = [];
let currentData = [];
const loadProductsByCategory = async (h_cat_id, sideurl = "") => {
  const urlParams = new URLSearchParams(window.location.search);
  let cat_id;
    // alert(sideurl);
  const subCat_id = urlParams.get("subCat_id");
  const urlcat_id = urlParams.get("cate_id");
    let userId = localStorage.getItem("userId");

  if (!subCat_id) {
    if (h_cat_id === undefined) {
      cat_id = urlParams.get("cat_id");
      if (cat_id == null) {
        cat_id = "all";
        GetSubCategory("all");
      } else {
        GetSubCategory(cat_id);
      }
    } else {
      cat_id = h_cat_id;
      GetSubCategory(cat_id);
      console.log("cat_id", h_cat_id);
    }
  } else {
    if (subCat_id != null) {
      cat_id = urlcat_id;
    }
    if (sideurl == "sideurl") {
      if (h_cat_id === undefined) {
        cat_id = urlParams.get("cat_id");
        if (cat_id == null) {
          cat_id = "all";
          GetSubCategory("all");
        } else {
          GetSubCategory(cat_id);
        }
      } else {
        cat_id = h_cat_id;
        GetSubCategory(cat_id);
        console.log("cat_id", h_cat_id);
      }
    }

    GetSubCategory(urlcat_id);
  }

  //   alert(subCat_id);
  const colorOptions = $("#color-options");
  const filter_size_option = $("#filter_size_option");
  //   alert(cat_id);
  await $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "loadProductsByCategory",
      cat_id: cat_id,
      subCat_id: subCat_id,
      userId: userId,
    },
    success: function (response) {
          allProducts = response;  
         renderProduct(allProducts);
        
      if (response.status !== false) {
        productData = response;
        currentData = response;

        renderProduct(productData);

        let SizeFilterHtml = "";
        let isSizeDisabled = false;

        response.map((item) => {
          if (item.size == null || item.size == "") {
            isSizeDisabled = true;
          }
        });

        const allSizes = ["XL", "L", "M", "S", "XS", "XXL"];
        if(urlParams.get("cat_id") == null){
            
        }else{
        const cat_id = response[0].category;
        }

        allSizes.map((val) => {
          SizeFilterHtml += `
                    <button class="filter-button" onclick="fetchVariantProductByAction('size','${val}' , ${cat_id})">${val}</button>
                    `;
        });

        if (isSizeDisabled) {
          filter_size_option.hide();
          console.log("no size found");
        } else {
          // colorOptions.html(colorFilterHtml);
          filter_size_option.show();
          filter_size_option.html(`
                        <h3 class="toggle-header">
                            Sizes <span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>
                        </h3>
                        <div class="filter-options active">
                        ${SizeFilterHtml}
                        </div>
                    `);
        }
      } else {
        renderProduct({ status: false });
        filter_size_option.hide();
      }
    },
  });

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchColorsByCategory", cat_id: cat_id },
    success: function (response) {
      if (response.status !== false) {
        let colorFilterHtml = "";

        response.map((item) => {
          const colors = item.colors.split(","); // array ban gaya
          console.log(colors);
          colors.forEach((color) => {
            colorFilterHtml += `
                            <span onclick="fetchVariantProductByAction('color','${color.trim()}' , '${
              item.category_id
            }')" class="color-circle" style="background-color:${color.trim()};"></span>
                        `;
          });
        });



        colorOptions.show();
        colorOptions.html(`
                    <h3 class="toggle-header">
                        Colors <span class="toggle-icon"><i class="fa-solid fa-minus"></i></span>
                    </h3>
                    <div class="filter-options active">
                      ${colorFilterHtml}
                    </div>
                        
                `);
      } else {
        colorOptions.hide();
      }
    },
  });
};




// addRating

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

const fetchCategoryForFilter = async () => {
  const fetchCategories = $("#fetchCategories");
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchCategory" },
    success: function (response) {
        
      if (response.status !== false) {
        let categoryItemHtml = "";

        response.map((item) => {
          categoryItemHtml += `

            <a href="category.html?cat_id=${item.id}" class="category-item">
                <img src="${image_url + item.image_url}" alt="Shirts" />
                <p>${item.name}</p>
            </a>

          `;
        });

        fetchCategories.html(categoryItemHtml);
      }
    },
  });
};












const renderProduct = (data) => {
  const productContainer = $("#products");
  const total_product_count = $("#total_product_count");
  let productHtml = "";

  if (data.status !== false) {

    data.map((item, index) => {
      if (item.is_wishlisted == 1) {
        isWishlist = "active";
        iconLabel = "Remove From Wishlist";
      } else {
        isWishlist = "";
        iconLabel = "Add To Wishlist";
      }

      let discount = ((item.mrp - item.selling_price) / item.mrp).toFixed(2) * 100;

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

      // addProductRating(item.total_rating, item.rating_count, item.id)
    });

    productContainer.html(productHtml);
  } else if (data.status === false) {
    // productContainer.html(`<div class="empty-cart-messages">
    //                 <div class="empty-cart-icon"><img src="../assets/images/empty-data.webp" width="350" height="307" alt="Cart empty"></div>
    //             </div>`);

    productContainer.html("no data found");
  }

  total_product_count.html(data.length === undefined ? 0 : data.length);

};




// Your existing render function


// Sorting function
function applySorting(value) {
  let products = [...allProducts]; // copy so we don’t mutate original

  if (value === "high") {
    products.sort((a, b) => b.selling_price - a.selling_price);
  } else if (value === "low") {
    products.sort((a, b) => a.selling_price - b.selling_price);
  } else {
    products.sort((a, b) => a.id - b.id); // default by id
  }

  renderProduct(products);
}



const cat_filter = (type, action) => {
  if (type == "cat_name") {
    let data = currentData.filter((a) => a.id == action);
    renderProduct(data);
  }

  if (type == "size") {
    let data = currentData.filter((a) => a.size == action);
    renderProduct(data);
  }

  if (type == "under") {
    let data = currentData.filter((a) => a.selling_price < parseInt(action));
    renderProduct(data);
  }

  if (type == "500") {
    let data = currentData.filter(
      (a) => a.selling_price > 500 && a.selling_price < 1000
    );
    renderProduct(data);
  }

  if (type == "above") {
    let data = currentData.filter((a) => a.selling_price > 1000);
    renderProduct(data);
  }
  if (type == "all") {
    let data = currentData;
    renderProduct(data);
  }
  if (type == "color") {
    let data = currentData.filter((a) => a.color == action);
    renderProduct(data);
  }
};

const addProductRating = (total_rating, ratingCount, pid) => {
  if (total_rating != 0 && ratingCount != 0) {
    let ratingsStarCount = total_rating / ratingCount;
    ratingsStarCount = Math.round(ratingsStarCount); // round to nearest whole star

    let ratingStarHtml = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= ratingsStarCount) {
        ratingStarHtml += `<i class="fas fa-star" style="color: gold;"></i>`;
      } else {
        ratingStarHtml += `<i class="far fa-star" style="color: #ccc;"></i>`;
      }
    }

    // $(`#rating-pid-${pid}`).html(ratingStarHtml);
  }
};



const fetchVariantProductByAction = async (action, value, id) => {
  console.log(`'action' : ${action}`);
  console.log(`'value' : ${value}`);

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchVariantProductByAction",
      action: action,
      value: value,
      cat_id: id,
    },
    success: function (response) {
      let data = response;
      console.log(data);
      renderVarProduct(data);
    },
  });
};

const renderVarProduct = (data) => {
  const productContainer = $("#products");
  const total_product_count = $("#total_product_count");
  total_product_count.html(data.length);
  let productHtml = "";

  

  if (data.status !== false) {
    data.map((item, index) => {
          let discount = (((item.mrp - item.selling_price) / item.mrp) * 100).toFixed(2);


      
      productHtml += `


             <div class="product">
            <a class="product-img" href="singlep.html?pid=${item.id}" onclick="saveProductName('${item.name}')">
              <img src="${
                          image_url + "variant/main/" + item.single_image
                        }" alt="">
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

      // addProductRating(item.total_rating, item.rating_count, item.id)
    });

    productContainer.html(productHtml);
  } else if (data.status === false) {
    // productContainer.html(`<div class="empty-cart-messages">
    //                 <div class="empty-cart-icon"><img src="../assets/images/empty-data.webp" width="350" height="307" alt="Cart empty"></div>
    //             </div>`);

    productContainer.html("no data found");
  }
};








const addToWishlist = async (pid , vid) => {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    warningAlert("please login first");
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "post",
    data: { type: "addToWishlist", userId: userId, pid: pid, vid:vid },
    success: function (response) {
      if (response.status == true) {
        
        loadWishlistCount();
        loadProductsByCategory();
      } else {
        alert(response.msg);
      }
    },
  });
};

const SingalProduct = async () => {
  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "SingalProduct" },
    success: function (response) {
      // renderSingle(response);
    },
  });
};



 window.addEventListener("DOMContentLoaded", () => {
    const price = localStorage.getItem("total_price");

    if (price) {
      document.getElementById("t_price").textContent = `Checkout ₹${price}`;
    } else {
      document.getElementById("t_price").textContent = "Checkout";
      console.log("No price found in localStorage");
    }
  });



$("#product-all-ratings").hide();


function saveDiscount(discount){
  localStorage.setItem("Discount save" , discount)
  
}