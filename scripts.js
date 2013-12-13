var gui = require('nw.gui');
var fs = require('fs');
var users = require('./user.js');
var library = require('./library/books_lib').record;
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

var showAdd = function(){
	document.getElementById('add').style.display = 'block';
	document.getElementById('remove').style.display = 'none';
	document.getElementById('update').style.display = 'none';
};

var showRemove = function(){
	document.getElementById('remove').style.display = 'block';
	document.getElementById('add').style.display = 'none';
	document.getElementById('update').style.display = 'none';
};

var showUpdate = function(){
	document.getElementById('update').style.display = 'block';
	document.getElementById('remove').style.display = 'none';
 	document.getElementById('add').style.display = 'none';
};

var addBook = function(){
		var Book = {};
	Book.isbn = document.getElementById('book_isbn').value;
	Book.price = document.getElementById('book_price').value;
	Book.author = document.getElementById('book_author').value;
	Book.title = document.getElementById('book_title').value;
	Book.publisher = document.getElementById('book_publisher').value;
	if(library.IsIsbnPresent(Book.isbn))
		document.getElementById('error_isbn').style.display = 'block';
    else
    	library.add(JSON.stringify(Book)+'\r\n');
};

var removeBook = function(){
	var e = document.getElementById("select1");
    var strSel = "The Value is: " + e.options[e.selectedIndex].value + " and text is: " + e.options[e.selectedIndex].text;
    alert(strSel);
	Book.isbn = document.getElementById('book_isbn').value;

};
