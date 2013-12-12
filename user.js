var users = require('./users').profiles;
var fs = require('fs'); 
var homePage = fs.readFileSync("home.html","utf-8");
var loginPage = fs.readFileSync("login.html","utf-8");
var librarianPage = fs.readFileSync("librarian.html","utf-8");
var visitHome = function(profile){     
	var isAdmin = profile.Name=="suraj" &&profile.password=="sumit"
	if(isAdmin)
		window.document.write(LibrarianPage);
	else
		window.document.write(homePage.replace('USERNAME',profile.Name));
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
exports.add_notice = function(req, res){     
	var notice = req.body;
	console.log(notice);     
	notice.time = new Date();     
	notice.sender =req.headers.cookie.split('=')[1];     
	notices.unshift(notice);
	fs.writeFile('./routes/notices.json',JSON.stringify(notices));
	res.redirect('/home'); 
};
exports.logout = function(){
	window.document.write(loginPage);
};