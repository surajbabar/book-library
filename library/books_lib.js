var record = {  fs : require('fs') };
record.Inventory = function () {
	var catalog =record.fs.readFileSync('../book-library/book_inventry.txt','utf-8');
	return  catalog;
};	
record.IsIsbnPresent = function ( Newisbn ) {
	var catalog = record.Inventory();
	catalog = catalog.join('\r\n');
    return catalog.match("isbn\":\""+Newisbn+"\"") ? true : false;
};
record.getUserOption = function (text) {
	var result    = {};
	result.add    = (text.toLowerCase() == 'add');
	result.remove = (text.toLowerCase() == 'remove');
	result.list   = (text.toLowerCase() == 'list');
	result.search = (text.toLowerCase() == 'search');
	result.update = (text.toLowerCase() == 'update');
	result.tag    = (text.toLowerCase() == 'tags');
	return result;
};
record.tag = function(tagData){

	  tag = "{\""+tagData[1].replace(/,/g,"\",\"").replace(/:/g,"\":\"").replace(/tags\":\"/g,"tags\":[\"")+"\"]}"+"\r\n";
	  tag = JSON.parse(tag)
	var catalog = record.Inventory();	
		catalog.splice(catalog.length-1);
    var books = catalog.map(JSON.parse);
    for(var counter = 0;counter<books.length;counter++)
		if(books[counter].isbn ==tag.isbn){
		 	if(!books[counter].tags) books[counter].tags= []; 
			 if(tagData[0]=='add')
	    		books[counter] = record.addtag(books[counter],tag.tags);
			 if(tagData[0]=='remove')
	    		books[counter] = record.removetag(books[counter],tag.tags);
			}
			catalog = books.map(JSON.stringify).join("\r\n")+"\r\n";
		record.fs.writeFileSync("book_inventry.txt",catalog,"utf-8");
};
record.addtag = function (book,tags){
    	for(var counter = 0;counter<tags.length;counter++){
    		var flag = false;
    		for(var bookTags = 0;bookTags<book.tags.length;bookTags++)
    			if(tags[counter]==book.tags[bookTags]){
    				flag = true;
    				break;
    			}
    		if(!flag){
    			book.tags.push(tags[counter]);
    		}			
    	}
    	return book;
};
record.removetag = function (book,tags){
    	for(var counter = 0;counter<tags.length;counter++){
    			var flag = false;
    		for(var bookTags = 0;bookTags<book.tags.length;bookTags++)
    			if(tags[counter]==book.tags[bookTags]){
    				flag = true;
    				break;
    			}
    		if(flag){
    			book.tags = book.tags.filter(function(tag){ return tag!= tags[counter]});
    		}			
    	}
    	return book;	
};
record.add = function (newBook) {
	var catalog = record.Inventory();
	catalog.splice(catalog.length-1,1,newBook);
	catalog = catalog.join('\r\n');
	record.fs.writeFileSync("book_inventry.txt",catalog,"utf-8");
};
record.Remove = function (NewBook) {
	var Newisbn = NewBook[1];
	var catalog = record.Inventory();
		catalog.splice(catalog.length-1);
	var books = catalog.map(JSON.parse);
    for(var counter = 0;counter<books.length;counter++)
		if(books[counter].isbn == Newisbn) {
			books.splice(counter,1);
			if(books.length>=1)	
				catalog = books.map(JSON.stringify).join("\r\n")+'\r\n';
			else
				catalog = "";
			record.fs.writeFileSync("book_inventry.txt",catalog,"utf-8");
			return true;
		}	
    return false;
}; 
record.showBooksList = function () {
	var catalog = record.Inventory();
	catalog = catalog.splice(0,catalog.length-1);
	var book = record.DisplayInFormat(catalog);
    if(book.length==38) return false;	
   	return book;
};
record.update = function(newbook){
	var catalog = record.Inventory();	
		catalog.splice(catalog.length-1);
    var books = catalog.map(JSON.parse);
    for(var counter = 0;counter<books.length;counter++)
		if(books[counter].isbn == newbook.isbn) {
	    	if(newbook.price) books[counter].price = newbook.price;
	    	if(newbook.author) books[counter].author = newbook.author;
	    	if(newbook.title) books[counter].title = newbook.title;
	    	if(newbook.publisher) books[counter].publisher = newbook.publisher;
    	}
			catalog = books.map(JSON.stringify).join("\r\n")+"\r\n";
			record.fs.writeFileSync("book_inventry.txt",catalog,"utf-8");
};
var validateField = function(field){
	return field ? field : " ";
};
record.DisplayInFormat = function (books) {
	var  book = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags";
    var  columns =books.map(JSON.parse);
	for(var counter = 0;counter<books.length;counter++) {
    	var  column = columns[counter];
      	book+="\r\n"+validateField(column.isbn)+'|'+validateField(column.price)+'|';
      	book+=validateField(column.author)+'|'+validateField(column.title)+'|'+validateField(column.publisher)+'|'+validateField(column.tags);
        } 
   	return book;
};
record.getSearchOption = function (text) {
	var result = {};
	result.isbn    	 = (text.toLowerCase() == '-isbn'||text.toLowerCase() =='isbn');
	result.price 	 = (text.toLowerCase() == '-price'||text.toLowerCase() == 'price');
	result.author    = (text.toLowerCase() == '-author'||text.toLowerCase() == 'author');
	result.title 	 = (text.toLowerCase() == '-title'||text.toLowerCase() == 'title');
	result.publisher = (text.toLowerCase() == '-publisher'||text.toLowerCase() == 'publisher');
	result.tags		 = (text.toLowerCase() == '-tag'||text.toLowerCase() == 'tag');	
	return result;
};
record.convertIntoRecord = function (data) {
	data = data.toString(); 
	if(data.indexOf("isbn:")==-1)  return " ";
	return "{\""+data.replace(/;/g,"\",\"").replace(/:/g,"\":\"")+"\"}"+"\r\n";
};
record.getSearch = function(catalog,data,arguments,key ){
	var booksFound =[];
	for(var counter =0;counter<catalog.length;counter++){
 	 	if(!(data[counter])[key]) continue;
 	 	if((data[counter])[key].indexOf(arguments[1])!=-1)
 	 		booksFound.push(catalog[counter]);
 	} 	
 	 	return booksFound;
};
record.search =function (arguments) {
	var option = record.getSearchOption(arguments[0]);
	var catalog = record.Inventory();
		catalog = catalog.splice(0,catalog.length-1);
	var booksFound=[];
	var  data = catalog.map(JSON.parse);
	for(var counter =0;counter<catalog.length;counter++)
 	 	if(catalog[counter].indexOf(arguments[0])!=-1)
 	 		booksFound.push(catalog[counter]);
	if(option.isbn)
		booksFound =record.getSearch(catalog,data,arguments,"isbn");
	if(option.price)
		booksFound =record.getSearch(catalog,data,arguments,"price");
	if(option.author)
		booksFound =record.getSearch(catalog,data,arguments,"author");
	if(option.title)
		booksFound =record.getSearch(catalog,data,arguments,"title");
	if(option.publisher)
		booksFound =record.getSearch(catalog,data,arguments,"publisher");
	if(option.tags)
		booksFound =record.getSearch(catalog,data,arguments,"tags");
	if(booksFound.length==0)
		return "No book details found for "+arguments; 		
	var book = record.DisplayInFormat(booksFound);
   	return book;
 };
record.modifyCatalog = function (input) {
	  if(!input||input=="") input=" ";
     var option = record.getUserOption(input[0]),flag;
     var NewBook =input.slice(1,input.length);
    	if(NewBook[0] &&NewBook[0].lastIndexOf(';')+1==NewBook[0].length){
    		NewBook[0] = NewBook[0].split(';');
    		NewBook[0] = NewBook[0].filter(function(x){return x!=''}).join(';');
    	}
     if(option.list) {
     	 if(!record.showBooksList()) return "No books exists";
     	 return record.showBooksList();
     }
     var  NewBookRecord = record.convertIntoRecord(NewBook);
     if(option.remove) {
		var Newisbn = NewBook[1];
		if(!( NewBook[0]=='-isbn'|| NewBook[0]=='isbn')||!(Newisbn)||Newisbn==" ")
     		return "please mention  -isbn and isbn number";
     	if(record.Remove(NewBook)) 
     		return "isbn:"+NewBook[1]+" deleted successfully";
        return "book not present having isbn:"+NewBook[1];
     } 
     if(option.search){ 
 	 	if(NewBook[0]=="") return record.showBooksList();
 	 	if(!NewBook[0]||NewBook[1]== "") return "please mention the field to search";
 	 	if(NewBook[0]=='-') return "Invalid field to search";
     	return record.search(NewBook);
     }
     if(option.update){
     	if(NewBookRecord.length==1) return "please mention isbn with isbn number of book"; 
     	    NewBookRecord = JSON.parse(NewBookRecord);
    	var Newisbn = NewBookRecord.isbn;
    	if(!record.IsDuplicate(Newisbn)) 
			return "A book having isbn number:"+Newisbn+" is not present";
	    	record.update(NewBookRecord); 
	   	return NewBook+" updated successfully";
		}
	 if(option.tag){
	 	if(NewBook[0]!="add"&& NewBook[0]!="remove")
	 		 return "please use add,remove operations for tag";
	 	if(!NewBook[1] ||NewBook[1]=="")
	 		 return "please mention isbn and tag";	
	 	return record.tag(NewBook);
	 }	
     return "bookcatalog: Invalid option: "+input+
	        "\n Try  \'bookcatalog --help\' for more Information";	
};
record.example=function(){
	console.log("same here");
}
exports.record = record;