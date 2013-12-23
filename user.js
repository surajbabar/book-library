var users = require('./users').profiles;
var fs = require('fs'); 
var homePage = fs.readFileSync("home.html","utf-8");
var library = require('./library/books_lib').record;
var loginPage = fs.readFileSync("login.html","utf-8");
var librarianPage = fs.readFileSync("librarian.html","utf-8");
var books = library.Inventory();
books =  books.split('\r\n');
var visitHome = function(profile){     
	var getISBN = function (bookdetails) {
	bookdetails = JSON.parse(bookdetails);
	var ISBN = "<option value="+bookdetails.isbn+">"+bookdetails.isbn+"</option>";
	ISBNs.push(ISBN);
	};
	var isUser = profile.id!="admin" &&profile.password!="admin";
	if(isUser)
		window.document.write(homePage.replace('USERNAME',profile.Name));
	else{
		var ISBNs = [];
		books.pop();
		books.forEach(getISBN);
		librarianPage = librarianPage.replace('SELECT_ISBN',ISBNs);
		window.document.write(librarianPage.replace('USERNAME',profile.Name));
	}	
};
var visitLogin = function(){
	console.log("INcorrect id");
};

exports.login = function(){
	var userID = window.document.getElementsByName('userID')[0].value;
	var password =window.document.getElementsByName('password')[0].value;
	var profile = users[userID];
	var isValid = profile && profile.password === password;
	if(isValid) visitHome(profile);
	else visitLogin();	
};

exports.home = function(req, res){ 
    console.log('cookie',req.cookie);
    var userId = req.headers.cookie &&
    req.headers.cookie.split('=')[1];     
    var profile =  userId && users[userId];
	if(profile) res.render('home',{notices:notices});     
	else  visitLogin(req,res); 
}; 
exports.logout = function(){
	window.document.write(loginPage);
};