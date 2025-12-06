const fetchWishlist = async () => {
    let userId = localStorage.getItem("userId");
    const wishlistContainer = $("#wishlistContainer");

    // Case: user not logged in
    if (userId == null) {
        wishlistContainer.html(`
            <div class="empty-cart-messages">
                <div class="empty-cart-icon">
                    <img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Wishlist empty">
                </div>
            </div>
        `);
        return;
    }

    await $.ajax({
        url: API_URL,
        method: "POST",
        // 🚀 add a timestamp to prevent cache
        data: { type: "fetchWishlist", userId: userId, t: new Date().getTime()  },
        success: function (response) {
console.log(response)

            wishlistContainer.empty(); // 🚀 always clear before appending

            if (response && response.status !== false && response.length > 0) {
                response.sort((a, b) => b.wishlist_id - a.wishlist_id);

                let wishlistHtml = "";

                response.forEach(item => {
                    let productId = item.product_id || item.id;
                    let variantId = item.variant_id || 0;
                    let name = item.name;

                    let imageSrc = "";
                    let price = "";
                    let mrp = "";
                    let variantInfo = "";

                    if (variantId && item.variant_id != 0) {
                        imageSrc = item.single_image
                            ? image_url + "variant/main/" + item.single_image
                            : image_url + "product/main/" + item.main_image;

                        price = item.variant_price || item.selling_price;
                        mrp = item.variant_mrp || item.mrp;

                        if (item.color || item.size) {
                            variantInfo = `<p class="wishlist-variant">Variant: ${item.color || ""} ${item.size || ""}</p>`;
                        }
                    } else {
                        imageSrc = image_url + "product/main/" + item.main_image;
                        price = item.selling_price;
                        mrp = item.mrp;
                    }

                    wishlistHtml += `
   
             <div class="cart-container" id="cart-container" >
      <div class="cart_product_title">
    <h4>${item.name}</h4>
    <svg width="2" height="25" viewBox="0 0 2 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="1" y1="24.02" x2="1" y2="3.8147e-06" stroke="#7E7979" stroke-width="2"/>
</svg>
<svg width="22" height="22" onclick="removeWishlist(event, ${item.wishlist_id})" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.9375 1.375H13.0625C13.2448 1.375 13.4197 1.44743 13.5486 1.57636C13.6776 1.7053 13.75 1.88016 13.75 2.0625V3.4375H8.25V2.0625C8.25 1.88016 8.32243 1.7053 8.45136 1.57636C8.5803 1.44743 8.75516 1.375 8.9375 1.375ZM15.125 3.4375V2.0625C15.125 1.51549 14.9077 0.990886 14.5209 0.604092C14.1341 0.217298 13.6095 0 13.0625 0L8.9375 0C8.39049 0 7.86589 0.217298 7.47909 0.604092C7.0923 0.990886 6.875 1.51549 6.875 2.0625V3.4375H2.0625C1.88016 3.4375 1.7053 3.50993 1.57636 3.63886C1.44743 3.7678 1.375 3.94266 1.375 4.125C1.375 4.30734 1.44743 4.4822 1.57636 4.61114C1.7053 4.74007 1.88016 4.8125 2.0625 4.8125H2.80225L3.97513 19.47C4.03043 20.1591 4.34329 20.8022 4.85138 21.271C5.35947 21.7399 6.02552 22.0001 6.71688 22H15.2831C15.9745 22.0001 16.6405 21.7399 17.1486 21.271C17.6567 20.8022 17.9696 20.1591 18.0249 19.47L19.1978 4.8125H19.9375C20.1198 4.8125 20.2947 4.74007 20.4236 4.61114C20.5526 4.4822 20.625 4.30734 20.625 4.125C20.625 3.94266 20.5526 3.7678 20.4236 3.63886C20.2947 3.50993 20.1198 3.4375 19.9375 3.4375H15.125ZM17.8172 4.8125L16.654 19.36C16.6263 19.7046 16.4699 20.0261 16.2159 20.2605C15.9618 20.4949 15.6288 20.6251 15.2831 20.625H6.71688C6.3712 20.6251 6.03817 20.4949 5.78413 20.2605C5.53008 20.0261 5.37365 19.7046 5.346 19.36L4.18275 4.8125H17.8172ZM7.52263 6.1875C7.70458 6.17698 7.88327 6.23915 8.01941 6.36033C8.15555 6.48152 8.23799 6.6518 8.24863 6.83375L8.93613 18.5212C8.94335 18.7011 8.87977 18.8766 8.75905 19.01C8.63833 19.1435 8.47008 19.2243 8.29044 19.2351C8.11079 19.2459 7.93408 19.1858 7.79823 19.0678C7.66239 18.9497 7.57825 18.7831 7.56387 18.6038L6.875 6.91625C6.86942 6.82593 6.88172 6.7354 6.9112 6.64984C6.94069 6.56429 6.98677 6.4854 7.04681 6.41769C7.10685 6.34999 7.17967 6.2948 7.26108 6.2553C7.3425 6.2158 7.43091 6.19276 7.52125 6.1875H7.52263ZM14.4774 6.1875C14.5677 6.19276 14.6561 6.2158 14.7375 6.2553C14.819 6.2948 14.8918 6.34999 14.9518 6.41769C15.0119 6.4854 15.0579 6.56429 15.0874 6.64984C15.1169 6.7354 15.1292 6.82593 15.1236 6.91625L14.4361 18.6038C14.4325 18.6951 14.4106 18.7848 14.3718 18.8676C14.3331 18.9504 14.2782 19.0247 14.2104 19.086C14.1426 19.1474 14.0632 19.1946 13.9769 19.2248C13.8906 19.2551 13.7992 19.2679 13.7079 19.2624C13.6166 19.2569 13.5274 19.2333 13.4454 19.1929C13.3633 19.1525 13.2902 19.0961 13.2302 19.0271C13.1703 18.9581 13.1247 18.8778 13.0961 18.7909C13.0675 18.7041 13.0566 18.6124 13.0639 18.5212L13.7514 6.83375C13.762 6.6518 13.8445 6.48152 13.9806 6.36033C14.1167 6.23915 14.2954 6.17698 14.4774 6.1875ZM11 6.1875C11.1823 6.1875 11.3572 6.25993 11.4861 6.38886C11.6151 6.5178 11.6875 6.69266 11.6875 6.875V18.5625C11.6875 18.7448 11.6151 18.9197 11.4861 19.0486C11.3572 19.1776 11.1823 19.25 11 19.25C10.8177 19.25 10.6428 19.1776 10.5139 19.0486C10.3849 18.9197 10.3125 18.7448 10.3125 18.5625V6.875C10.3125 6.69266 10.3849 6.5178 10.5139 6.38886C10.6428 6.25993 10.8177 6.1875 11 6.1875Z" fill="#FF4B4B"/>
</svg>
</div>

<div class="image_section">
  <div class="p_img_color">
  <img src="${imageSrc}" alt="${name}" onclick="location.href='singlep.html?pid=${item.product_id}'">
  <div class="color-box" data-color='${item.product_color}'></div>
  </div>
  <p>Red</p>
</div>

<div class="cart_product_info">
 <h4>${item.product_size.length} Pcs per size set</h4>
  <div class="size_discount">
<p>${item.product_size.split("").join(" / ")}</p>

   <div class="discount-label">${(parseFloat(item.mrp - item.selling_price)/ item.mrp).toFixed(1) * 100}% Margin
  </div>
  </div>
    <div class="size_discount">
  <h3>₹${item.selling_price}/Pcs</h3>
  <h3>₹${item.mrp}</h3>
  </div>
</div>

    </div>
                     
                    `;
                });

               wishlistContainer.html( wishlistHtml);

                $(".color-box").each(function () {
    let color = $(this).data("color");
    $(this).css("background-color", color);
});
            } else {
               wishlistContainer.html(`
                    <div class="empty-cart-messages">
                        <div class="empty-cart-icon">
                            <img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Wishlist empty">
                             <h2 class="empty-cart-heading">Your wishlist is currently empty.</h2>
        <p class="empty-cart-text">You may check out all the available products and buy some in the shop.</p>
      </div>
     
                 
                    </div>
                `);
            }
        }
    });
};




function removeWishlist(event, wishlist_id) {
    event.preventDefault(); 

    $.ajax({
        url: API_URL,
        method: "POST",
        data: { type: "removeWishlist", wishlist_id: wishlist_id },
        success: function (response) {
            if (response.status === true) {
                fetchWishlist();     // refresh list immediately
                loadWishlistCount(); // refresh count
            }
        }
    });
}







