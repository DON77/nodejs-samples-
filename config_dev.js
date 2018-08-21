exports.db = "mongodb://localhost/notes";

exports.secret = 'mingusforlove';

exports.RegExps = {
  "email": (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm),
  "name": (RegExp('[\sa-zA-Z]{1,50}')),
  "surename": (RegExp('[\sa-zA-Z]{1,50}')),
  "username": (RegExp('[a-zA-Z0-9]{5,30}')),
  "password": (RegExp('[a-zA-Z0-9]{5,30}')),
};

exports.email = {
  "address": "newmailformytask@gmail.com",
  "password": "Testpassword123"
};
