import $ from 'jquery';
import foundation from 'foundation';

// Import class 
import HelloWorld from "./components/HelloWorld";

// Import template
import post from "./templates/post.html";

$(document).foundation();
let d = new HelloWorld();
let data = {
    message : d.sayHello()
};

$(() => {
    $("body").append(post(data));
});