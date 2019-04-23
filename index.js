console.log("---> Running");

const cheerio = require('cheerio');
const request = require('request');
const download = require('image-downloader');
const fs = require('fs');

const homepage = {
url : "https://EXAMPLE.COM", // Replace EXAMPLE.COM with your own homepage
	headers: {
		'User-Agent': 'request'
	}
};

request(homepage, function (error, response, html) { // Get homepage dom
	console.log('error:', error); // Print the error if one occurred
  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    // get gallery page links from homepage
    const paths = $(".item > a"); // find all gallery links
	let pathlists = [];
	for (var i = 0; i < paths.length; i++) {
	    var path = paths[i];
	    pathlists.push($(path).attr("href")); // store each url
		};

	//iterate over each gallery page
	for (var i = 0; i < pathlists.length; i++) {
	    const subpage = pathlists[i]; // used for http, mkdir, and download dest
	    const fold = subpage.slice(1,-1);
	    fs.mkdir(fold, function(err) {  // make local directory to receive downloads later
	    	if (err) {
	    		console.log(err);
	    	} else {
	    		console.log("created dir: " + fold);
	    	}
	    });

		const gallerypage = {
		url : "https://www.EXAMPLE.COM" + subpage, // Replace EXAMPLE.COM with your own homepage
			headers: {
				'User-Agent': 'request'
			}
		};

		request(gallerypage, function (error, response, html) {  // Get subpage dom
		console.log('error:', error); // Print the error if one occurred
	  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

		  if (!error && response.statusCode == 200) {
		    var $ = cheerio.load(html);
		    const images = $(".gallery-item > img");  //find gallery image links

			//collect image links and format to og quality
			for (var i = 0; i < images.length; i++) {
			    var image = images[i];
			    let imgAlt = $(image).attr("alt"); // Matches img file name if unaltered
			    let imgUrl = $(image).attr("data-src") + '?format=original'; // Get original, unresized img
			    let destPath = subpage.slice(1); // Get rid of slash

			//download images
			options = {
			  url: imgUrl,
			  dest: (destPath + imgAlt),        // Save to /path/to/dest/photo.jpg
			  headers: {
				'User-Agent': 'request'
				}
			}
			 
			download.image(options)
			  .then(({ filename, image }) => {
			    console.log('File saved to', filename)
			  })
			  .catch((err) => {
			    console.error(err)
			  })
			};
	  		}
	  	})
	}
  }
});

