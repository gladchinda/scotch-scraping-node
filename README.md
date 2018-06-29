# scotch-scraping-node

**You can checkout the complete tutorial on Scotch: [Web Scraping Scotch: The Node Way](https://scotch.io/tutorials/web-scraping-scotch-the-node-way).**<br/><br/>

Simple app for scraping author profiles from [Scotch.io](https://scotch.io). To get started, follow the following steps:
<br/><br/>

1. **Install dependencies**   
 > The app source code contains a lot of modern JavaScript syntax and uses the following engine versions: **node** `8.9.4` and **npm** `5.6.0`. You should consider using recent versions of `node` and `npm` to run this app successfully.

```sh
npm install
```

2. **Start the server**

```sh
npm start
```

3. **Load author profile**   
 > Visit your browser or any other HTTP tool of choice (e.g [Postman](https://getpostman.com)) and make a `GET` request to the endpoint `/scotch/{author}` to fetch the profile of the author as a `JSON` response.   
 
 To fetch my Scotch profile for example, use the author name `gladchinda` as shown in the following **cURL** command.
 
 ```sh
curl -X GET http://localhost:3000/scotch/gladchinda
 ```

<br/>

**Happy Scraping!!!**   
Remember to hit the **Star** button to star this repository.
