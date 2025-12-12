

const o_userId = localStorage.getItem("userId");
const username = localStorage.getItem('name');
const email = localStorage.getItem('email');
const phone = localStorage.getItem('phone');

const orderHistoryContainer = document.querySelector(".receipt-container");



let allOrders = []; 


const urlParams = new URLSearchParams(window.location.search);
const order_id = urlParams.get("order_id");
const pid = urlParams.get("id");


let userId = localStorage.getItem('userId');

console.log("order_id:", order_id);
console.log("pid:", pid);

function fetchOrderHistory() {

  $.ajax({
    url: API_URL,
    method: "POST",
    data: { 
      type: "combineordersreviews",
      user_id: userId, 
      order_id: order_id,
      product_id: pid   // add this
    },

    success: function (response) {
      console.log("API Response:", response);

      // console.log("item" , response.item_size[0]);

      if (response && response.length > 0) {
        // sirf iss order ka data aayega
        let filtered = response.filter(item => item.order_id == order_id);
        renderOrders(filtered);
    }
  }
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
        date: item.date,
        payment_type: item.payment_type,
        user_address : item.address,
        city: item.city,
        state: item.state,
        pincode: item.pincode,
        fullname: item.fullname,
        email_id: item.email,
        mobile: item.phone,
        id: item.id,
        comment: item.comment,
        rating: item.rating,
        size : item.item_size,
        quantityno: item.quantity,
        items: [],
      };
    }
    groupedOrders[item.order_id].items.push(item);
  });

  let orderHistoryHtml = "";

  Object.values(groupedOrders).forEach((order) => {
    let totalAmount = 0;
    let itemsHtml = "";

   let mergedItems = {};

order.items.forEach(item => {
  if (!mergedItems[item.product_id]) {
    mergedItems[item.product_id] = { ...item, total_qty: Number(item.quantity) };
  } else {
    mergedItems[item.product_id].total_qty += Number(item.quantity);
  }
});

Object.values(mergedItems).forEach(item => {
      const itemTotal = item.selling_price * item.quantity;
      console.log("item total price" + item.size)
      totalAmount += itemTotal;

      itemsHtml += `

        <div class="item-row">

          <div class="img_box">
           <span class="item-name">${item.name} (${item.brand}) x${item.quantity}</span>
        <h4>Item Size:  ${order.size}</h4>
        <h3>Item Quantity : ${order.quantityno}</h3>
            <img src="${image_url}product/main/${item.main_image}" alt="${item.name}" />
            </div>
             <div class="item-price">₹${itemTotal}</div>
    
            
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

  if (status !== "delivered") {
    btn.style.display = "none";
  $('#rated').css("display", "none");

    return;
  }


  if (order.comment && order.comment.trim() !== "") {
    btn.style.display = "none";
      $('#rated').css("display", "block");
  } else {
    btn.style.display = "block";
      $('#rated').css("display", "none");
  }

}, 100);



// rating();
const formattedDates = new Date(order.date).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});



    orderHistoryHtml += `
      <div class="receipt-header">
        <div class="order-number">Order Id: #${order.order_id}</div>
  <div class="status-box ${statusClass}">
    ${order.order_status}
  </div>    
    </div>
    
    <div class="receipt-details">
        <div class="detail-line">Order Date: ${formattedDates}</div>
        <div class="detail-line">
            <span class="detail-label">Delivered to</span>
            <span class="detail-value">${order.user_address} ${order.city}, ${order.state}, ${order.pincode}</span>
        </div>
         <div class="detail-line">
          <span class="detail-label"> Customer Details :</span>
          <h4>Name:  ${order.fullname}</h4>
            <h4>Phone No:  ${order.mobile}</h4>
            <h4>Email Id:  ${order.email_id}</h4>
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
          
                    <p id="rated">You rated this product ⭐ ${order.rating}/5</p>
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



const addRating = async (id) => {
    const userId = localStorage.getItem("userId");
    const rating = localStorage.getItem("product_rating");
    const comment = $(".star-modal-textarea-input").val()?.trim() || "";
    const fileInput = $('#fileInput')[0];
    const image = fileInput.files[0];







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
                window.location.reload();
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




