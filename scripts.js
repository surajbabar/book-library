var gui = require('nw.gui');
var fs = require('fs');
var users = require('./user.js');
var libraryPath ='C:/Users/surajbab/Dropbox/step_suraj/bookcatalog/books_lib';
var library = require(libraryPath).record;
var new_win = gui.Window.get();// Create a new window and get it
var books = library.Inventory();
var showBooksPage = fs.readFileSync("showBooks.html",'utf-8');
library.showBooks= function(){
	
	window.document.write(showBooksPage.replace('BOOKS',book));
};
