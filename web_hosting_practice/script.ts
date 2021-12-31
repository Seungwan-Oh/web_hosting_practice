////////////////// Selector Objects
class Selector {
    
    static readonly instances:object = {}
    
    name: string;
    target: NodeListOf<Element>;
    constructor(name: string, selector: string)
    {
        this.name = name;
        this.target = document.querySelectorAll(selector);
        Selector.instances[this.name] = this;
    }
    
    set_color(color: string): void
    {
        this.target.forEach((selector:HTMLElement):void => {selector.style.color = color});
    }

    set_background_color(color: string): void
    {
        this.target.forEach((selector:HTMLElement):void => {selector.style.backgroundColor = color});
    }    
    
    set_text(text: string): void
    {
        this.target.forEach((selector:HTMLElement):void => {selector.innerHTML = text});
    }    
}

const body = new Selector('body', 'body');
const buttons = new Selector('buttons', '.toggle');
const article = new Selector('article', 'article');
const nav = new Selector('nav', '#nav');
let anchors = new Selector('anchors', 'a');

////////////////// AJAX

async function fetch_file(link:string, selector: Selector, parse = (str:string) => str)
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
    } catch(e)
    {
        console.log(e);
    }
}

// parse list file into html
function parse_list(list: string): string
{
  let items: string[] = list.split(',');
  items = items.map((item: string) => '<li><a href="#!'+ item + '" onclick="fetch_file(\'Paragraphs/' + item + '\', article);set_active(\''+item+'\');">' + item + '</a></li>' );
  return items.join('');  
}

// load list & paragraph(if hashbang exists)
fetch_file("list", nav, parse_list)
    .then(() => {anchors.target = document.querySelectorAll('a:not(#active)');});  // update anchor object

if(document.location.hash)
{
  fetch_file("Paragraphs/" + document.location.hash.substr(2), article);
}


////////////////// Toggle night/day mode
const selector_methods: string[] = [
    "body.set_background_color",
    "body.set_color",
    "buttons.set_text",
    "anchors.set_color"
];

const method_arguments: Record<string, string[]> = {
    // button_text : method_args_array
    "night": ['black', 'white', 'day', 'powderblue'],
    "day": ['white', 'black', 'night', 'black'],
}

function toggle_mode(self: HTMLElement, methods: string[], method_args: object): void
{
    const button_text: string = self.innerHTML;
    const method_args_array: string[] = method_args[button_text];
    
    // apply actions
    methods.forEach((method_str:string, index:number) => {
        const split_method: string[] = method_str.split('.');
        const selector: Selector = Selector.instances[split_method[0]];
        const method: string = split_method[1];
        const argument: string = method_args_array[index];
        
        selector[method](argument);
    })
    
}


////////////////// set id of current link active (not necessary)
function set_active(list_item:String):void
{
    document.querySelectorAll('a').forEach((anchor:HTMLAnchorElement) => {
    if(anchor.innerHTML === list_item)
    {
      anchor.id = "active";
      anchor.style.color = '';  // to fix color disorder
    } else
    {
      anchor.id = "";
      buttons.target[0].innerHTML === 'night'? anchor.style.color = 'black' : anchor.style.color = 'powderblue';  // to fix color disorder
    }
    });
    anchors.target = document.querySelectorAll('a:not(#active)');  // update anchor object
}