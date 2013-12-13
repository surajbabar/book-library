var assert = require('assert');
var record = require('./books_lib.js').record;
var test = {};
var mockfs = {    data :"",
    				writeFileSync : function (file,data,type){ mockfs.data=data;},
    				readFileSync : function (){ return mockfs.data;}
};
record.fs=mockfs;
test.bookcatalog_add_without_book_details_will_give_mention_isbn= function(){
    var expected = "please mention  isbn with isbn number of book"; 				     
	assert.deepEqual(expected,record.modifyCatalog(["add",""]));
};
test.bookcatalog_update_without_book_details_will_give_mention_isbn= function(){
	    var expected = "please mention isbn with isbn number of book"; 				     
	assert.deepEqual(expected,record.modifyCatalog(["update",""]));
};
test.bookcatalog_update_without_isbn_details_will_give_mention_isbn= function(){
	    var expected = "please mention isbn with isbn number of book"; 				     
	assert.deepEqual(expected,record.modifyCatalog(["update","price:546"]));
};
test.bookcatalog_update_with_book_details_will_update_the_book_record= function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "isbn:0058;price:250 updated successfully"; 				     
	assert.deepEqual(expected,record.modifyCatalog(["update","isbn:0058;price:250"]));
};
test.bookcatalog_update_with_book_details_will_update_the_book_in_inventory= function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    record.modifyCatalog(["update","isbn:0058;price:250;author:"+
    					 "swamiji;title:kshanvikshita;publisher:H_vivek"]);
    var expected = {"isbn":"0058","price":"250","author":"swamiji",
                 "title":"kshanvikshita","publisher":"H_vivek"};
                expected = JSON.stringify(expected) + "\r\n"; 				     
	assert.deepEqual(expected,record.fs.data);
};
test.bookcatalog_update_with_new_isbn_will_not_update_the_book_record= function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "A book having isbn number:00580 is not present"; 				     
	assert.deepEqual(expected,record.modifyCatalog(["update","isbn:00580;price:250"]));
};
test.showBookList_will_display_the_list_of_books = function() {
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n0058|2405"+
                   "|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n"+
	               "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
	assert.equal(expected,record.showBooksList());
};
test.showBookList_will_display_No_books_if_the_inventory_is_empty = function() {
	record.fs.data = "{}"; 
	assert.equal(false,record.showBooksList());
};
test.ConvertIntoRecord_will_give_true_if_isbn_is_not_given = function(){
	var data = ['"0007258917;price:245;author:Jhumpa Lahiri;"'+
			   '"title:The Namesake;publisher:Harper Collins India"'];
	assert.equal(" ",record.convertIntoRecord(data));
};
test.bookcatalog_add_sometext_should_recognize_add_as_option = function(){
	assert.deepEqual({
		add:true,
		remove:false,
		list:false,
		search:false,
		update:false,
		tag:false
			    },record.getUserOption("add"));
};
test.bookcatalog_remove_sometext_should_recognize_remove_as_option = function(){
	assert.deepEqual({
		add:false,
		remove:true,
		list:false,
		search:false,
		update:false,
		tag:false
	    },record.getUserOption("Remove"));
};
test.IsDuplicate_with_Giving_duplicate_isbn_will_give_true = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
    var Newisbn = "00258"
	assert.equal(true,record.IsDuplicate(Newisbn));
};
test.bookcatalog_search_sometext_should_recognize_search_as_option = function(){
	assert.deepEqual({
		add:false,
		remove:false,
		list:false,
		search:true,
		update:false,
		tag:false
 	    },record.getUserOption("search"));
};
test.bookcatalog_remove_isbn_will_remove_the_book_record = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                '"title":"The Namesake","publisher":"Harper Collins India"}\r\n"';
	assert.equal(true,record.Remove(["-isbn", "0058"])); 	
};
test.bookcatalog_remove_isbn_on_empty_inventory_will_not_remove_the_book_record = function(){
	record.fs.data = '';
	var expected = "book not present having isbn:0058";
	assert.equal(expected,record.modifyCatalog(["remove","-isbn", "0058"])); 	
};
test.bookcatalog_remove_isbn_will_remove_one_book = function(){
		record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
	var input = ["remove","isbn","0058"];
	var result = {"isbn":"00258","price":"2405","author":"jhumpa Lahiri",
                 "title":"The Namesake","publisher":"Harper Collins India"};
                result = JSON.stringify(result) + "\r\n";
	record.modifyCatalog(input);
	assert.equal(mockfs.data,result);
};
test.bookcatalog_remove_with_rong_isbn_will_give_record_not_present = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                '"title":"The Namesake","publisher":"Harper Collins India"}\r\n"';
    var expected = "given isbn:00558 not present";            
	assert.equal(false	,record.Remove(["-isbn", "00558"])); 	
};
test.bookcatalog_add_with_book_data_will_add_the_book_accordingly = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                  '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}';
	var input = ["add","isbn:0007258917;price:245;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India"];
	var expected = "New book isbn:0007258917;price:245;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India added successfully";
	assert.equal(expected,record.modifyCatalog(input));
};
test.bookcatalog_add_with_book_data_will_add_book_in_inventory = function(){
	record.fs.data="";
	var input = ["add","isbn:0058;price:2405;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India"];
	 var expected = {"isbn":"0058","price":"2405","author":"Jhumpa Lahiri","title":"The Namesake","publisher":"Harper Collins India","tags":[]};
	record.modifyCatalog(input);
	assert.equal(record.fs.data,JSON.stringify(expected)+'\r\n');
};
test.bookcatalog_add_with_book_data_and_ending_with_semicolon_will_add_book_in_inventory = function(){
	record.fs.data="";
	var input = ["add","isbn:0058;price:2405;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India;"];
	 var expected = {"isbn":"0058","price":"2405","author":"Jhumpa Lahiri","title":"The Namesake","publisher":"Harper Collins India","tags":[]};
	record.modifyCatalog(input);
	assert.equal(record.fs.data,JSON.stringify(expected)+'\r\n');
};
test.bookcatalog_add_with_only_isbn_will_add_book_in_inventory = function(){
	record.fs.data="";
	var input = ["add","isbn:0058"];
	 var expected = {"isbn":"0058","price":"-","author":"-","title":"-","publisher":"-","tags":[]};
	record.modifyCatalog(input);
	assert.equal(record.fs.data,JSON.stringify(expected)+'\r\n');
};
test.bookcatalog_addbook_which_already_exists_will_give_book_allready_exists = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                  '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}';
	var input = ["add","isbn:0058;price:245;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India"];
	var expected = "A book having isbn number:0058 is already exists";
	assert.equal(expected,record.modifyCatalog(input));
};
test.bookcatalog_with_add_option_without_isbn_will_ask_for_isbn = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
	var input = ["add","isbn:;price:245;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India"];
	var expected ="please mention  isbn with isbn number of book";
	assert.equal(expected,record.modifyCatalog(input));
};
test.bookcatalog_add_with_space_as_isbn_will_ask_for_isbn = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
	var input = ["add","isbn:;price:245;author:Jhumpa Lahiri;"+
				 "title:The Namesake;publisher:Harper Collins India"];
	var expected ="please mention  isbn with isbn number of book";
	assert.equal(expected,record.modifyCatalog(input));
};
test.bookcatalog_add_with_empty_string_ask_for_isbn = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
	var input = ["add","isbn:;price:245;author:Jhumpa Lahiri;title:"+
				 "The Namesake;publisher:Harper Collins India"];
	var expected ="please mention  isbn with isbn number of book";
	assert.equal(expected,record.modifyCatalog(input));
};
test.bookcatalog_remove_with_isbn_will_remove_the_book_accordingly = function(){
	record.fs.data = '{"isbn":\"0058\","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
	var expected ="isbn:0058 deleted successfully";
	assert.equal(expected,record.modifyCatalog(["remove","isbn","0058"]));
};
test.bookcatalog_remove_option_without_isbn_will_ask_for_isbn = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
	var expected ="please mention  -isbn and isbn number";
	assert.equal(expected,record.modifyCatalog(["remove","0058"]));
};
test.bookcatalog_remove_with_rong_isbn_will_give_book_not_present = function(){
	record.fs.data = '{"isbn":"00538","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}';
	var expected ="book not present having isbn:0058";
	assert.equal(expected,record.modifyCatalog(["remove","-isbn","0058"]));		
};
test.bookcatalog_list_to_modifyCatalog_will_display_the_list_of_books = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n0058|2405"+
                   "|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n00258"+
                   "|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
	assert.equal(expected,record.modifyCatalog(["list"]));
};
test.bookcatalog_list_will_display_no_books_if_inventory_is_empty = function() {
	record.fs.data = "";
	assert.equal("No books exists",record.modifyCatalog(["list"]));
};
test.bookcatalog_search_field_will_display_the_perticuler_book_details = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2450","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
	assert.equal(expected,record.modifyCatalog(["search","2405"]));
};	
test.bookcatalog_search_isbn_will_display_that_perticuler_book_details = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
	assert.equal(expected,record.modifyCatalog(["search","0058"]));
};	
test.bookcatalog_search_price_will_display_the_perticuler_book_details = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "No book details found for ramesh";
	assert.equal(expected,record.modifyCatalog(["search","ramesh"]));
};	
test.bookcatalog_search_empty_will_ask_for_field_to_search = function(){
	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}'+
                '\r\n{"isbn":"00258","price":"2450","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "please mention the field to search"
	assert.equal(expected,record.modifyCatalog(["search"]));
};
test.DisplayInFormat_will_display_the_given_books_in_format = function(){
	var books = ['{"isbn":"0058","price":"2405","author":"jhumpa Lahiri","'+
				'title":"The Namesake","publisher":"Harper Collins India"}'];
	var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n0058"+
                   "|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
	assert.equal(expected,record.DisplayInFormat(books));
};
test.If_input_is_not_related_to_bookcatalog_Try_help_will_displap = function(){
	var expected = "bookcatalog: Invalid option: suraj,programmer,thoughtworker"+
	        	   "\n Try  \'bookcatalog --help\' for more Information";	
	assert.equal(expected,record.modifyCatalog(["suraj","programmer","thoughtworker"]));
};
test.bookcatalog_search_minus_author_should_recognize_author_as_option = function(){
	assert.deepEqual({
		author:true,
		isbn:false,
		price:false,
		title:false,
		publisher:false,
		tags:false
	    },record.getSearchOption("-author"));
};
test.bookcatalog_search_minus_publisher_should_recognize_publisher_as_option = function(){
	assert.deepEqual({
			author:false,
		isbn:false,
		price:false,
		title:false,
		publisher:true,
		tags:false
	    },record.getSearchOption("-publisher"));
};
test.bookcatalog_search_option_emptyField_will_ask_for_field = function(){
 	assert.equal("please mention the field to search",record.modifyCatalog(["search","-author",""]));
 };
test.bookcatalog_search_minus_isbn_Field_will_search_field_by_isbn_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","-isbn","0058"]));
 };
 test.bookcatalog_search_isbn_Field_will_search_field_by_isbn_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"2405","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","isbn","0058"]));
 };
test.bookcatalog_search_minus_price_Field_will_search_field_by_price_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","-price","2405"]));
};
test.bookcatalog_search_price_Field_will_search_field_by_price_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","price","2405"]));
};
test.bookcatalog_search_minus_title_Field_will_search_field_by_title_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","-title","The"]));
};
test.bookcatalog_search_title_Field_will_search_field_by_title_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","title","The"]));
};
test.bookcatalog_search_minus_publisher_Field_will_search_field_by_publisher_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","-publisher","India"]));
};
test.bookcatalog_search_publisher_Field_will_search_field_by_publisher_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India| \r\n"+
                   "00258|2405|jhumpa Lahiri|The Namesake|Harper Collins India| ";
 	assert.equal(expected,record.modifyCatalog(["search","publisher","Collins"]));
};
test.bookcatalog_search_minus_tag_Field_will_search_field_by_tag_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India|written,tragedy,novel";
 	assert.equal(expected,record.modifyCatalog(["search","-tag","written"]));
};
test.bookcatalog_search_tag_Field_will_search_field_by_tag_in_inventory = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
      var expected = "ISBN\tPrice\tAuthor\tTitle\tPublisher\tTags\r\n"+
                   "0058|240|jhumpa Lahiri|The Namesake|Harper Collins India|written,tragedy,novel";
 	assert.equal(expected,record.modifyCatalog(["search","tag","novel"]));
};
test.bookcatalog_search_minus_minus_minus_Field_will_not_show_book = function(){
 	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
  	assert.equal("No book details found for ---",record.modifyCatalog(["search","---"]));
};
test.bookcatalog_tags_add_will_add_the_tag_to_book = function (){
	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
 	var expected = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    record.modifyCatalog(["tags","add","isbn:0058,tags:tragedy,novel"]);
 	assert.equal(expected,record.fs.data);

 };
test.bookcatalog_tags_some_will_give_use_add_or_remove = function (){
	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India"}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
 	var expected = "please use add,remove operations for tag";
    var actual = record.modifyCatalog(["tags","some","isbn:0058,tags:tragedy,novel"]);
 	assert.equal(expected,actual);

 };
 test.bookcatalog_tags_add_without_isbn_give_mention_isbn_and_tag = function (){
 	var expected = "please mention isbn and tag"
 	assert.equal(expected,record.modifyCatalog(["tags","add",""]));
 };
test.bookcatalog_tags_add_will_overwrite_existing_tag_if_tag_is_allready_present = function (){
	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    record.modifyCatalog(["tags","add","isbn:0058,tags:tragedy,novel"]);
 	var expected = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
 	assert.equal(expected,record.fs.data);

 };
test.bookcatalog_tags_remove_will_keep_tags_as_it_is_if_tag_is_not_present = function (){
	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    record.modifyCatalog(["tags","remove","isbn:0058,tags:novel,books,tragedy,suraj"]);
 	var expected = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
 	assert.equal(expected,record.fs.data);

 };
test.bookcatalog_removetag_will_remove_the_tags_from_book = function(){
	record.fs.data = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written","tragedy","novel"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
    var expected = '{"isbn":"0058","price":"240","author":"jhumpa Lahiri",'+
                  '"title":"The Namesake","publisher":"Harper Collins India","tags":["written"]}'+
                 '\r\n{"isbn":"00258","price":"2405","author":"jhumpa Lahiri",'+
                 '"title":"The Namesake","publisher":"Harper Collins India"}\r\n';
        record.modifyCatalog(["tags","remove","isbn:0058,tags:tragedy,novel"]);
 	
 	assert.equal(expected,record.fs.data);

};
test.input_is_not_given_then_help_will_be_suggested = function(){

	var expected = "bookcatalog: Invalid option:  "+
	        "\n Try  \'bookcatalog --help\' for more Information";	
	        assert.equal(expected,record.modifyCatalog([]));
};
test.if_we_search_by_separator_it_will_not_show_any_book = function(){
	var expected = "Invalid field to search";
	assert.equal(expected,record.modifyCatalog(["search","-"]));
};
exports.test = test;