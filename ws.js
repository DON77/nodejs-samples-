const jwt = require('jsonwebtoken');
var connectionCount = {};
function handleError(err){
  console.log(err);
};

module.exports = (io, User, Notes, secret)=>{

  User.find({},function(err,users){
    if (err) return handleError(err);
    users.forEach(function(user){
      user.isOnline = false;
      user.save();
    });
  });

  io.on('connection', function(socket){
    var username = "";
    socket.on("ClientToken",(token)=>{
      var decoded = jwt.decode(token, secret);
      if ( !decoded ) {
        return socket.emit("wrongToken");
      }
      username = decoded.username
      User.findOne({username:username},function(err,user){
        if (err) return handleError(err);
        if (!user) return 0;
        if( !connectionCount[username] ) {
          connectionCount[username] = 1;
          user.isOnline = true;
          socket.broadcast.emit("new_connection",username);
          user.save();
        } else {
          connectionCount[username]++;
        }
      });
    });
    socket.on('disconnect', function(){
      User.findOne({username:username},function(err,user){
        if (err) return handleError(err);
        if (!user) return 0;
        connectionCount[username]--;
        if(connectionCount[username] <= 0){
          user.isOnline = false;
          user.save();
          socket.broadcast.emit("user_disconnected",username);
        }
      });
    });
    socket.on('new_note',(token)=>{
        var decoded = jwt.decode(token, secret);
        if ( !decoded ) {
          return socket.emit("wrongToken");
        }
        Notes.findOne({username:decoded.username},(err,notes)=>{
          notes.addNote("",(err,notes)=>{
            if (err) return handleError(err);
            socket.emit("note_added",notes.last_id);
          });
        });
    });
    socket.on('delete_note',(data)=>{
        var decoded = jwt.decode(data.token, secret);
        if ( !decoded ) {
          return socket.emit("wrongToken");
        }
        Notes.findOne({username:decoded.username},(err,notes)=>{
          notes.delNote(data.id,(err,notes)=>{
            if (err) return handleError(err);
            //socket.emit("note_deleted",notes.last_id);
          });
        });
    });
    socket.on('update_note',(data)=>{
        var decoded = jwt.decode(data.token, secret);
        if ( !decoded ) {
          return socket.emit("wrongToken");
        }
        Notes.findOne({username:decoded.username},(err,notes)=>{
          notes.updNote(data.id,data.content,(err,notes)=>{
            if (err) return handleError(err);
            socket.emit("note_updated", data.id);
          });
        });
    });
  });
};
