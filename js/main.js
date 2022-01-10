


var pageHeight = document.querySelector("#startbutton").offsetHeight;
var imgHeight = document.querySelector("#image").offsetHeight;
console.log("img height:"+imgHeight);
var imgPosition = (pageHeight-imgHeight)/2;
//document.querySelector("#startbutton").style.padding-top = imgPosition;

// document.querySelector("#startbutton").style.display = 'none';
// document.querySelector("#game").style.display = 'none';
// document.querySelector("#result").style.display = 'block';
showStartPage();

var buttonNames = ["pb0","pb1","pb2","pb3","pb4","pb5","pb6","pb7","pb8","pb9"];
var buttons = document.getElementsByClassName("pushButton");
var chainCount = 0;
var imageCount = 0;
var fastTimer;
var imageTimer;
var defaultImageWidth = document.querySelector("#image").offsetWidth;

function showResult(result)
{
  document.querySelector("#startbutton").style.display = 'none';
  document.querySelector("#records").style.display = 'none';
  document.querySelector("#game").style.display = 'none';
  document.querySelector("#timer").style.display = 'none';
  document.querySelector("#result").style.display = 'block';
  document.querySelector("#window-text").innerHTML = "Time = "+result;
}

function showGame()
{
  document.querySelector("#game").style.display = 'block';
  document.querySelector("#startbutton").style.display = 'none';
  document.querySelector("#records").style.display = 'none';
  document.querySelector("#result").style.display = 'none';
  document.querySelector("#timer").style.display = 'inline';
}

function showStartPage()
{
  document.querySelector("#game").style.display = 'none';
  document.querySelector("#records").style.display = 'none';
  document.querySelector("#startbutton").style.display = 'block';
  document.querySelector("#result").style.display = 'none';
  document.querySelector("#timer").style.display = 'none';
  defaultImageWidth = document.querySelector("#image").offsetWidth;
}

function showRecordsPage()
{
  document.querySelector("#game").style.display = 'none';
  document.querySelector("#startbutton").style.display = 'none';
  document.querySelector("#records").style.display = 'block';
  document.querySelector("#result").style.display = 'none';
  document.querySelector("#timer").style.display = 'none';
}

function imageHover(image)
{
  imageTimer = setInterval(increaseImage,12);
}

function increaseImage()
{
  imageCount++;
  var image = document.querySelector("#image")
  image.style.width = (image.offsetWidth+imageCount)+"px";
  if(imageCount>10)
  {
    clearTimeout(imageTimer);
    // console.log("animation finished");
  }
}

function resetImage(image)
{
  clearTimeout(imageTimer);
  imageCount=0;
  console.log("default width:"+defaultImageWidth);
  image.style.width = defaultImageWidth+"px";
}

function on_start_clicked()
{
  showGame();
  clearTimeout(fastTimer);

  for(var i=0;i<buttons.length;i++)
  {
    const pb = buttons[i];
    pb.disabled = 0;
    pb.style.background = 'grey';
  }

  var numbers = [1,2,3,4,5,6,7,8,9,10];
  for(var i=0;numbers.length>0;i++)
  {
    var randomNumber = getRandomInt(numbers.length);
    var splicedElement = numbers.splice(randomNumber, 1)[0];
    buttons[i].innerHTML=splicedElement;
  }
  document.querySelector("#timer").innerHTML = "00:00:000";
  fastTimer = setInterval(stopWatch,5);
}

function on_stop_clicked()
{
  showStartPage();
  clearTimeout(fastTimer);
}

function on_records_clicked()
{
  showRecordsPage();
  clearTimeout(fastTimer);
}

function stopWatch()
{
  var oldTime = document.querySelector("#timer").innerHTML.split(':');
  var minutes = oldTime[0];
  var seconds = oldTime[1];
  var milliseconds = oldTime[2];
  if(milliseconds=="995")
  {
    milliseconds="000";
    if(seconds=="59")
    {
      seconds="00";
      var intMinutes = parseInt(minutes);
      intMinutes++;
      minutes=String("00" + intMinutes).slice(-2);
    }
    else
    {
      var intSeconds = parseInt(seconds);
      intSeconds++;
      seconds=String("00" + intSeconds).slice(-2);
    }
  }
  else
  {
    var intMilliseconds = parseInt(milliseconds);
    intMilliseconds=intMilliseconds+5;
    milliseconds=String("000" + intMilliseconds).slice(-3);
  }
  document.querySelector("#timer").innerHTML = minutes+':'+seconds+':'+milliseconds;
}

function getRandomInt(max)
{
  return Math.floor(Math.random() * max);
}

function userSucceeded()
{
  chainCount=0;

  for(var i=0;i<buttons.length;i++)
  {
    //const pb = document.querySelector("#"+buttonNames[i]);
    buttons[i].style.background = "#0acc00";
  }
  var endTime = document.querySelector("#timer").innerHTML;
  showResult(endTime);
}

function userFailed(count)
{
  switch(count)
  {
  case 0:
  case 2:
  case 4:
    for(var i=0;i<buttons.length;i++)
    {
      const pb = buttons[i];
      pb.style.background = 'grey';
      if(count==0)
        pb.disabled = 1;
      else if(count==4)
        pb.disabled = 0;
    }
    break;
  case 1:
  case 3:
    for(var i=0;i<buttons.length;i++)
      buttons[i].style.background = 'red';
    break;
  }
  count++;
  if(count<5)
    setTimeout(userFailed, 400, count);
}

function on_pb_clicked(thisButton)
{
  //console.log(thisButton.innerHTML);
  chainCount++;
  if(thisButton.innerHTML==chainCount)
  {
    thisButton.style.background = 'blue';
    if(chainCount==10)
    {
      for(var i=0;i<buttons.length;i++)
      {
        //const pb = document.querySelector("#"+buttonNames[i]);
        buttons[i].disabled = 1;
      }
      clearTimeout(fastTimer);
      setTimeout(userSucceeded, 400);
    }
  }
  else
  {
    userFailed(0);
    chainCount=0;
  }
}

function on_pushButton_close()
{
  document.querySelector(".hystmodal").style.display = 'none';
}
