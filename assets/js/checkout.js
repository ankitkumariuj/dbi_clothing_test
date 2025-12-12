

let total_amount = 0;



const loadOrderSummary = async () => {
    const orderProductWrapper = $("#order-product-wrapper");
    let userId = localStorage.getItem("userId");
    let placeOrderSubmitBtn = $("#place-order-submit-btn");

    await $.ajax({
        url: API_URL,
        method: 'POST',
        data: { type: "loadAddToCartItem", userId: userId },
        success: function (response) {
            if (response.status !== false) {
                let orderProductWrapperHtml = '';
                let subTotal = 0;
                let total_amount = 0;
                let cartIdStr = '';

                response.map(item => {
                    let price, displayImage, displayName;

                    // ✅ If Variant exists, use variant details
                    if (item.variant_id && item.variant_id !== "0") {
                        price = (parseInt(item.quantity) * parseFloat(item.varselleing_price)).toFixed(2);
                        displayImage = image_url + 'variant/main/' + item.variant_image;
                        displayName = `${item.product_name} (variant:- Size: ${item.variant_size}, Color: ${item.variant_color})`;
                    } else {
                        // ✅ Otherwise fallback to product details
                        price = (parseInt(item.quantity) * parseFloat(item.selling_price)).toFixed(2);
                        displayImage = image_url + 'product/main/' + item.product_image;
                        displayName = item.product_name;
                        
                    }

                    subTotal += parseFloat(price);
                    total_amount += parseFloat(price);

                    // Save main price (last one)
                    localStorage.setItem("main_price", price);

                    orderProductWrapperHtml += `
                        <div class="order-product-wrapper">
                            <div class="order-img-box">
                                <img src="${displayImage}" alt="">
                            </div>
                            <div class="order-product-name">
                                <h3>
                                    ${displayName} <span> x${item.quantity}</span>
                                </h3>
                            </div>
                            <div class="order-product-price">
                                <h3>₹${price}</h3>
                            </div>
                        </div>
                        
                    `;

                    cartIdStr += `${item.cart_id} `;
                });

              

                $(orderProductWrapper).html(orderProductWrapperHtml);
                $(".k-cart-total-price h2").html('₹' + total_amount.toFixed(2));
                $(".k-cart-subtotal h4").html('₹' + total_amount.toFixed(2));

                $(placeOrderSubmitBtn).html(`
                    <button class="k_flex" onclick="placeOrder()">Place Order</button>
                `);

                localStorage.setItem("total_price", total_amount.toFixed(2));
             
            }
        }
    });
};


loadOrderSummary();


const checkUserId = localStorage.getItem("userId");

// automatic fill the forms from database


// Global control flag
let activeFunction = null;

// ✅ fillform (first-time)
const fillform = () => {
  if (activeFunction === "directplaceorder") {
    console.warn("⚠️ fillform is disabled because directplaceorder is active.");
    return;
  }

  activeFunction = "fillform"; // mark as active

  let userId = localStorage.getItem("userId");

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchdelivertoaddress",
      userId: userId
    },
    success: function (res) {
      if (Array.isArray(res) && res.length > 0) {
        let data = res[0];

        if (data.fullname) {
          let fullname = data.fullname.split(" ");
          $("#first-name").val(fullname[0] || "");
          $("#last-name").val(fullname[1] || "");
        }

        $("#phone-no").val(data.phone || "");
        $("#email-address").val(data.email || "");
        $("#street-address-1a").val(data.address || "");
      }
    },
    error: function (err) {
      console.error("AJAX Error:", err);
    },
    complete: function () {
      activeFunction = null; // release control
    }
  });
};


// ✅ directplaceorder (second-time)
const directplaceorder = async (data) => {
  if (activeFunction === "fillform") {
    console.warn("⚠️ fillform is running — switching to directplaceorder now.");
    activeFunction = "directplaceorder";
  }

  try {
    console.log("📝 Received data:", data);

    if (!data || typeof data !== "object") {
      console.error("❌ Invalid data format.");
      return;
    }

    // ✅ Split fullname
    let firstName = "";
    let lastName = "";
    if (data.fullname) {
      const parts = data.fullname.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }

    // ✅ Combine address + landmark in one line
    const fullAddress = `${data.address || ""}${data.landmark ? ", " + data.landmark : ""}`.trim();

    // ✅ Fill form fields
    $("#first-name").val(firstName);
    $("#last-name").val(lastName);
    $("#street-address-1a").val(fullAddress || ""); // one line only
    $("#street-address-1b").val(""); // keep blank since we merged
    $("#town-city").val(data.city || "");
    $("#select-state").val(data.state || "");
    $("#pin-Code").val(data.pincode || "");
    $("#phone-no").val(data.phone || "");
    $("#email-address").val(data.email || "");

    console.log("✅ directplaceorder completed successfully.");
  } catch (err) {
    console.error("❌ Error in directplaceorder:", err);
  } finally {
    activeFunction = null; // release
  }
};





const delivertoaddress = () => {
  let userId = localStorage.getItem("userId");

  $.ajax({
    url: API_URL,
    method: "POST",
    data: {
      type: "fetchdelivertoaddress",
      userId: userId,
    },
    success: function (res) {
       console.log(res);
       if (res) {
  const formattedData = {
    fullname: res.full_name || "",
    address: res.address_line || "",
    landmark:res.landmark || "",
    city: res.city || "",
    state: res.state || "",
    pincode: res.pincode || "",
    phone: res.phone_no || "",
    email: res.email || ""  
  };

  directplaceorder(formattedData);
}

      
        
      // Parse JSON if backend returns a string
      if (typeof res === "string") {
        try {
          res = JSON.parse(res);
        } catch (err) {
          console.error("JSON parse error:", err);
          return;
        }
      }
      
      // If valid address object received
      if (res && res.full_name) {
        $(".checkout-form").hide();
        $(".checkout-container").html(""); // clear previous

        const addressCard = `
          <div class="address-card selected">
            <div class="address-top">
              <div class="address-info">
              
                <h4>${res.full_name}</h4>
                <p>${res.address_line}</p>
                <p>${res.city}, ${res.state} - ${res.pincode}</p>
                <p>Mobile: <strong>${res.phone_no}</strong></p>
             
              </div>
              <div class="address-actions">
              <button class="btn-outline edit-btn-forcheckout" data-uid="${res.user_id}" 
              data-id="${res.id}"
              data-fullname="${res.full_name}" 
              data-address="${res.address_line}" 
              data-city="${res.city}" 
              data-state="${res.state}" 
              data-pincode="${res.pincode}" 
              data-phone="${res.phone_no}">
              Edit
             </button>

              </div>
            </div>
            <div class="address-bottom">
              <label>
                Deliver to this address: <h4>${res.full_name}, ${res.pincode}</h4>
              </label>
            </div>
            
          </div>
        `;

        $(".checkout-container").append(addressCard);
      } else {
        $(".checkout-container").hide();
        $("#manageAddressBtn").hide();
                 $('.location_section').hide();
                 $('.dv').hide();
      }
    },
    error: function () {
      $(".checkout-container").html(
        `<p class="error">Something went wrong while loading address.</p>`
      );
    },
  });
};




    const modal = document.getElementById("editdeliverModal"); 
    const editBtns = document.querySelectorAll(".edit-btn-forcheckout");
    const closeBtn = document.querySelector(".close-btn-deliver-modal");


    editBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        modal.style.display = "block";
      });
    });


    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
    


$(document).on("click", ".edit-btn-forcheckout", function() {
    const uid = $(this).data("uid");
    const id = $(this).data("id");
    const fullname = $(this).data("fullname");
    const address = $(this).data("address");
    const city = $(this).data("city");
    const state = $(this).data("state");
    const pincode = $(this).data("pincode");
    const phone = $(this).data("phone");



    // Fill modal fields
    $("input[name='name']").val(fullname);
    $("textarea[name='address']").val(address);
    $("input[name='city']").val(city);
    $("input[name='state']").val(state);
    $("input[name='pincode']").val(pincode);
    $("input[name='mobile']").val(phone);

    $("#editdeliverModal").fadeIn();
    localStorage.setItem("forupdatadduser" , uid);
    localStorage.setItem("forupdataddusertableid" , id);
});





function savedeliverto(){
const uid = localStorage.getItem("forupdatadduser");
const id = localStorage.getItem("forupdataddusertableid");
    const fullname = $("input[name='name']").val();
    const address = $("textarea[name='address']").val();
    const city = $("input[name='city']").val();
    const state = $("input[name='state']").val();
    const pincode = $("input[name='pincode']").val();
    const phone = $("input[name='mobile']").val();

    $.ajax({
        url: API_URL, 
        type: "POST",
        data: {
            type:'updateduseraddress',
            id:id,
            uid: uid,
            fullname: fullname,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            phone: phone
        },
        success: function(response) {
            const res = response;
            
            if(res.status == true) {
               successAlert("Address updated successfully!");
                 alert("Address updated successfully!");
                $("#editdeliverModal").fadeOut();

       

                // Optionally update the address in the checkout page without reload
                $(`.address-card[data-id='${id}']`).find(".fullname").text(fullname);
                $(`.address-card[data-id='${id}']`).find(".address-text").text(address);
                $(`.address-card[data-id='${id}']`).find(".city-text").text(city);
                $(`.address-card[data-id='${id}']`).find(".state-text").text(state);
                $(`.address-card[data-id='${id}']`).find(".pincode-text").text(pincode);
                $(`.address-card[data-id='${id}']`).find(".phone-text").text(phone);
              }
              
              else {
                WarningAlert("Failed to update address. Try again.");
            }
        },
        error: function() {
            alert("Something went wrong. Try again!");
        }
    });
}


delivertoaddress();


// placeOrderf

$(document).ready(function(){
    let savedValue = localStorage.getItem("paymentMethod");
    if(savedValue){
        $('input[name="payment"][value="'+savedValue+'"]').prop('checked', true);
        console.log(savedValue)
    }
});

const placeOrder = () => {
    
    const uid = localStorage.getItem("forupdatadduser");


    let idfr = localStorage.getItem("idfr");

    let first_name   = $("#first-name").val();
    let last_name    = $("#last-name").val();
    // let company_name = $("#company-name-1").val();
    let city         = $("#town-city").val();
    let state        = $("#select-state").val();
    let pincode      = $("#pin-Code").val();
    let phone        = $("#phone-no").val();
    let email        = $("#email-address").val();

    let streetAdd_1A = $("#street-address-1a").val();
    let streetAdd_1B = $("#street-address-1b").val();
    let address      = streetAdd_1A + " " + streetAdd_1B;
  
    let paymentType  = localStorage.getItem("paymentMethod"); 
   
  

    let main_price  = localStorage.getItem("main_price");
    let total_price = localStorage.getItem("total_price");


    let qty = Math.floor(total_price / main_price);
    console.log("qty:", qty);

   







    $.ajax({
    url: API_URL,
    method: 'POST',
    dataType: "json",  
    data: {
        type: 'placeOrder',
        userId: checkUserId,
        total_amount: total_price,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        address: address,
        streetAdd_1A: streetAdd_1A,
        streetAdd_1B: streetAdd_1B,
        city: city,
        state: state,
        pincode: pincode,
        idfr: idfr,
        paymentType: paymentType,
        main_price: main_price,
        total_price: total_price,
        qty: qty
    },
    beforeSend: function () {
        Swal.fire({
            title: 'Placing your order...',
            text: 'Please wait while we process it',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
            timer: 15000 // 
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                Swal.fire({
                    icon: 'error',
                    title: 'Timeout',
                    text: 'Request took too long. Please try again.'
                });
            }
        });
    },
    success: function (response) {
        Swal.close(); // close loader

        if (response.status === true) {
            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                text: 'Your order was placed successfully.',
                timer: 2000, // auto close in 2 sec
                showConfirmButton: false
            }).then(() => {
                localStorage.removeItem("idfr");
                window.location.href = 'checkout-2.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.message || 'Something went wrong!'
            });
        }
    },
    error: function (xhr, status, error) {
        Swal.close(); // close loader
        Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Order could not be placed. Try again later.'
        });
        console.error("AJAX error:", status, error);
        console.log("Response text:", xhr.responseText);
    }
});



}


// fetchalladdresses
const multiaddress = () => {
    let userid = localStorage.getItem("userId");

    $.ajax({
        url: API_URL,
        method: "POST",
        data: {
            type: 'fetchmultipleaddress',
            userid: userid
        },
        success: function (res) {
            if (res && Array.isArray(res) && res.length > 0) {
                let html = "";

                res.forEach((item) => {
                    const selectedClass = item.is_default == 0 ? "selected-address" : "";
                    html += `
                        <div class="address-card ${selectedClass}" data-id="${item.id}">
                            <h4>${item.full_name}</h4>
                            <p>${item.address_line}, ${item.city}, ${item.state}, ${item.pincode}</p>
                        </div>
                    `;
                });

                $("#addressContainer").html(html);

                // click event for selecting default address
                $(".address-card").on("click", function () {
                    const addressId = $(this).data("id");
                    
                    // visually update selected
                    $(".address-card").removeClass("selected-address");
                    $(this).addClass("selected-address");

                    // update in database
                    $.ajax({
                        url: API_URL,
                        method: "POST",
                        data: {
                            type: 'setdefaultaddress',
                            userid: userid,
                            addressid: addressId
                        },
                        success: function (res) {
                            console.log("Default address updated successfully");
                            delivertoaddress();
                        },
                        error: function () {
                            console.log("Error updating default address");
                        }
                    });
                });

            } else {
                $("#addressContainer").html("<p>No addresses found.</p>");
            }
        },
        error: function () {
            console.log("Error fetching addresses.");
        }
    });
};



multiaddress();



function addnew(event) {
  event.preventDefault(); // prevent form reload

  const uid = localStorage.getItem("userId");
  const fullname = $("#fullname").val().trim();
  const address = $("#address").val().trim();
  const city = $("#city").val().trim();
  const landmark = $("#landmark").val().trim();
  const state = $("#state").val().trim();
  const pincode = $("#pincode").val().trim();
  const phone = $("#phone").val().trim();

  // ✅ Check for empty fields
  if (!fullname) return warningAlert("Please enter your full name!");
  if (!address) return warningAlert("Please enter your address!");
  if (!city) return warningAlert("Please enter your city!");
  if (!landmark) return warningAlert("Please enter a landmark!");
  if (!state) return warningAlert("Please enter your state!");
  if (!pincode) return warningAlert("Please enter your pincode!");
  if (!phone) return warningAlert("Please enter your phone number!");



  // ✅ Validate pincode (6 digits)
  const pincodePattern = /^\d{6}$/;
  if (!pincodePattern.test(pincode)) {
    return warningAlert("Please enter a valid 6-digit pincode!");
  }


$.ajax({
  url: API_URL,
  method: "POST",
  data: {
    type: "savenewaddress",
    userid: uid,            
    full_name: fullname,    
    phone_no: phone,         
    address_line: address,  
    city: city,
    landmark: landmark,
    state: state,
    pincode: pincode
  },
  success: function (response) {
    console.log("Response:", response);
    const res = typeof response === "string" ? JSON.parse(response) : response;
    if (res.status === true) {
      successAlert("Address added successfully!");
      addAddressModal.style.display="none";
window.location.reload();
      console.log(uid);
      
    } else {
      warningAlert("Invalid " + res.msg);
    }
  },
  error: function (xhr, status, error) {
    console.error("AJAX Error:", xhr.responseText);
    console.log("⚠️ Backend error: " + xhr.status + " " + xhr.statusText);
  }
});

}
