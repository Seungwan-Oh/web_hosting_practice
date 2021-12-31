var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
////////////////// Selector Objects
var Selector = /** @class */ (function () {
    function Selector(name, selector) {
        this.name = name;
        this.target = document.querySelectorAll(selector);
        Selector.instances[this.name] = this;
    }
    Selector.prototype.set_color = function (color) {
        this.target.forEach(function (selector) { selector.style.color = color; });
    };
    Selector.prototype.set_background_color = function (color) {
        this.target.forEach(function (selector) { selector.style.backgroundColor = color; });
    };
    Selector.prototype.set_text = function (text) {
        this.target.forEach(function (selector) { selector.innerHTML = text; });
    };
    Selector.instances = {};
    return Selector;
}());
var body = new Selector('body', 'body');
var buttons = new Selector('buttons', '.toggle');
var article = new Selector('article', 'article');
var nav = new Selector('nav', '#nav');
var anchors = new Selector('anchors', 'a');
////////////////// AJAX
function fetch_file(link, selector, parse) {
    if (parse === void 0) { parse = function (str) { return str; }; }
    return __awaiter(this, void 0, void 0, function () {
        var response, text, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(link)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Error status ' + response.status);
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    selector.set_text(parse(text));
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// parse list file into html
function parse_list(list) {
    var items = list.split(',');
    items = items.map(function (item) { return '<li><a href="#!' + item + '" onclick="fetch_file(\'Paragraphs/' + item + '\', article);set_active(\'' + item + '\');">' + item + '</a></li>'; });
    return items.join('');
}
// load list & paragraph(if hashbang exists)
fetch_file("list", nav, parse_list)
    .then(function () { anchors.target = document.querySelectorAll('a:not(#active)'); }); // update anchor object
if (document.location.hash) {
    fetch_file("Paragraphs/" + document.location.hash.substr(2), article);
}
////////////////// Toggle night/day mode
var selector_methods = [
    "body.set_background_color",
    "body.set_color",
    "buttons.set_text",
    "anchors.set_color"
];
var method_arguments = {
    // button_text : method_args_array
    "night": ['black', 'white', 'day', 'powderblue'],
    "day": ['white', 'black', 'night', 'black']
};
function toggle_mode(self, methods, method_args) {
    var button_text = self.innerHTML;
    var method_args_array = method_args[button_text];
    // apply actions
    methods.forEach(function (method_str, index) {
        var split_method = method_str.split('.');
        var selector = Selector.instances[split_method[0]];
        var method = split_method[1];
        var argument = method_args_array[index];
        selector[method](argument);
    });
}
////////////////// set id of current link active (not necessary)
function set_active(list_item) {
    document.querySelectorAll('a').forEach(function (anchor) {
        if (anchor.innerHTML === list_item) {
            anchor.id = "active";
            anchor.style.color = ''; // to fix color disorder
        }
        else {
            anchor.id = "";
            buttons.target[0].innerHTML === 'night' ? anchor.style.color = 'black' : anchor.style.color = 'powderblue'; // to fix color disorder
        }
    });
    anchors.target = document.querySelectorAll('a:not(#active)'); // update anchor object
}
