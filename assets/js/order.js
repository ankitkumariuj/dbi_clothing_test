

const o_userId = localStorage.getItem("userId");
const login_status = localStorage.getItem('login_status');

if (login_status) {
  $("#filterBtn").show();
}
else{
    $("#filterBtn").hide();
}



const loadOrderDetails =  () => {
  const k_gpt_thank_you = $(".k_gpt_thank-you");
  const order_address = $("#order_address");
  const order_details = $("#order_details");


  let o_total = 0;
  let productData = '';

   $.ajax({
    url: API_URL,
    method: 'POST',
    data: { type: 'loadOrderDetails', userId: o_userId },
    success: function (response) {
        console.log(response);


      if (response.status && Array.isArray(response.data)) {
        response.data.forEach((item) => {
          //  use display_price for total
          const itemTotal = parseInt(item.quantity) * parseFloat(item.display_price || 0);
          o_total += itemTotal;

          // show size & color if variant exists
          let displayName = item.product_name;
          if (item.variant_id && item.variant_id !== "0") {
            let sizeTxt = item.size ? `, Size: ${item.size}` : "";
            let colorTxt = item.color ? `, Color: ${item.color}` : "";
            displayName = `${item.product_name} (${sizeTxt}${colorTxt})`;
          }

          
          let imagePath = image_url + "product/main/" + item.display_image;
          if (item.variant_id && item.variant_id !== "0") {
            imagePath = image_url + "variant/main/" + item.display_image;
          }

     
          productData += `
            <tr>
              <td>
                <img src="${imagePath}" 
                     style="width:50px; height:50px; object-fit:cover; margin-right:8px;" />
                ${displayName} × ${item.quantity}
              </td>
              <td>₹${itemTotal.toFixed(2)}</td>
            </tr>
          `;
        });

        order_details.html(`
          <tr><th>Product</th><th>Total</th></tr>
          ${productData}
          <tr><td class="k_gpt_bold">Subtotal:</td><td>₹${o_total.toFixed(2)}</td></tr>
          <tr><td class="k_gpt_bold">Shipping:</td><td>Free</td></tr>
          <tr><td class="k_gpt_bold">Payment method:</td><td>Cash on delivery</td></tr>
          <tr><td class="k_gpt_bold">Total:</td><td>₹${o_total.toFixed(2)}</td></tr>
        `);

        
        const firstOrder = response.data[0];
        k_gpt_thank_you.html(`
          <p style="color: green">Thank you. Your order has been received.</p>
          <p><strong>Order number:</strong> ${firstOrder.order_id}</p>
          <p><strong>Date:</strong> ${firstOrder.date || new Date().toLocaleDateString()}</p>
          <p><strong>Total:</strong> ₹${o_total.toFixed(2)}</p>
          <p><strong>Payment method:</strong> Cash on delivery</p>
        `);

       
        order_address.html(`
          <div class="k_gpt_section">
            <h2>Billing address</h2>
            <p>${firstOrder.company_name || ''}</p>
            <p>${firstOrder.fullname || ''}</p>
            <p>${firstOrder.email || ''}</p>
            <p>${firstOrder.address || ''}</p>
            <p>${firstOrder.city || ''} ${firstOrder.pincode || ''}</p>
            <p>${firstOrder.state || ''}</p>
            <p>+91${firstOrder.phone || ''}</p>
          </div>
        `);
      } else {
        order_details.html("<tr><td colspan='2'>No orders found</td></tr>");
      }
    }
  });
};






const orderHistoryContainer = document.querySelector(".orderHistoryContainer");
const orderinvoice = document.querySelector('.orderinvoice');


let allOrders = []; 


function fetchOrderHistory() {
  $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "fetchAllOrders", userId: o_userId },
    success: function (response) {
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
        items: [],
      };
    }
    groupedOrders[item.order_id].items.push(item);
  });

  let orderHistoryHtml = "";
  let orderinvoicehtml = "";

  Object.values(groupedOrders).forEach((order) => {
    let totalAmount = 0;
    let itemsHtml = "";

    // Generate all product items
    order.items.forEach((item) => {
      const itemTotal = item.selling_price * item.order_quantity;
      totalAmount += itemTotal;

      itemsHtml += `
        <div class="kb_cart-box kb_flex kb_items-start kb_gap-15 kb_cart-box51">
          <div class="kb_cart-img">
            <img src="${image_url}product/main/${item.main_image}" alt="${item.name}">
          </div>
          <div class="kb_cart-info">
            <div class="kb_cart-info-up kb_flex-col kb_items-start kb_gap-15">
              <h3>${item.name} (${item.brand}) x${item.order_quantity}</h3>
            </div>
            <div class="kb_cart-info-down kb_flex kb_flex-end kb_gap-15">
              <div class="kb_cart-price kb_flex_col kb_gap-15">
                <h3 class="kb_cartPrice51">₹${item.selling_price}</h3>
              </div>
              
            </div>
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
    orderHistoryHtml += `
      <div class="kb_history-box" onclick="window.location.href='/pages/order_detail.html?order_id=${order.order_id}'">
        <div class="kb_history-items kb_history-items51 ">
          <div class="kb_order_history_container kb_order_history_container51">

            <div class="kb_order_summary">
            <div class="product_toogle" style="display: flex;
    justify-content: space-between;">
              <p class="kb_delevery-status">Delivery Charges : Free</p>
          <i class="fa-solid fa-angle-right" onclick="window.location.href='/pages/order_detail.html?order_id=${order.order_id}'"></i>
              </div>
              <p class="kb_order_id">Order ID: ${order.order_id}</p>
              <p>Payment Type: ${order.payment_type}</p>

               <div class="status-box ${statusClass}">Order Status :
    ${order.order_status}
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
    `;

    orderinvoicehtml += `
      <div class="order-card">
        <div class="order-header">
          <h3>Order Id: #${order.order_id}</h3>
        </div>
        <div class="order-body">
          <p><strong>Date:</strong> ${new Date(order.order_date).toLocaleDateString("en-GB")}</p>
          <p style="font-size: 14px; font-weight: 900;">
            <strong>Total: </strong> ₹${totalAmount}
          </p>
        </div>
        <div class="order-footer">
          <button class="btn view-btn" onclick="printOrderBill(${order.order_id})">
            <i class="fa-solid fa-file-invoice"></i> View Invoice
          </button>
        </div>
      </div>
    `;
  });

  orderHistoryContainer.innerHTML = orderHistoryHtml;
  orderinvoice.innerHTML = orderinvoicehtml;
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






