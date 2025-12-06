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

$(".k_eye_icon").click(function () {
  const input = $("#login_password_input");
  const icon = $(this).find("i");

  if (input.attr("type") === "password") {
    input.attr("type", "text");
    icon.removeClass("fa-eye").addClass("fa-eye-slash");
  } else {
    input.attr("type", "password");
    icon.removeClass("fa-eye-slash").addClass("fa-eye");
  }
});

const signUp = (event) => {

  let btn_textEl = event.currentTarget.querySelector(".btn-submit-text");
  let btn_text = btn_textEl ? btn_textEl.textContent.trim() : event.currentTarget.textContent.trim();

  if (btn_text === "Log In") {
    $.ajax({
      url: API_URL,
      method: "POST",
      data: { type: "userLogin", username: username, password: password },
      success: function (response) {
        if (response.status === true) {
          console.log("login:", response.message);
          localStorage.setItem("login_status", true);
          localStorage.setItem("name", response.fullname);
          localStorage.setItem("userId", response.id);
          localStorage.setItem("phone", response.phone);
          $(".profile--hint-box-content").attr("area-label", "account");
          location.reload();
        } else {
          warningAlert(response.message);
        }
      },
    });
  } else {
    // Sign Up
    let first_name = $("#full_name").val() || "";
    let phone_no = $("#phone_no").val() || "";
    let username = $("#username").val() || "";
    let password = $("#login_password_input").val() || "";
    if (first_name.trim() === "") {
      warningAlert("Please fill the full name");
      return;
    }

    if (phone_no.trim() === "") {
      warningAlert("Please enter your phone number");
      return;
    } else if (phone_no.length !== 10) {
      warningAlert("Please enter a valid 10-digit phone number");
      return;
    }

    if(username.trim() === ""){
      warningAlert('Please Enter your email id');
      return;
    }
   

      if (password.trim() === "") {
    warningAlert("Please enter your password");
    return;
  }

    $.ajax({
      url: API_URL,
      method: "POST",
      data: {
        type: "userSignUp",
        first_name: first_name,
        phone_no: phone_no,
        username: username,
        password: password,
      },
      success: function (response) {
        if (response.status == true) {
          localStorage.setItem("login_status", true);
          localStorage.setItem("name", first_name);
          localStorage.setItem("userId", response.id);
          localStorage.setItem("email_id", username);
          localStorage.setItem("phone", phone_no);
          successAlert("SignUp successful!");
          setTimeout(() => {
            window.location.href = "/pages/home.html";
          }, 1500);
        } else {
          warningAlert(response.message);
        }
      },
    });
  }

  console.log("Button text was:", btn_text);
};

const togglePassword = document.getElementById("eye");
const password = document.getElementById("login_password_input");
const btn = document.getElementById("btn_signup");


togglePassword.style.display = "none";

password.addEventListener("input", () => {
  if (password.value.length > 0) {
    togglePassword.style.display = "block"; 
             btn.style.background='black';      
  } else {
    togglePassword.style.display = "none";    
                            btn.style.background=  '#e6e6e6';     
  }
});


if (password.value.length === 0) {
  togglePassword.style.display = "none";

}
