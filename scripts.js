var fs = require('fs');
var gui = require('nw.gui');
var mysql = require('mysql');
var users = require('./users').profiles;
var user = require('./user.js');
var homePage = fs.readFileSync("home.html","utf-8");
var loginPage = fs.readFileSync("login.html","utf-8");
var librarianPage = fs.readFileSync("librarian.html","utf-8");
var new_win = gui.Window.get();
var connection = mysql.createConnection(require('./connect').user);
connection.connect();
var library={};
var operations;
var showBooksPage = fs.readFileSync("showBooks.html",'utf-8');

var showAdd = function(){
	document.getElementById('add').style.display = 'block';
	document.getElementById('remove').style.display = 'none';
	document.getElementById('update').style.display = 'none';
	document.getElementById('isbn_error').style.display = 'none';
};

var showRemove = function(){
	var ISBNs = [];
	var getISBN = function (record) {
	var ISBN = "<option value='"+record.isbn+"'>"+record.isbn+"</option>";
	ISBNs.push(ISBN);
	};
	connection.query('select isbn from catalog;',function(err, rows, fields){
    	if (err) throw err;
    rows.forEach(getISBN);
	document.getElementById('remove').style.display = 'block';
	document.getElementById('current_book').style.display = 'none';
	document.getElementById('add').style.display = 'none';
	document.getElementById('update').style.display = 'none';
	document.getElementById('book_removed').style.display = 'none';
	document.write(librarianPage.replace('SELECT_ISBN',isbns));
});
}; 

var showUpdate = function(){
	document.getElementById('update').style.display = 'block';
	document.getElementById('remove').style.display = 'none';
 	document.getElementById('add').style.display = 'none';
};

var addBook = function(){
		var Book;
	Book= document.getElementById('add_isbn').value+',';
	Book+= document.getElementById('add_price').value+',\'';
	Book+= document.getElementById('add_title').value+'\',\'';
	Book+= document.getElementById('add_author').value+'\',\'';
	Book+= document.getElementById('add_publisher').value+'\'';
	connection.query('insert into catalog() values('+Book+');',add);
    connection.query('commit',function(){});
};
var add =function(err, rows, fields) {
	if (err)
	document.getElementById('isbn_error').style.display = 'block';
};
var showBook = function() {
	isbn = document.getElementById('isbnList').value;	
	  connection.query('select * from catalog where isbn like '+isbn,showRecord);
};
var showRecord  = function(err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    document.getElementById('bookTitle').value = rows[0].book_title;
    document.getElementById('bookAuthor').value = rows[0].author;
	document.getElementById('current_book').style.display = 'block';
};
var visitHome = function(profile){     
	var isUser = profile.id!="admin" &&profile.password!="admin";
	if(isUser)
		window.document.write(homePage.replace('USERNAME',profile.Name));
	else
		window.document.write(librarianPage.replace('USERNAME',profile.Name));	
};
 var removeBook = function(){
	var book = document.getElementById("isbnList");
	connection.query('delete from catalog where isbn like '+isbn,function(err, rows, fields){
    		if (err) throw err;
	document.getElementById('book_removed').style.display = 'block';
    	});
};
var visitLogin = function(){
	console.log("INcorrect id");
};

var login = function(){
	var userID = window.document.getElementsByName('userID')[0].value;
	var password =window.document.getElementsByName('password')[0].value;
	var profile = users[userID];
	var isValid = profile && profile.password === password;
	if(isValid) visitHome(profile);
	else visitLogin();	
};

var home = function(req, res){ 
    console.log('cookie',req.cookie);
    var userId = req.headers.cookie &&
    req.headers.cookie.split('=')[1];     
    var profile =  userId && users[userId];
	if(profile) res.render('home',{notices:notices});     
	else  visitLogin(req,res); 
}; 
var logout = function(){
	window.document.write(loginPage);
};		