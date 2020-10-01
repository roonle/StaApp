$(document).ready(start);
var stopId1;
var stopId2;
var stopId3;
var stopId4;
var numStops;
var badging;

var subBadge = "0";
var subpower = "0";

var aAndDCounter=0;

function start(){
 
  
}
function setNumberStops(){
  numStops = document.getElementById("selectNumStop").value; 
  $("#hideSelect").hide();
  if(numStops == 1){
    $("#stopForm1").show();
  }else if(numStops == 2){
    $("#stopForm2").show();
  }else if(numStops == 3){
    $("#stopForm3").show();
  }else if(numStops == 4){
    $("#stopForm4").show();
  }

}

function changeColor(){
  var color1 = "#861212";   //EWU
  var color2 = "#0090becc";  //STA
  var color3 = "#ff00007a";  //XMAS
  var color4 = "#a5472a";     //TURKEY

  var borderColor1 = "#808080"; //EWU
  var borderColor2 = "#8ec038cc"; //STA
  var borderColor3 = "#008000"; //XMAS
  var borderColor4 = "#ffff00";  //TURKEY

  var textColor1 = "#ffffff";

  if(badging === "EWU"){
  $(":root").css("--background-color", color1);
  $(":root").css("--border-color", borderColor1);
  $("#image").css("content", "url(Ewu.jpg)");
  $(":root").css("--font-color", textColor1);
  }
  else if(badging === "STA"){
    $(":root").css("--background-color", color2);
    $(":root").css("--border-color", borderColor2);
    $("#image").css("content", "url(Sta.jpg)");
  }
  else if(badging === "XMAS"){
    $(":root").css("--background-color", color3);
  $(":root").css("--border-color", borderColor3);
  $("#image").css("content", "url(Xmas.jpg)");
  }
  else if(badging === "TURKEY"){
    $(":root").css("--background-color", color4);
  $(":root").css("--border-color", borderColor4);
  $("#image").css("content", "url(Turkey.png)");
  }
}

function setBadging(){
  
  badging = $("#selectBadging").val();
  
  $("#hideBadging").hide();
  subBadge = "1"
    if(subBadge === "1" && subpower === "1"){
      aAndDTimer();
      setInterval(aAndDTimer,10000);
    $("#mainBody").show();
    changeColor();
  }
}

function setStops(){

  if(numStops == 1){
    stopId1 = $("#1txt1").val();
  }else if(numStops == 2){
    stopId1 = $("#1txt2").val();
    stopId2 = $("#2txt2").val();
  }else if(numStops == 3){
    stopId1 = $("#1txt3").val();
    stopId2 = $("#2txt3").val();
    stopId3 = $("#3txt3").val();
    
  }else if(numStops == 4){
    stopId1 = $("#1txt4").val();
    stopId2 = $("#2txt4").val();
    stopId3 = $("#3txt4").val();
    stopId4 = $("#4txt4").val();
  }
   $(".hideTextBox").hide();
    
   
    
    $("#startup").hide();

    subpower = "1";

   if(subpower === "1" && subBadge === "1"){
    aAndDTimer();
    setInterval(aAndDTimer,10000);
    
      $("#mainBody").show();
      changeColor();
      
     
    }
    
    
    
}

function aAndDTimer(){
  aAndDCounter++;
  var num=aAndDCounter%numStops;
  if(num==0){
	  num=numStops;
  }
  var useId="stopId"+num.toString();
  
  if(useId=="stopId1"){
    getArrivalAndDepartureFromStop(stopId1);
    getStopInfo(stopId1);
  }else if(useId=="stopId2"){
    getArrivalAndDepartureFromStop(stopId2);
    getStopInfo(stopId2);
  }else if(useId=="stopId3"){
    getArrivalAndDepartureFromStop(stopId3);
    getStopInfo(stopId3);
  }else if(useId=="stopId4"){
    getArrivalAndDepartureFromStop(stopId4);
    getStopInfo(stopId4);
  }
}

function getArrivalAndDepartureFromStop(stopId){
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://cors-anywhere.herokuapp.com/http://52.88.188.196:8080/api/api/where/arrivals-and-departures-for-stop/"+stopId+".json?key=TEST",
      "method": "GET",
      "headers": {
        "cache-control": "no-cache",
        "Postman-Token": "9b850799-1b12-44cc-884c-bd19503bc61f",
        "X-Requested-With": "application/json"
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      paintData(response);
    });
}
function paintData(res){
  $("#arrival").empty();
  $("#departure").empty();


  res["data"]["entry"]["arrivalsAndDepartures"].sort(function(a,b){
    if(a.arrivalEnabled&&b.arrivalEnabled){
      return a.predictedArrivalTime-b.predictedArrivalTime;
    }else if(a.arrivalEnabled&&b.departureEnabled){
      return a.predictedArrivalTime-b.predictedDepartureTime;
    }else if(a.departureEnabled&&b.arrivalEnabled){
      return a.predictedDepartureTime-b.predictedArrivalTime;
    }else{
      return a.predictedDepartureTime-b.predictedDepartureTime;
    }

  });


  for(var i=0;i<res["data"]["entry"]["arrivalsAndDepartures"].length;i++){
    var nameLong=res["data"]["entry"]["arrivalsAndDepartures"][i]["routeLongName"];
    var nameShort=res["data"]["entry"]["arrivalsAndDepartures"][i]["routeShortName"];
    console.log(i);
    if(res["data"]["entry"]["arrivalsAndDepartures"][i]["arrivalEnabled"]){
      var date=new Date(res["data"]["entry"]["arrivalsAndDepartures"][i]["predictedArrivalTime"]);
      var time=getTime(date);
      var alert=alertNeeded(date);
      console.log(alert);
      if(alert=="true"){
        var str="Arrival: "+time+" Route: "+nameLong+" - "+nameShort+" Alert: Will be Arriving Shortly";
      }else if(alert=="false"){
        var str="Arrival: "+time+" Route: "+nameLong+" - "+nameShort;
      }
      displayArrival(str);
    }else if(res["data"]["entry"]["arrivalsAndDepartures"][i]["departureEnabled"]){
      var date=new Date(res["data"]["entry"]["arrivalsAndDepartures"][i]["predictedDepartureTime"]);
      var time=getTime(date);
      var alert=alertNeeded(date);
      console.log(alert);
      if(alert=="true"){
        var str="Departure: "+time+" Route: "+nameLong+" - "+nameShort+" Alert: Will be Departing Shortly";
      }else if(alert=="false"){
        var str="Departure: "+time+" Route: "+nameLong+" - "+nameShort;
      }
      displayDeparture(str);
    }
  }
}
function displayArrival(str){
  var para=document.createElement("P");
  para.innerHTML=str;
  $("#arrival").append(para);
}
function displayDeparture(str){
  var para=document.createElement("P");
  para.innerHTML=str;
  $("#departure").append(para);
}
function getTime(date){
  var hours=date.getHours();
  var min=date.getMinutes();
  var ampm;
  if(hours==0){
    hours==12;
    ampm="AM";
  }else if(hours==12){
    ampm="PM"
  }else if(hours>12){
    hours=hours%12;
    ampm="PM";
  }else{
    ampm="AM";
  }
  if(hours<10){
	  hours="0"+hours;
  }
  if(min<10){
	  min="0"+min;
  }

  var time=ampm+" "+hours+":"+min;
  return time;
}
function alertNeeded(date){
  var curDate=new Date();
  var curHour=curDate.getHours();
  var curMin=curDate.getMinutes();
  var hour=date.getHours();
  var min=date.getMinutes();

  if(hour==curHour){
    var mDiff=min-curMin;
    if(mDiff==2||mDiff<2){
      if(mDiff>-3){
        console.log("At first true");
        return "true";
      }
    }
  }else if((hour-1)==curHour){
    if((curMin+2)%60==min||(curMin+1)%60==min){
      console.log("At second true");
      return "true";
    }
  }else{
    console.log("At false");
    return "false";
  }
  return "false";
}

function getStopInfo(stopId){

  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://cors-anywhere.herokuapp.com/http://52.88.188.196:8080/api/api/where/stop/"+stopId+".json?key=TEST",
      "method": "GET",
      "headers": {
        "cache-control": "no-cache",
        "Postman-Token": "43aa881a-62e1-4bb4-81cb-90e36352f142",
        "X-Requested-With": "application/json"
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      console.log(response["data"]["entry"]["name"]);
      $("#nameHolder").html(response["data"]["entry"]["name"]);
      $("#nameHolder").css('text-align','center');
    });
}
     