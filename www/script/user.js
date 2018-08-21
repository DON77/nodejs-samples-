$(document).ready(()=>{
  $(".btn-danger").click(()=>{
    Cookies.remove('token');
    location.replace("/");
  });
});
