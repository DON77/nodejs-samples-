// Example starter JavaScript for disabling form submissions if there are invalid fields
$(document).ready(()=>{
  'use strict';
  var passwords_match = false;
  var pass_element = $("#riegisterInputPassword");
  var repass_element = $("#riegisterInputRePassword");
  var register_form_element = $("#register_form");
  var was_validated = false;


  var change_new_pass_element = $("#changeNewInputPassword");
  var change_new_repass_element = $("#changeNewInputRePassword");

  $("#register_form input[type=password]").keyup(()=>{
      if(change_new_pass_element.val() === repass_element.val() && repass_element.val()  != ""){
          passwords_match = true;
          if(was_validated){
              $("#riegisterInputRePassword").removeClass("password-match-invalid");
              $(".repassword-feedback").css("display","none");
          }
      } else {
          passwords_match = false;
          if(was_validated && repass_element.val()  != ""){
              $("#riegisterInputRePassword").addClass("password-match-invalid");
              $(".repassword-feedback").css("display","block");
          }
      }
  });
  $("#register_form input[type=password]").keyup(()=>{
      if(change_new_pass_element.val() === change_new_repass_element.val() && change_new_repass_element.val()  != ""){
          passwords_match = true;
          if(was_validated){
              $("#changeNewInputRePassword").removeClass("password-match-invalid");
              $(".repassword-feedback").css("display","none");
          }
      } else {
          passwords_match = false;
          if(was_validated && repass_element.val()  != ""){
              $("#changeNewInputRePassword").addClass("password-match-invalid");
              $(".repassword-feedback").css("display","block");
          }
      }
  });
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        was_validated = true;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        if(!passwords_match && $(this).attr('id') == 'register_form'){
            $("#register_form input[type=password]").keyup();
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
});
