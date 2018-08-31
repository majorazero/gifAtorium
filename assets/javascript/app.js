let apikey = "VHi8AqnqicsB04oW6P1Vj8bjeIGMXBrc";
let topics = ["reactions", "scoot", "spooky",
              "sloth","cats","nope","nigel"];
//we'll write the topic button generator
for (let i = 0; i < topics.length; i++){
  let butt = $("<button>");
  butt.html("<h2>"+topics[i]+"</h2>");
  $(butt).on("click",function(){
    //console.log($(this).text());
    $.ajax({
      url: "http://api.giphy.com/v1/gifs/search?q="+$(this).text()+"&api_key="+apikey+"&limit=10",
      method: "GET"
    }).then(function(response){
      //clears previous topics
      $("#gifGallery").empty();
      //this is where we'll construct our picture html
      //will create 10 of these
      for(let i = 0; i < 10; i++){
        let pictureFrame = $("<div>");
        //we'll set a custom attribute
        pictureFrame.attr("isMoving",false);
        pictureFrame.attr("stillSrc",response.data[i].images["fixed_height_still"].url);
        pictureFrame.attr("animateSrc",response.data[i].images["fixed_height"].url);
        $(pictureFrame).append("<img src='"+pictureFrame.attr("stillSrc")+"' />");
        //add the click image functionality
        pictureFrame.on("click",function(){
          //if attribute is moving
          if($(this).attr("isMoving") === "false"){
            $(this).attr("isMoving","true");
            //this series of wierd code is written to prevent a clipping issue when loading images.
            let movingImg = $("<img>").attr("src",$(this).attr("animateSrc"));
            let thisButton = this;
            $(movingImg).on("load",function(){
              $(thisButton).html(this);
            });
          }
          else{
            $(this).attr("isMoving","false");
            $(this).html("<img src='"+pictureFrame.attr("stillSrc")+"' />");
          }
        });
        $("#gifGallery").append(pictureFrame);
      }
    });
  });
  $("#topicBar").append(butt);
}
