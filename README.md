# (Squarespace) Image Gallery Scraper

This is a Node.js web scraper for downloading images from a website. I made it specifically to scrape original images from a Squarespace photo portfolio site with 30+ galleries using the "Flatiron" template, but it's easily modified to any website. Give it the homepage and use CSS selectors to find subpages, find CSS selected images on those subpages, create corresponding local directories, then download images to them.

Also: Squarespace, give your users FTP access to their own site. Get it together!

## Getting Started

You need to be able to install and run node, and able to find DOM selectors on the target website. The scraper uses "request" for http, "cheerio" to traverse the DOM, "fs" to create local directories, and "image-downloader" to download images.

### Installing

```
git clone {foo} && cd img-gallery-scraper && npm i
```

"npm i" should install dependencies by default. If you run into problems, try initializing and installing more explicitly:

```
npm init -y
npm install cheerio request image-downloader
```

## How to use it

Explain how to run the automated tests for this system

### Set homepage for http requests

In index.js, set your homepage

```
url : "https://EXAMPLE.COM", // Replace EXAMPLE.COM with your own homepage
```
....
```
url : "https://www.EXAMPLE.COM" + subpage, // Replace EXAMPLE.COM with your own homepage
```

### Set selectors for paths and images

This will most likely be different for your website. Inspect your page, and presumably your gallery will have some unique nav. 

Cheerio uses JQuery, so use $ for selection. With Squarespace Flatiron template, projects have class ".item", and then I select "a" child element in order to push links into an array.

You will probably need to modify this:

```js
const paths = $(".item > a"); // find all gallery links
```

maybe not this:

```js
pathlists.push($(path).attr("href")); // store each url
````

After we go to the subpages, we want to select only gallery images. Find them, then select child images.

```js
const images = $(".gallery-item > img");  //find gallery image links
````

Because we're scraping Squarespace and they will have loaded a resized version, we want to add a parameter to the image url to download the original image.

```js
let imgUrl = $(image).attr("data-src") + '?format=original'; // Get original, unresized img
````

### Set download options

You can use default names or set names for downloaded files. Refer to Node [Image Downloader](https://www.npmjs.com/package/image-downloader) for details. 

I chose to create subdirectories that match the gallery page path and download images to them. If you run into permissions or other problems, check [fs.mkdir docs](https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback). I got hung up for a minute when I was leaving trailing path slashes.

I named images by their alt text, because in my use case that was simply the file name. You may wish to modify that:

```js
dest: (destPath + imgAlt),        // Save to /path/to/dest/photo.jpg
````

### Run it

`node index.js`

## Supporting Package Docs

 * [Cheerio.js](https://cheerio.js.org/)
 * [Request](https://www.npmjs.com/package/request)
 * [Image Downloader](https://www.npmjs.com/package/image-downloader)

 A quick google will give you plenty of tutorials on using Cheerio to scrape the web.

## License

This project is licensed under the ISC License.
