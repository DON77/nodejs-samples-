var socket = io();
socket.on('connect', function () {

  socket.emit("ClientToken",Cookies.get('token'));

  socket.on("new_connection",function(username){
    var element = $("#img_"+username);
    if ( element.length ) {
      if(element.hasClass("ico-offline"))
        element.removeClass("ico-offline");
      element.addClass("ico-online");
    }
  });
  socket.on("user_disconnected",function(username){
    var element = $("#img_"+username);
    if ( element.length ) {
      if(element.hasClass("ico-online"))
        element.removeClass("ico-online");
      element.addClass("ico-offline");
    }
  });
  $(".new-note").click(function(){
    socket.emit("new_note",Cookies.get('token'));
    //$( ".notes-collection" ).prepend( '<div class="note-div"><p contenteditable="true"></p><div class="note-div-bot"><img src="/image/loading.gif"><div>Saved</div></div><img class="delete-ico" src="/image/delete.png"></div>' );
  });

  $(".delete-ico").click(function(){
    socket.emit("delete_note",{ id:$(this).parent().find("p").data("id"), token:Cookies.get('token')});
    $(this).parent().remove();
  });

  function keyup(){
    var that = this;
    clearTimeout($(that).data("timeout"));
    $(this).parent().find(".loading-img").css("display","initial");
    $(this).data("timeout",setTimeout(()=>{
      socket.emit("update_note",{id:$(this).data("id"), content:$(this).text(), token:Cookies.get('token')});
    },1000));
  }

  $(".note-div p").on("keyup",keyup);

  socket.on("note_added",function(id){
    var div = $('<div class="note-div"></div>');
    var p = $('<p data-id="'+ id +'" contenteditable="true"></p>');
    p.keyup(keyup);
    div.append(p);
    div.append('<div class="note-div-bot"><img class="loading-img" src="/image/loading.gif"><div>Saved</div></div>');
    var del = $('<img class="delete-ico" src="/image/delete.png">');
    del.click(function(){
      socket.emit("delete_note",{ id:$(this).parent().find("p").data("id"), token:Cookies.get('token')});
      $(this).parent().remove();
    });
    div.append(del);
    $( ".notes-collection" ).prepend( div );
  });
  socket.on("note_updated",function(id){
    //console.log($("[data-id='" + id + "'").parent().find(".note-div-bot div")[0]);
    $("[data-id='" + id + "'").parent().find(".loading-img").css("display","none");
    window.saved_text = $("[data-id='" + id + "'").parent().find(".note-div-bot div");
    saved_text.css("display","block");
    saved_text.animate({
      opacity: 0,
    }, 1000, function() {
      saved_text.css("display","none");
      saved_text.css("opacity",1);
    });
  });
});
