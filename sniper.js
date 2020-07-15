// ==UserScript==
// @name Gamdom Discord
// @version 0.1
// @description lists gamdom items to webhook
// @copyright 2020+, Sampli
// @match https://gamdom.com/marketplace/P2P
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
var webhookURL = ""

var request = new XMLHttpRequest();
request.open("POST", webhookURL, true);
request.setRequestHeader('Content-type', 'application/json');

var settings = {
  'name': 'Sampli', // set your name for the memes
  'coins': 1500000, // set the amount of coins you have.
  'lowestPrice': 6000, // set the price of the lowest items you wish to go for.
  'highestPrice': 1500000, // set the price of the highest items you wish to go for.
  'loopTime': 10000 // set how often you wish to recheck for new items. time is in milliseconds.
}
var prices = new Array();
var items = new Array();
var itemLoop = null;
var hasSent = [];
var embed = null;

function start(){ // function to start polling the site.
  itemLoop = setInterval(function () {
      gamdom();
  }, settings.loopTime);
}

function stop(){ // function to stop polling site once item is incoming.
  clearInterval(itemLoop);
  itemLoop = null;
}

function gamdom(){
  var request = new XMLHttpRequest();
  request.open("POST", "https://discordapp.com/api/webhooks/711750422246850659/15opOmfRAzZIm0dkZAJeratKuRg_bZKuYTwZGHaI4c0DVzW3wtjrCwBW32CfMRfmKoBs", true);
  request.setRequestHeader('Content-type', 'application/json');

  var elements = $(".price"); // get all the prices on page
  for(var i=0;i<elements.length;i++){
    var itemCount = $(elements[i]).parent().parent().find('.bundle_count').html() //get the name of the item cell, either ITEM or ITEMS
    var itemPrice = Number($(elements[i]).html().replace(/\s+/g, '')) // format the price of item correctly, gamdom likes to be smart and make it a string with spaces...
    var itemTitle = $(elements[i]).parent().parent().parent().find('.wea_name').html();
    var itemWear = $(elements[i]).parent().parent().parent().find('.wea_sub').html();
    if(hasSent.includes(itemPrice) || itemPrice > settings.coins || itemPrice > settings.highestPrice || itemPrice < settings.lowestPrice || itemCount.includes('ITEMS')){ // Check if item meets buy paramaters, or has multiple items in order
    } else{
      var itemPicture = $(elements[i]).parent().parent().parent().find('.item_gfx_1').attr('style').replace('background-image: url("','').replace('");','');
      var hasSentName = $(elements[i]).parent().parent().parent().find('.item_gfx_1').attr('title');
      hasSent.push(itemPrice);
      embed = {
        color: 64012,
        title: "New Item Found",
        thumbnail: {
          url: itemPicture
        },
        fields: [
          {
            name: 'ITEM NAME:',
            value: itemTitle
          },
          {
            name: 'ITEM WEAR:',
            value: itemWear
          },
          {
            name: 'ITEM PRICE:',
            value: itemPrice+' coins'
          }
        ]
      }
      console.log(embed);
      request.send(JSON.stringify({
        username: "Sniper Bot",
        avatar_url: "https://steamuserimages-a.akamaihd.net/ugc/847092778086784200/6B8FF7E797A975A8B3C21B780DC0BB8B01FB46BF/",
        content: '',
        embeds: [embed]
      }));
      embed = null;
    }
  }
}

$(document).ready(function() {
  var loggedIn = {
    color: 44794,
    title: "Bot Successfully Logged In",
    description: 'Lets get this bread'+settings.name
  }
  request.send(JSON.stringify({
    username: "Sniper Bot",
    avatar_url: "https://steamuserimages-a.akamaihd.net/ugc/847092778086784200/6B8FF7E797A975A8B3C21B780DC0BB8B01FB46BF/",
    content: '',
    embeds: [loggedIn]
  }));
  setTimeout(function () { // wait 5.5 seconds for site to load.
    alert('Gamdom autobuy script initialized. Welcome '+ settings.name);
    start();
  }, 5000);
});
