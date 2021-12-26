'use strict';

////////////////// Class Selector 
class Selector {
  
  constructor(selector)
  {
    this.target = document.querySelectorAll(selector);
  }
  
  set_color(color)
  {
    this.target.forEach(selector => selector.style.color = color);
  }
  
  set_background_color(color)
  {
    this.target.forEach(selector => selector.style.backgroundColor = color);
  }
  
  set_text(text) 
  {
    this.target.forEach(selector => selector.innerHTML = text);
  }
  
}

const body = new Selector('body');
const buttons = new Selector('.toggle');
const article = new Selector('article');
const nav = new Selector('#nav');
let anchors = new Selector();

////////////////// AJAX

async function fetch_file(link, selector, parse = (str) => str)
{
  try
  {
    
    const response = await fetch(link);
    if (!response.ok)
    {
      throw new Error('Error status ' + response.status);
    }
    const text = await response.text();
    selector.set_text(parse(text));
    
    return text;
    
  } catch(e)
  {
    console.log(e);
  }
  
}

// parse list file into html
function parse_list(list)
{
  var items = list.split(',');
  items = items.map(item => '<li><a href="#!'+ item + '" onclick="fetch_file(\'Paragraphs/' + item + '\', article);set_active(\''+item+'\');">' + item + '</a></li>' );
  return items.join('');  
}

// load list & paragraph(if hashbang exists)
fetch_file("list", nav, parse_list)
  .then(() => {update_anchor();});
  
function update_anchor()
{
  anchors.target = document.querySelectorAll('a:not(#active)');
  selectors_to_toggle[selectors_to_toggle.length-1] = anchors;
}

if(document.location.hash)
{
  fetch_file("Paragraphs/" + document.location.hash.substr(2), article);
}


////////////////// Toggle night/day mode
const selectors_to_toggle = [body, buttons, anchors];  // anchors should be the last element 
const selector_methods = [
  ["set_background_color", "set_color"],
  ["set_text"],
  ["set_color"]
];
const method_arguments = {
  // button_text : args_array
  "night": [['black', 'white'], ['day'], ['powderblue']],
  "day": [['white', 'black'], ['night'], ['black']]
} ;

function toggle_mode(self, selectors, methods, method_args)
{
  
  const button_text = self.innerHTML;
  const args_array = method_args[button_text];
  
  // apply actions
  try
    {
    selectors.forEach((selector, outer_idx) => {
      methods[outer_idx].forEach((method, inner_idx) => {
        const arg = args_array[outer_idx][inner_idx];
        selector[method](arg);
      });
    });
  } catch (e) {
    console.log(e);
  }
  
}


////////////////// set id of current link active (not necessary)
function set_active(item)
{
  document.querySelectorAll('a').forEach((anchor) => {
    if(anchor.innerHTML === item)
    {
      anchor.id = "active";
      // to fix color disorder
      anchor.style = "";
    } else
    {
      anchor.id = "";
      // to fix color disorder
      buttons.target[0].innerHTML === 'night'? anchor.style.color = 'black' : anchor.style.color = 'powderblue';
    }
  });
  update_anchor();
}