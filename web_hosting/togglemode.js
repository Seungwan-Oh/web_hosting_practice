// selectors into a class
class Selector {
  
  constructor(selector){
    this.target = $(selector);
  }
  
  setColor = function(color){
    this.target.css('color', color);
  }
  
  setBackgroundColor = function(color){
    this.target.css('backgroundColor', color)
  }
  
}

// body, links, buttons into object
var Body = new Selector('body')
var Links = new Selector('a:not(#active)')
var Buttons = new Selector('.toggle')

Buttons.setText = function(str){
  this.target.html(str);
}

// function operates when button clicked 
$('.toggle').click(function toggleButton(){
  
  //if day mode now,
  if($(this).html() === 'night'){
    // change to night mode
    Body.setBackgroundColor('black');
    Body.setColor('white');
    
    // change button texts
    Buttons.setText('day');

    // change link colors
    Links.setColor('powderblue');
  
  } 
  // if night mode now,
  else {
    // change to day mode
    Body.setBackgroundColor('white');
    Body.setColor('black');

    // change button texts
    Buttons.setText('night');
    
    // change link colors
    Links.setColor('black');
  
  }          
});