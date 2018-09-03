/////////////////////////////////////////////
/// Global Variables
/////////////////////////////////////////////
let apikey = "VHi8AqnqicsB04oW6P1Vj8bjeIGMXBrc";
let topics;
let offset = 0; // this is going to stop repeating images in get more gif's
/////////////////////////////////////////////
/// Initilization
/////////////////////////////////////////////
init();
/////////////////////////////////////////////
/// Functions
/////////////////////////////////////////////
/**
* We'll check if the localStorage exists and sets the topic
* Then we'll generate our topic Bar.
*/
function init(){
  //if localStorage is empty...
  if (localStorage.getItem("topics") === null){
    topics = ["reactions", "scoot", "spooky", "sloth","cats","nope","nigel"];
  }
  //else we'll load localStorage
  else {
    topics = JSON.parse(localStorage.getItem("topics"));
  }
  pageGenerator();
}
/**
* Generates our topic bar, and gives each topic a button function
*/
function pageGenerator(){
  //clears previous buttons
  $("#topicBar").empty();
  for (let i = 0; i < topics.length; i++){
    let butt = $("<button>");
    butt.html("<h2>"+topics[i]+"</h2>");
    $(butt).on("click",function(){
      $(".activeTopic").removeClass("activeTopic");
      $(this).addClass("activeTopic");
      //well set the try again button's topic attribute to whatever the latest button press is
       $("#requestMore").attr("currentTopic",$(this).text());
       offset = 0; //resets offset
      $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?q="+$(this).text()+"&api_key="+apikey+"&limit=10",
        method: "GET"
      }).then(function(response){
        //clears previous topics
        $("#gifGallery").empty();
        gifMaker(response);
      });
    });
    $("#topicBar").append(butt);
  }
}
/**
* This function loads 10 gifs, and gives them onclick/hover functionality.
* @param {Object} response This is a JSON object our AJAX call returns
*/
function gifMaker(response){
  //this is where we'll construct our picture html
  //will create 10 of these
  for(let i = 0; i < 10; i++){
    let pictureFrame = $("<div>");
    pictureFrame.addClass("pictureFrame");
    //let's set the rating of the pic here.
    pictureFrame.append("<h2 class='gifRating'> Rating: "+response.data[i].rating+" </h2");
    //we'll set a custom attribute
    pictureFrame.attr("isMoving",false);
    //sets the image source we'll be using
    pictureFrame.attr("stillSrc",response.data[i].images["fixed_height_still"].url);
    pictureFrame.attr("animateSrc",response.data[i].images["fixed_height"].url);
    //sticks default still image on
    $(pictureFrame).append("<img class='img-fluid' src='"+pictureFrame.attr("stillSrc")+"' />");
    //add on click functionality
    pictureFrame.on("click",function(){
      $("#modalGif").empty();
      $("#modalGif").append("<img class-'imag-fluid' src='"+pictureFrame.attr("animateSrc")+"' />");
      $("#myModal").modal();
    });
    //add the hover image functionality
    pictureFrame.on("mouseenter",function(){
      //if attribute is moving
      if($(this).attr("isMoving") === "false"){
        $(this).attr("isMoving","true");
        //this series of wierd code is written to prevent a clipping issue when loading images.
        let movingImg = $("<img>").attr("src",$(this).attr("animateSrc"));
        movingImg.addClass("img-fluid");
        let thisButton = this;
        $(movingImg).on("load",function(){
          $(thisButton).children().last().remove();
          $(thisButton).append(this);
        });
      }
    }).on("mouseleave",function(){
      $(this).attr("isMoving","false");
      $(this).children().last().remove();
      $(this).append("<img class='img-fluid' src='"+pictureFrame.attr("stillSrc")+"' />");
    });
    $("#gifGallery").prepend(pictureFrame);
  }
}
/////////////////////////////////////////////
/// Event Functions
/////////////////////////////////////////////
/**
* This will give get the gifMaker to generates another 10 GIF's
*/
$("#requestMore").on("click",function(){
  if(!$("#gifGallery").is(":empty")){
    offset += 10; //we start the offset
    $.ajax({
      url: "https://api.giphy.com/v1/gifs/search?q="+$("#requestMore").attr("currentTopic")+"&api_key="+apikey+"&limit=10&offset="+offset,
      method: "GET"
    }).then(function(response){
      gifMaker(response);
    });
  }
});
/**
* This will check if the search topic is already searched for
* and if it isn't add it to the topic bar.
*/
$("#newTopicForm").submit(function(){
  event.preventDefault();
  if(topics.indexOf($("#newTopics").val()) === -1 && $("#newTopics").val() !== ""){
    //pushes latest input into the array
    topics.push($("#newTopics").val());
    //saves latest array to localStorage
    localStorage.setItem("topics",JSON.stringify(topics));
    //clears it
    $("#newTopics").html("");
    //re-runs page generator
    pageGenerator();
  }
});
