var gui = require('nw.gui');
var fs = require('fs');
var users = require('./user.js');
var libraryPath ='C:/Users/surajbab/Dropbox/step_suraj/bookcatalog/books_lib';
var library = require(libraryPath).record;
var new_win = gui.Window.get();// Create a new window and get it
var books = library.Inventory();
var showBooksPage = fs.readFileSync("showBooks.html",'utf-8');
library.showBooks= function(){
	var indexedbooks = [];
	var number = 0;
var formatedBook = function (bookdetails) {
	bookdetails = JSON.parse(bookdetails);
	var book = "<tr><td><input type='radio' id = "+(++number)+" name='books'/>"+
				bookdetails.title+"</td><td>"+
				bookdetails.author+"</td></tr>"
	console.log(book);			
	indexedbooks.push(book);
};
	books.forEach(formatedBook);
	window.document.write(showBooksPage.replace('BOOKS',indexedbooks));

};

var issueBook = function (){
	var title = document.getElementById('bookName');
	var bookNames =document.getElementsByName('books');
	// for(var index = 0;index<bookNames.length;index++)
		// if(bookNames[i].checked)
	//if(isBookPresent(title))
};
var isBookPresent = function(title) {

};