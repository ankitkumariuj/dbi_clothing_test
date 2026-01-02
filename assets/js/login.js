

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




const signin = (event) => {
  // login

  let btn_text = event.currentTarget
    .querySelector(".btn-submit-text")
    .textContent.trim();

  let username = $("#username").val();
  let password = $("#login_password_input").val();

  if (username.trim() === "") {
    warningAlert("please fill the input");
    return;
  }
  if (password.trim() === "") {
    warningAlert("please fill the Password");
    return;
  }


else if (password.length < 3) {
  warningAlert("Password must be at least 3 characters long");
  return;
}

  if (btn_text === "Log In") {
    $.ajax({
      url: API_URL,
      method: "POST",
      data: { type: "userLogin", username: username, password: password },
      success: function (response) {
        if (response.status === true) {
          // alert(response.message);
          console.log(response)
          console.log("login :" , response.message);
          localStorage.setItem("login_status", true);
          localStorage.setItem("name", response.fullname);
          localStorage.setItem("userId", response.id);
          localStorage.setItem("phone", response.phone);
         localStorage.setItem("email", response.email);
          $(".profile--hint-box-content").attr("area-label", "Account");
        successAlert("Login successful!");
setTimeout(() => {
  window.location.href = "/pages/home.html";
}, 1500);
        } else {
          warningAlert(response.message);
        }
      },
    });
  }
};



const togglePassword = document.getElementById("eye");
const password = document.getElementById("login_password_input");
const btn = document.querySelector(".next-btn");


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