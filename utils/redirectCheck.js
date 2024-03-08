const request = require("request");
const http = require("http");
const https = require("https");
const url = require("url");

const redirectCheck = (requestUrl, callback) => {
  const parsedUrl = new URL(requestUrl);
  const protocol = parsedUrl.protocol === "https:" ? https : http;

  protocol
    .get(requestUrl, (response) => {
      let responseData = "";
      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        let statusCode = response.statusCode;
        // Accessing response headers
        const headers = response.headers;
        //creating a proper header object to access server name and other info as it's not accessible in response
        const headersObject = {};
        let rawHeaders = response.rawHeaders;
        // Loop through the array by 2 elements to extract key-value pairs
        for (let i = 0; i < rawHeaders.length; i += 2) {
          const key = rawHeaders[i];
          const value = rawHeaders[i + 1];
          headersObject[key] = value;
        }
        const istDate = new Date(headersObject.Date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const istTime = istDate.toLocaleString();

        const createdData = {
          ...headersObject,
          statusCode,
          Source: requestUrl,
          istTime
        };
        // console.log(createdData);

        callback(false,createdData);
      });
    })
    .on("error", (error) => {
      console.error("Request failed:", error.message);
    });
};

// Example usage:
// redirectCheck('https://jsonplaceholder.typicode.com/posts');
// redirectCheck("https://bmw.in");
// redirectCheck('https://www.bmw-connecteddrive.it/app/index.html?bmw=grp:bmw_it:Store');
// redirectCheck('https://www.bmw.in/en/index.html');

module.exports = redirectCheck;
