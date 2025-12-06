const warningAlert = (msg) => {
  Swal.fire({
    title: false,
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


const o_userId = localStorage.getItem("userId");
const login_status = localStorage.getItem('login_status');
const username = localStorage.getItem('name');
const email = localStorage.getItem('email_id');
const phone = localStorage.getItem('phone');

const orderHistoryContainer = document.querySelector(".receipt-container");



let allOrders = []; 


const urlParams = new URLSearchParams(window.location.search);
const order_id = urlParams.get("order_id");

function fetchOrderHistory() {

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { 
      type: "fetchAllOrdersDetails",
      user_id: o_userId, 
      order_id: order_id,
      // id: id,
    },

    success: function (response) {
      console.log("API Response:", response);

      if (response && response.length > 0) {
        allOrders = response;
        renderOrders(allOrders);
      } else {
        orderHistoryContainer.innerHTML = `
          <div class="empty-cart-messages">
            <div class="empty-cart-icon">
              <img src="../assets/images/empty-wishlist-img.png" width="350" height="307" alt="Cart empty">
              <center><h2>Your cart is currently empty.</h2></center>
              <center><p>You may check out all the available products and buy some in the shop.</p></center>
            </div>
          </div>`;
      }
    },
  });
}

fetchOrderHistory();




function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    orderHistoryContainer.innerHTML = `<p>No orders found.</p>`;
    orderinvoice.innerHTML = "";
    return;
  }

  const groupedOrders = {};
  orders.forEach((item) => {
    if (!groupedOrders[item.order_id]) {
      groupedOrders[item.order_id] = {
        order_id: item.order_id,
        order_status: item.order_status,
        order_date: item.order_date,
        payment_type: item.payment_type,
        user_address : item.address,
        city: item.city,
        state: item.state,
        pincode: item.pincode,
        id: item.id,
        items: [],
      };
    }
    groupedOrders[item.order_id].items.push(item);
  });

  let orderHistoryHtml = "";

  Object.values(groupedOrders).forEach((order) => {
    let totalAmount = 0;
    let itemsHtml = "";

    // Generate all product items
    order.items.forEach((item) => {
      const itemTotal = item.selling_price * item.order_quantity;
      totalAmount += itemTotal;

      itemsHtml += `

        <div class="item-row">

          <div class="img_box">
           <span class="item-name">${item.name} (${item.brand}) x${item.order_quantity}</span>
            <img src="${image_url}product/main/${item.main_image}" alt="${item.name}" />
            </div>
             <div class="item-price">₹${item.selling_price}</div>
    
            
           </div>
        </div>
      `;
    });
let status = order.order_status.toLowerCase();

let statusClass = "";

if (status === "delivered") statusClass = "status-delivered";
else if (status === "pending") statusClass = "status-pending";
else if (status === "cancelled") statusClass = "status-cancelled";
else if (status === "processing") statusClass = "status-processing";
else if (status === "onway" || status === "on the way") statusClass = "status-onway"; 
else if (status === "shipped") statusClass = "status-shipped";
else statusClass = "status-pending"; 

setTimeout(() => {
  const btn = document.getElementById(`rate_btn_${order.id}`);

  if (status === "delivered") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}, 100);

function rating(status) {
  const btn = $(`#rate_btn_${order.id}`);

  if (status === "delivered") {
    btn.show();
  } else {
    btn.hide();
  }
}

rating();




    orderHistoryHtml += `
      <div class="receipt-header">
        <div class="order-number">Order Id: #${order.order_id}</div>
  <div class="status-box ${statusClass}">
    ${order.order_status}
  </div>    
    </div>
    
    <div class="receipt-details">
        <div class="detail-line">Order Date: ${new Date(order.order_date).toLocaleDateString("en-GB")}</div>
        <div class="detail-line">
            <span class="detail-label">Delivered to</span>
            <span class="detail-value">${order.user_address} ${order.city}, ${order.state}, ${order.pincode}</span>
        </div>
         <div class="detail-line">
          <span class="detail-label"> Customer Details :</span>
          <h4>Name:  ${username}</h4>
            <h4>Phone No:  ${phone}</h4>
            <h4>Email Id:  ${email}</h4>
         </div>

        <div class="detail-line payment-method">Payment Method</div>
        <div class="detail-line detail-value">${order.payment_type}</div>
    </div>
    
    <div class="item-list">
    <h6>Product:</h6>
        <div class="item-row">
           ${itemsHtml}
    </div>
    
    <div class="summary-list">
        <div class="summary-row">
            <div class="summary-label">Item Total</div>
            <div class="item-price">₹${totalAmount}</div>
        </div>
        
       
        
        <div class="summary-row total-paid">
            <div class="summary-label">Paid</div>
            <div class="item-price">₹${totalAmount}</div>
        </div>
    </div>
  
<div class="btn_grp">

  <button class="btn view-btn" onclick="printOrderBill(${order.order_id})">
            <i class="fa-solid fa-file-invoice"></i> View Invoice
          </button>
             

         <button class="btn view-btn" id="rate_btn_${order.id}" onclick="openRatingPopup(${order.id})">

           <i class="star" style="font-style: normal; ">★</i> Rate the Product
          </button>

            </div>
               </div>

          
          </div>
        </div>

        <div class="kb_order_view_details">
          <div class="kb_total_paid_box">
            <h3>Total Paid Amount</h3>
            <h4>₹${totalAmount}</h4>
          </div>
        </div>
      </div>

      <div class="rating_review_popup_container ">
      <div class="rating_review_popup_content">
        <div class="popup_title">
          <h2>Help us improve!</h2>
          <div class="close-share-modal-svg" onclick="closeRatingPopup()">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L17 17M1 17L17 1"
                stroke="#828282"
                stroke-width="1.5"
              ></path>
            </svg>
          </div>
        </div>
        <div class="star-modal-top-title">
          <h2>How many stars would you give to us?</h2>
        </div>
        <div class="star-modal-star-svg-container">
          <div class="star-modal-star-svg-content">
            <svg
              class="svg-star"
              data-index="1"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0.5L20.2321 10.6751L31.2169 11.5557L22.8476 18.7249L25.4046 29.4443L16 23.7L6.59544 29.4443L9.15239 18.7249L0.783095 11.5557L11.7679 10.6751L16 0.5Z"
              ></path>
            </svg>
          </div>
          <div class="star-modal-star-svg-content">
            <svg
              class="svg-star"
              data-index="2"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0.5L20.2321 10.6751L31.2169 11.5557L22.8476 18.7249L25.4046 29.4443L16 23.7L6.59544 29.4443L9.15239 18.7249L0.783095 11.5557L11.7679 10.6751L16 0.5Z"
              ></path>
            </svg>
          </div>
          <div class="star-modal-star-svg-content">
            <svg
              class="svg-star"
              data-index="3"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0.5L20.2321 10.6751L31.2169 11.5557L22.8476 18.7249L25.4046 29.4443L16 23.7L6.59544 29.4443L9.15239 18.7249L0.783095 11.5557L11.7679 10.6751L16 0.5Z"
              ></path>
            </svg>
          </div>
          <div class="star-modal-star-svg-content">
            <svg
              class="svg-star"
              data-index="4"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0.5L20.2321 10.6751L31.2169 11.5557L22.8476 18.7249L25.4046 29.4443L16 23.7L6.59544 29.4443L9.15239 18.7249L0.783095 11.5557L11.7679 10.6751L16 0.5Z"
              ></path>
            </svg>
          </div>
          <div class="star-modal-star-svg-content">
            <svg
              class="svg-star"
              data-index="5"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0.5L20.2321 10.6751L31.2169 11.5557L22.8476 18.7249L25.4046 29.4443L16 23.7L6.59544 29.4443L9.15239 18.7249L0.783095 11.5557L11.7679 10.6751L16 0.5Z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="star-modal-textarea-content">
          <textarea
            class="star-modal-textarea-input"
            placeholder="Add Comment"
          ></textarea>
        </div>


 <div class="upload-container">
    <div class="upload-box" id="uploadBox" onclick="document.getElementById('fileInput').click()">
        <p>Drag & Drop or <b>Click to Upload</b></p>
        <p class="file-type">Supported: JPG, PNG, GIF</p>
        <img id="preview" style="display:none; object-position: top; object-fit:cover;">
    </div>

    <input type="file" id="fileInput" name="image_1" accept="image/*" hidden onchange="previewImage(event)">
</div>




        <div class="give-star-submit">
          <button class="give-star-submit-btn" onclick="addRating(${order.id})">
            <h2>Submit Review</h2>
          </button>
        </div>
      </div>
    </div>
    `;



   });
$(document).ready(() => {
    const stars = document.querySelectorAll('.svg-star');
    let rating = localStorage.getItem("product_rating");


   

    if (stars) {
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const clickedIndex = index;
                stars.forEach((s, i) => {
                    if (i <= clickedIndex) {
                        s.classList.add('active');

                    } else {
                        s.classList.remove('active');
                    }
                });
                let product_rating = clickedIndex + 1;
                localStorage.setItem("product_rating" , product_rating);
            });
        });
    }
});
  orderHistoryContainer.innerHTML = orderHistoryHtml;
 
}







fetchOrderHistory();


function printOrderBill(order_id) {
  $(".bill-modal").addClass("active");
  $("body").css("overflow", "hidden");

  $.ajax({
    url: API_URL,
    type: "POST",
    data: { 
      type: "fetchAllOrders", 
      userId: o_userId, 
      orderId: order_id 
    },
    success: function (response) {
      console.log("Server response:", response);

      let data;
      try {
        data = typeof response === "object" ? response : JSON.parse(response);
      } catch (err) {
        $(".bill-items").html("<tr><td colspan='3'>Invalid server response</td></tr>");
        return;
      }

      if (data.status && Array.isArray(data.data)) {
        data = data.data;
      }

      // if (!Array.isArray(data) || data.length === 0) {
      //   $(".bill-items").html("<tr><td colspan='3'>No items found</td></tr>");
      //   return;
      // }

const orderItems = data.filter(item => item.order_id == order_id);

if (orderItems.length === 0) {
  console.log("No items found for this order. Response data:", data);
  $(".bill-items").html("<tr><td colspan='3'>No items found for this order</td></tr>");
  return;
}

console.log("Filtered order items:", orderItems);



      let html = "";
      let totalPrice = 0;
      let totalMrp = 0;
      let orderData = orderItems[0];

      orderItems.forEach((item) => {
        const q = item.nop || item.order_quantity || 1;
        const u = item.unit || "";
        const mrp = parseFloat(item.mrp || 0);
        const sell = parseFloat(item.selling_price || 0);
        const total = q * sell;
        totalPrice += total;
        totalMrp += q * mrp;

        html += `
          <tr>
            <td>${q} ${u}</td>
            <td>${item.name || "Unnamed"}<br>
            Unit Price: ₹${sell.toFixed(2)}<br>
            Discount: ₹${(totalMrp - sell).toFixed(2)}</td>
            <td class="bprice">₹${total.toFixed(2)}</td>
          </tr>`;
      });

      $(".bill-items").html(html);

      const format = (v) => `₹${parseFloat(v || 0).toFixed(2)}`;
      $(".billtotalItesPrice").html(format(totalMrp));
      $(".billtotalDiscount").html(format(totalMrp - totalPrice));
      $(".billsubTotal").html(format(totalPrice));
      $(".handlingCharge").html(format(orderData.handling_charge));
      $(".billdelCharege").html(format(orderData.del_charge));
      $(".billgrandTotal").html(format(totalPrice));
      $(".billOrderId").html(`#${orderData.order_id || ""}`);

      const d =  new Date(orderData.order_date);
      $(".billOrderDate").html(
        d.toLocaleString("en-US", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
        })
      );
    },
    error: function () {
      $(".bill-items").html("<tr><td colspan='3'>Error loading order details</td></tr>");
    },
  });
}


  
  function closeBillModel() {
    $(".bill-modal").removeClass("active");
    $("body").css("overflow", "auto");
  }


  window.printOrderBill = printOrderBill;
  window.closeBillModel = closeBillModel;








// const addRating = async (id) => {


//   const userId = localStorage.getItem("userId");
//   const rating = localStorage.getItem("product_rating");
//   const comment = $(".star-modal-textarea-input").val()?.trim() || "";
//   const image = $('#fileInput')[0].files[0];
//   console.log(image);
  


//   // Check login
//   if (login_status !== "true") {
//     warningAlert("Please login first");
//     openModal();
//     return;
//   }


//   if (!rating) {
//     warningAlert("Please select at least one star");
//     return;
//   }

 
//   if (comment.length === 0) {
//     warningAlert("Please enter text");
//     return;
//   }

//   try {
//     const response = await $.ajax({
//       url: API_URL,
//       method: "POST",
//       data: {
//         type: "addRating",
//         userId,
//         id,
//         rating,
//         comment,
//         image,
//       },
//     });

//     console.log("RAW Response:", response);

//     let res = response;
//     if (typeof res === "string") {
//       res = JSON.parse(res);
//     }

//     console.log("Parsed Response:", res);

//   if (res.status == true) {

//   successAlert("Rating Saved Successfully!");

//   setTimeout(() => {
//     $(".rating_review_popup_container").removeClass("active");
//     $(".wrapper-overlay").removeClass("active");
//     $("body").css("overflow", "auto");

//     $(".star-modal-textarea-input").val("");
//     localStorage.removeItem("product_rating");


//   }, 1500);

// } else {
//   warningAlert(res.message || "Something went wrong");
// }


//   } catch (error) {
//     console.error("Rating error:", error);
//     warningAlert("Unable to submit rating. Try again!");
//   }
// };


const addRating = async (id) => {
    const userId = localStorage.getItem("userId");
    const rating = localStorage.getItem("product_rating");
    const comment = $(".star-modal-textarea-input").val()?.trim() || "";
    const fileInput = $('#fileInput')[0];
    const image = fileInput.files[0];

    // Validation
    if (login_status !== "true") {
        warningAlert("Please login first");
        openModal();
        return;
    }
    if (!rating) {
        warningAlert("Please select at least one star");
        return;
    }
    if (comment.length === 0) {
        warningAlert("Please enter text");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("type", "addRating");
        formData.append("userId", userId);
        formData.append("id", id);
        formData.append("rating", rating);
        formData.append("comment", comment);
        if(image){
            formData.append("image_1", image); // important
        }

        const response = await $.ajax({
            url: API_URL,
            method: "POST",
            data: formData,
            processData: false, // do NOT convert to query string
            contentType: false, // let browser set content-type
        });

        console.log("RAW Response:", response);
        if(response.status){
            successAlert("Rating Saved Successfully!");
            setTimeout(() => { 
              $(".rating_review_popup_container").removeClass("active");
               $(".wrapper-overlay").removeClass("active");
                $("body").css("overflow", "auto"); 
                $(".star-modal-textarea-input").val(""); 
                localStorage.removeItem("product_rating"); }, 1500);
        } else {
            warningAlert(response.message || "Something went wrong");
        }
    } catch (error) {
        console.error("Rating error:", error);
        warningAlert("Unable to submit rating. Try again!");
    }
};



function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}



      