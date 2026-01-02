const name = localStorage.getItem("name");
const phone = localStorage.getItem("phone");

$(".full_name").html(name);
$(".mobile_number").html("+91 " + phone);




