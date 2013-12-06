var gui = require('nw.gui');
var users = require('./user.js');
var libraryPath ='C:/Users/surajbab/Dropbox/step_suraj/bookcatalog/books_lib';
var library = require(libraryPath).record;
var new_win = gui.Window.get();// Create a new window and get it