const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON and url-encoded bodies
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://buyandgrabv.vercel.app","http://localhost:3000"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
    
}))
app.use(bodyParser.urlencoded({ extended: true }));

// Initial route
app.get('/', (req, res) => {

  res.send('Welcome to the Express.js server!');
});



// New route for fetching data from CoinMarketCap API
app.get('/fetch/latest', async (req, res) => {
    const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
    const url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/trending/latest';
  
    try {
      const response = await axios.get  (url, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
      });
  
      // success
      const data = response.data.data.data;
      res.json(data);
    } catch (error) {
      // error
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });



// New route for fetching data from CoinMarketCap API
app.get('/fetch/most-visited', async (req, res) => {
    const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
    const url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/trending/most-visited';
  
    try {
      const response = await axios.get(url, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
      });
  
      // success
      const json = response.data;
      res.json(json);
    } catch (error) {
      // error
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });



// New route for fetching data from CoinMarketCap API
app.get('/fetch/gainers-losers', async (req, res) => {
    const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
    const url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/trending/gainers-losers';
  
    try {
      const response = await axios.get(url, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
        },
      });
  
      // success
      const json = response.data;
      res.json(json);
    } catch (error) {
      // error
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });




  app.get("/getMeme" , async(req , res) =>{
        const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
        const url = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/trending/latest?time_period=30d";
        const response = await axios.get(url, {
            headers: {
              'X-CMC_PRO_API_KEY': apiKey,
            },
          });
      
        const data = response.data.data
        console.log({data})

        const memecoins = [];
        data.data.forEach(item => {

            if (item.symbol.endsWith("ax3l")) {
                memecoins.push(item);
                console.log({item})
            }
            
        })

        res.json({length : data.data.length , data : data.data})
    //   const memecoins = await getTrendingMemecoins();
      
    //   for (const memecoin of memecoins) {
    //     console.log(memecoin.name, memecoin.symbol, memecoin.price_usd);
    //   }
  })

// 404 Route - Page Not Found
app.use((req, res, next) => {
  res.status(404).send('404 - Page Not Found'); 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
