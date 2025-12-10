const cartData = {};
const cartDrawer = document.getElementById('bd-cartDrawer');
const cartOverlay = document.getElementById('bd-cartOverlay');
const cartBody = document.getElementById('bd-cartBody');
const subtotalEl = document.getElementById('bd-subtotal');
const totalEl = document.getElementById('bd-total');
const cartFooter = document.getElementById('bd-cartFooter');
const body = document.querySelector("body");



function changeQty(id, delta) {
  cartData[id].qty += delta;
  if (cartData[id].qty <= 0) delete cartData[id];
  updateCartDrawer();
}

function removeFromCart(id) {
  delete cartData[id];
  updateCartDrawer();
}


$(document).on('click', '.increase', function () {
  const input = $(this).siblings('input[type="number"]');
  let currentValue = parseInt(input.val()) || 0;
  input.val(currentValue + 1);
});

$(document).on('click', '.decrease', function () {
  const input = $(this).siblings('input[type="number"]');
  let currentValue = parseInt(input.val()) || 1;
  if (currentValue > 1) {
    input.val(currentValue - 1);
  }
});




let Iduser = localStorage.getItem("userId");
let total = 0;











const loadAddToCart = async () => {
  const cartContainer = $(".cart_section");
  

  if (!Iduser) {
    cartContainer.html(`
      <div class="empty-cart-messages">
        <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
        <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
        <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
      </div>
      <p class="return-to-shop">
        <a class="button wc-backward" href="home.html">Return to shop</a>
      </p>
    `);
    $(".k-cart-footer").hide();
    return;
  }

  if (window.location.pathname.includes("checkout.html")) {
    return;
  }

  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadAddToCartItem", userId: Iduser },
    success: function (response) {
      

      let cartItems = Array.isArray(response) ? response : (response.data || []);

      if (cartItems.length > 0) {
        if ($(".k-cart-footer").is(":hidden")) {
          $(".k-cart-footer").show();
        }

        let cartHtml = "";
        let subTotal = 0;
        let total = 0;

       cartItems.map(item => {

    const isVariant = item.variant_id != null;

    const priceEach = isVariant
        ? parseInt(item.varselleing_price || item.selling_price)
        : parseInt(item.selling_price);

    const price = (parseInt(item.quantity) * priceEach).toFixed(2);
    subTotal += parseFloat(price);
  total += parseFloat(price);


    const image = isVariant && item.variant_image
        ? image_url + "variant/main/" + item.variant_image
        : image_url + "product/main/" + item.product_image;

    let title = item.product_name;
    if (isVariant) {
        title += ` (${item.variant_size || ""} )`;
    }

    
      // document.getElementById("t_price").textContent = "₹" + `${parseInt(total)}`;
      // console.log(total)

    cartHtml += `
        <div class="cart-container" id="cart-container${item.cart_id}">
            <div class="cart_product_title">
                <h4>${title} <span>X${item.quantity}</span></h4>
                <svg width="2" height="25" viewBox="0 0 2 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="24.02" x2="1" y2="0" stroke="#7E7979" stroke-width="2"/>
                </svg>
                <svg width="22" height="22" onclick="deleteCartItem(${item.cart_id}, ${priceEach})" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8.9375 1.375H13.0625C13.2448 1.375 13.4197 1.44743 13.5486 1.57636C13.6776 1.7053 13.75 1.88016 13.75 2.0625V3.4375H8.25V2.0625C8.25 1.88016 8.32243 1.7053 8.45136 1.57636C8.5803 1.44743 8.75516 1.375 8.9375 1.375ZM15.125 3.4375V2.0625C15.125 1.51549 14.9077 0.990886 14.5209 0.604092C14.1341 0.217298 13.6095 0 13.0625 0L8.9375 0C8.39049 0 7.86589 0.217298 7.47909 0.604092C7.0923 0.990886 6.875 1.51549 6.875 2.0625V3.4375H2.0625C1.88016 3.4375 1.7053 3.50993 1.57636 3.63886C1.44743 3.7678 1.375 3.94266 1.375 4.125C1.375 4.30734 1.44743 4.4822 1.57636 4.61114C1.7053 4.74007 1.88016 4.8125 2.0625 4.8125H2.80225L3.97513 19.47C4.03043 20.1591 4.34329 20.8022 4.85138 21.271C5.35947 21.7399 6.02552 22.0001 6.71688 22H15.2831C15.9745 22.0001 16.6405 21.7399 17.1486 21.271C17.6567 20.8022 17.9696 20.1591 18.0249 19.47L19.1978 4.8125H19.9375C20.1198 4.8125 20.2947 4.74007 20.4236 4.61114C20.5526 4.4822 20.625 4.30734 20.625 4.125C20.625 3.94266 20.5526 3.7678 20.4236 3.63886C20.2947 3.50993 20.1198 3.4375 19.9375 3.4375H15.125ZM17.8172 4.8125L16.654 19.36C16.6263 19.7046 16.4699 20.0261 16.2159 20.2605C15.9618 20.4949 15.6288 20.6251 15.2831 20.625H6.71688C6.3712 20.6251 6.03817 20.4949 5.78413 20.2605C5.53008 20.0261 5.37365 19.7046 5.346 19.36L4.18275 4.8125H17.8172ZM7.52263 6.1875C7.70458 6.17698 7.88327 6.23915 8.01941 6.36033C8.15555 6.48152 8.23799 6.6518 8.24863 6.83375L8.93613 18.5212C8.94335 18.7011 8.87977 18.8766 8.75905 19.01C8.63833 19.1435 8.47008 19.2243 8.29044 19.2351C8.11079 19.2459 7.93408 19.1858 7.79823 19.0678C7.66239 18.9497 7.57825 18.7831 7.56387 18.6038L6.875 6.91625C6.86942 6.82593 6.88172 6.7354 6.9112 6.64984C6.94069 6.56429 6.98677 6.4854 7.04681 6.41769C7.10685 6.34999 7.17967 6.2948 7.26108 6.2553C7.3425 6.2158 7.43091 6.19276 7.52125 6.1875H7.52263ZM14.4774 6.1875C14.5677 6.19276 14.6561 6.2158 14.7375 6.2553C14.819 6.2948 14.8918 6.34999 14.9518 6.41769C15.0119 6.4854 15.0579 6.56429 15.0874 6.64984C15.1169 6.7354 15.1292 6.82593 15.1236 6.91625L14.4361 18.6038C14.4325 18.6951 14.4106 18.7848 14.3718 18.8676C14.3331 18.9504 14.2782 19.0247 14.2104 19.086C14.1426 19.1474 14.0632 19.1946 13.9769 19.2248C13.8906 19.2551 13.7992 19.2679 13.7079 19.2624C13.6166 19.2569 13.5274 19.2333 13.4454 19.1929C13.3633 19.1525 13.2902 19.0961 13.2302 19.0271C13.1703 18.9581 13.1247 18.8778 13.0961 18.7909C13.0675 18.7041 13.0566 18.6124 13.0639 18.5212L13.7514 6.83375C13.762 6.6518 13.8445 6.48152 13.9806 6.36033C14.1167 6.23915 14.2954 6.17698 14.4774 6.1875ZM11 6.1875C11.1823 6.1875 11.3572 6.25993 11.4861 6.38886C11.6151 6.5178 11.6875 6.69266 11.6875 6.875V18.5625C11.6875 18.7448 11.6151 18.9197 11.4861 19.0486C11.3572 19.1776 11.1823 19.25 11 19.25C10.8177 19.25 10.6428 19.1776 10.5139 19.0486C10.3849 18.9197 10.3125 18.7448 10.3125 18.5625V6.875C10.3125 6.69266 10.3849 6.5178 10.5139 6.38886C10.6428 6.25993 10.8177 6.1875 11 6.1875Z" fill="#FF4B4B"/>

                </svg>
            </div>
            <div class="image_section">
                <div class="p_img_color">
                    <img src="${image}" alt="" onclick="location.href='singlep.html?pid=${item.product_id}'"/>
                    <div class="color-box" data-color="${isVariant ? item.variant_color : item.product_color}"></div>
                </div>
                <p>${isVariant ? item.variant_color : item.product_color || 'N/A'}</p>
            </div>

            
            <div class="cart_product_info">
                <h4>${item.quantity} Pcs per size set</h4>
                <div class="size_discount">
                
                    <p>${item.size.split(",").join(" / ")}</p>
                    
                    <div class="discount-label">${((parseFloat(item.mrp - item.selling_price)/ item.mrp) * 100).toFixed(0)}% Margin</div>
                </div>
  
<div class="cart-quantity-input-box">
                    <button class="decrease" onclick="cartDec(${item.cart_id} )">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                      <input type="number" class="quantity-input cartNop${item.cart_id}" value="${item.quantity}" readonly="">
                  <button class="increase" onclick="cartInc(${item.cart_id})">

                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                <div class="size_discount">
                   <h3>₹${price}/Pcs</h3>

                    <h3>₹${isVariant ? item.variant_mrp : item.mrp} <svg width="2" height="25" viewBox="0 0 2 25" fill="none">
                        <line x1="1" y1="24.02" x2="1" y2="0" stroke="#7E7979" stroke-width="2"/>
                    </svg> ${item.quantity}Pcs</h3>
                </div>
            </div>
        </div>
    `;
});


        cartContainer.html(cartHtml);


            $(".color-box").each(function () {
    let color = $(this).data("color");
    $(this).css("background-color", color);
});
        $(".k-cart-subtotal h4").html("₹" + subTotal.toFixed(2));
        $("#t_price").html("₹" + subTotal.toFixed(2));
        $(".k-cart-total-price h4").html("₹" + total.toFixed(2));
        loadCartCount();

      } else {
        cartContainer.html(`
          <div class="empty-cart-messages">
            <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
            <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
            <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
          </div>
          <p class="return-to-shop">
            <a class="button wc-backward" href="home.html">Return to shop</a>
          </p>
        `);
        $(".k-cart-footer").hide();
      }
    }
  });
};
loadAddToCart();





const loadCartCount = async () => {
  let userId = localStorage.getItem('userId');
  const cartContainer = $("#cart-container");

  if (userId) {
    await $.ajax({
      url: API_URL,
      type: 'POST',
      data: { type: 'loadCartCount', userId: userId },
      success: function (response) {
        if (response.status !== false) {
     
          let totalItems = response.total_items;

          if (totalItems == 0) {

            cartContainer.html(`
              <div class="empty-cart-messages">
                <div class="empty-cart-icon"><img src="../assets/images/empty-wishlist-img.png" alt="Cart empty"></div>
                <h2 class="empty-cart-heading">Your cart is currently empty.</h2>
                <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
              </div>
              <p class="return-to-shop">
                <a class="button wc-backward" href="home.html">Return to shop</a>
              </p>
            `);

            $(".place_order").hide();
            $(".check_btn").hide();
            
          } else {
            // When cart has items
            $(".bd-icon-badge").html(totalItems);
            $(".mini-cart-badge").html(totalItems);

            $(".place_order").show();
            $(".check_btn").show();
          }
        }
      },
      error: function () {
        console.error("Failed to load cart count");
      }
    });
  }
};

loadCartCount();




const cartInc = async (cart_id, selling_price) => {

  let nop = parseInt($(`.cartNop${cart_id}`).val());
  nop++;

  $.ajax({
    url: API_URL,
    type: 'POST',
    data: { type: 'cartInc', cart_id: cart_id, nop: nop },
    success: function (response) {
      if (response.status === true) {


        $(`.cartNop${cart_id}`).val(nop);


        $(`.cartPrice${cart_id}`).html(`₹${(selling_price * nop).toFixed(2)}`);


        loadAddToCart();  
      }
    }
  });
};


const cartDec = async (cart_id, selling_price) => {

  let nop = parseInt($(`.cartNop${cart_id}`).val());
  nop--;


  if(nop === 0){
     deleteCartItem(cart_id , selling_price);
     return;
  }


  $.ajax({
    url: API_URL,
    type: 'POST',
    data: { type: 'cartInc', cart_id: cart_id, nop: nop },
    success: function (response) {
      if (response.status === true) {


        $(`.cartNop${cart_id}`).val(nop);


        $(`.cartPrice${cart_id}`).html(`₹${(selling_price * nop).toFixed(2)}`);


        loadAddToCart();  
      }
    }
  });
};
const deleteCartItem = async (cart_id, selling_price) => {

  let nop = $(`.cartNop${cart_id}`).val() || 1;
  let cartPrice = selling_price * nop;

  // 🔥 Total ko localStorage se load karo (most important)
  let total = parseInt(localStorage.getItem("total_price")) || 0;

  await $.ajax({
    url: API_URL,
    type: 'POST',
    data: { type: 'cartDelete', cart_id },
    success: function (response) {
      if (response.status === true) {

       
        $(`#cart-container${cart_id}`).remove();


        let newTotal = total - cartPrice.toFixed(2);

        if (newTotal < 0) newTotal = 0;

        localStorage.setItem("total_price", newTotal);


        window.location.reload(true);
      }
    }
  });
};






