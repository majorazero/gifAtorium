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
      console.log(response);
    });
  });
  $("#topicBar").append(butt);
}
