var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");

var twitterKeys = require("./keys.js")

spotifyID = "06de4a40c656415e986fea18c42f6740";
spotifySecret = "7bac93c5a2e747409ee79103d026bd64";

var spotify = new Spotify({
    id: spotifyID,
    secret: spotifySecret
});

inquirer
    .prompt([
        {
            name: "action", 
            message: "What would you like to do?",
            type: "list",
            choices: ["View my tweets", "Search Spotify for a song", 
            "Learn about a movie", "Find out about more about the song 'I Want It That Way' by NSYNC"]
        }
    ]).then(function(answers){
        if (answers.action === "View my tweets"){
            viewTweets();
        }
        else if (answers.action === "Search Spotify for a song"){
            spotifyASong();
        }
        else if (answers.action === "Learn about a movie"){
            omdbMovie();
        }
        else if (answers.action === "Find out about more about the song 'I Want It That Way' by NSYNC"){
            nsync();
        }

    });

    var viewTweets = function(){
        // console.log(twitterObject[0]);
        var client = new Twitter(twitterKeys);
        var params = {screen_name: 'LizM76455004'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            var recentTweets = tweets.slice(-20);
            if (!error) {
                for (var i= 0; i < recentTweets.length; i++){
                console.log(
                    "--------------------" + "\n"
                    + "Tweet: " + recentTweets[i].text + "\n" 
                    + "Posted at: " + recentTweets[i].user.created_at + "\n"
                    + "Posted from: " + recentTweets[i].user.location); + "\n"
                }

                // console.log(recentTweets);
            }
            else {
                console.log(error);
            }
        });

    }; 

    var spotifyASong = function(){
        inquirer.prompt([
            {
                name: "songName",
                message: "What song would like to search? "
            }
        ]).then(function(answers){
            spotify.search({type: 'track', query: answers.songName}, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                
                var song = data.tracks.items[0].name
                var artist = data.tracks.items[0].artists[0].name;
                var album = data.tracks.items[0].album.name;
                var spotifyURL = data.tracks.items[0].preview_url;

                // console.log(data.tracks.items[0]); 

                console.log("Song Name: " + song);
                console.log("Artist: " + artist);
                console.log("Album: " + album);
                console.log("Preview URL: " + spotifyURL);
                console.log("---------------------");
            });
        });
    }; 

    var omdbMovie = function() {
        inquirer.prompt([
            {
                name: "title",
                message: "Please enter movie or TV show title: "
            }
        ]).then(function(answers){
            if (answers.title === ""){
                answers.title = "Mr. Nobody"
            };
            var queryURL = "http://www.omdbapi.com/?t=" + answers.title + "&y=&plot=short&apikey=40e9cece";
            
            request(queryURL, function (error, response, body) {
                if (error){
                    console.log("Error details: " + error);
                }
                var content = JSON.parse((body),null,2);
                console.log(
                    "Movie Title: " + content.Title + "\n"
                    + "Year: " + content.Year + "\n"
                    + "IMDB Rating: " + content.imdbRating + "\n"
                    + "Rotten Tomatoes Rating: " + content.Ratings[2].Value + "\n"
                    + "Production Country or Countries: " + content.Country + "\n"
                    + "Plot: " + content.Plot + "\n"
                    + "Actors: " + content.Actors);
              });
        })
    };

    var nsync = function() {
        fs.readFile("random.txt", "utf8", function(error, data) {
              // If the code experiences any errors it will log the error to the console.
              if (error) {
                return console.log(error);
              }
              var dataArr = data.split(",");

              for (i = 0; i < dataArr.length; i++){
                spotify.search({type: 'track', query: dataArr[i]}, function(err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    var song = data.tracks.items[0].name
                    var artist = data.tracks.items[0].artists[0].name;
                    var album = data.tracks.items[0].album.name;
                    var spotifyURL = data.tracks.items[0].preview_url;
    
                    // console.log(data.tracks.items[0]); 
                    console.log("Song Name: " + song);
                    console.log("Artist: " + artist);
                    console.log("Album: " + album);
                    console.log("Preview URL: " + spotifyURL);
                    console.log("---------------------");
                });
              }
        });
    };
