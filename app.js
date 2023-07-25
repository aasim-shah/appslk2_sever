const express = require('express');
const bodyParser = require('body-parser');

const cors = require("cors")
const axios = require('axios');
const { Web3 } = require('web3');
// const os = require('os');
// const net = require('net');

const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
// const ethers = require("ethers")

const app = express();
const web3 = new Web3("https://mainnet.infura.io/v3/3ada41439dc8493d98ef08873b1f8b26");

const infuraKey  = "3ada41439dc8493d98ef08873b1f8b26"
// const endpoint = "https://fabled-wiser-tree.discover.quiknode.pro/9290e904b3d8dfec35d8e209d1189ca50778bb8d/"

const PORT = process.env.PORT || 5000;





// Parse JSON and url-encoded bodies
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://buyandgrabv.vercel.app", "http://localhost:3000"],

}))
app.use(bodyParser.urlencoded({ extended: true }));
 Moralis.start({
    // apiKey: "c5a8089e-911d-4a46-92c9-86f128519c23",
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkyNDM3MzZjLTQ2ZWUtNDFjOS1hOWRmLTQxOTc0YzEyMjEzNyIsIm9yZ0lkIjoiMzQ5NzI5IiwidXNlcklkIjoiMzU5NDY5IiwidHlwZUlkIjoiYzVhODA4OWUtOTExZC00YTQ2LTkyYzktODZmMTI4NTE5YzIzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTAxMzgzMTIsImV4cCI6NDg0NTg5ODMxMn0.ifxAO0Ouu49U9wAwP0UZKzPOJtom0mouiiOCXDqR6Zs",
    // ...and any other configuration
  }).then(res =>{
    console.log('Moralis is      running')
  });


// Initial route
app.get('/fetch/token_holders/:tokenId/:blockCount', async (req, res) => {

    console.log(req.params)
    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key   
    const { tokenId, blockCount } = req.params
    const findBlockNumber =  await axios.get(`https://appslk-second.onrender.com/findBlockNumber/${tokenId}`)
    const CoinBlockNumber = findBlockNumber.data
    
    const NumBlockCount = parseInt(blockCount) + parseInt(CoinBlockNumber)
    console.log(NumBlockCount)
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/tokens/${tokenId}/token_holders_v2/?block-height=${NumBlockCount ? NumBlockCount : "7644841"}`;   

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then((response) => {
            console.log(response.data);
            return res.status(200).json({data : response.data.data.items  , CoinBlockNumber });
        })
        .catch((error) => {
            console.error('Error making the API call:', error.message);
        });

});



app.get('/fetch/transactions/:wallet_address/:contract_address', (req, res) => {

    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    // const address = '0x781229c7a798c33ec788520a6bbe12a79ed657fc'; 
    const { wallet_address, contract_address } = req.params
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/address/${wallet_address}/transfers_v2/?contract-address=${contract_address}`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then((response) => {
            console.log(response.data);
            res.send(response.data.data)
        })
        .catch((error) => {
            console.error('Error making the API call:', error);
        });


})



// New route for fetching data from CoinMarketCap API
app.get('/fetch/map', async (req, res) => {
    const { id } = req.params
    // const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'; //test keys
    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=400`
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

        // success
        console.log({ response: response.data })
        const data = response.data.data;
        res.send(data);
    } catch (error) {
        // error
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});






// New route for fetching data from CoinMarketCap API
app.get('/fetch/latestWithPlatform/:platform/:limit', async (req, res) => {
    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    console.log(req.params)
    const coinsWithPlatform = [];
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${req.params.limit}`
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

        // success
        const data = response.data.data;
        data.forEach(item => {
            if (item.platform && item.platform.name === req.params.platform) {
                coinsWithPlatform.push(item)
            }
        })
        res.json(coinsWithPlatform);
    } catch (error) {
        // error
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});
// New route for fetching data from CoinMarketCap API
app.get('/fetch/latestWithoutPlatform/:limit', async (req, res) => {
    const nnlimit = Number(req.params.limit)

    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${nnlimit}`

    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

        // success
        const data = response.data.data;
        res.json(data);
    } catch (error) {
        // error
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});





app.get("/fetch/tokenwise_inflows" , async (req ,res) => {
  const address = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
//   const address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.token.getTokenTransfers({
    address,
    chain,
  });
const dataa = response.toJSON()



function parseISODate(timestamp) {
  return new Date(timestamp);
}

// Function to round the time to the nearest 1 hour
function roundToNearestHour(timestamp) {
  const date = new Date(timestamp);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  date.setHours(date.getHours() - (date.getHours() % 1));

  return date;
}
function roundToNearest3Hours(timestamp) {
    const date = new Date(timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(date.getHours() - (date.getHours() % 3));
    return date;
  }

  // Function to round the time to the nearest 24 hours
function roundToNearest24Hours(timestamp) {
    const date = new Date(timestamp);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(0);
    return date;
  }
// Function to group data by 1-hour timeframe
function groupDataBy1Hour(data) {
    const groupedData = {};
    data.forEach(entry => {
      const timestamp = parseISODate(entry.block_timestamp);
      const roundedHour = roundToNearestHour(timestamp);
  
      // Create a unique key for the 1-hour timeframe
      const key = roundedHour.toISOString();
  
      // Calculate the sum of values for the 1-hour timeframe
      if (!groupedData[key]) {
        //   groupedData[key] = 0;
        groupedData[key] = {
            value: 0,
            decimal_1h: 0, // New field for another value for 1-hour timeframe
          };
      }
    //   groupedData[key] += parseFloat(entry.value);
    groupedData[key].value += parseFloat(entry.value);
    groupedData[key].decimal_1h += parseFloat(entry.token_decimals); // Assuming you have another_value field in the data
    });
  
    return groupedData;
  }

// Function to group data by 3-hour timeframe
function groupDataBy3Hours(data) {
    const groupedData = {};
    data.forEach(entry => {
      const timestamp = parseISODate(entry.block_timestamp);
      const roundedHour = roundToNearestHour(timestamp);
      const rounded3Hour = new Date(roundedHour);
      rounded3Hour.setHours(roundedHour.getHours() - (roundedHour.getHours() % 3));
  
      // Create a unique key for the 3-hour timeframe
      const key = rounded3Hour.toISOString();
  
      // Calculate the sum of values for the 3-hour timeframe
      if (!groupedData[key]) {
        // groupedData[key] = 0;
        groupedData[key] = {
            value: 0,
            decimal_3h: 0, // New field for another value for 1-hour timeframe
          };
        
      }
    //   groupedData[key] += parseFloat(entry.value);
    groupedData[key].value += parseFloat(entry.value);
    groupedData[key].decimal_3h += parseFloat(entry.token_decimals); // Assuming you have 
    });
  
    return groupedData;
  }
  function groupDataBy24Hours(data) {
    const groupedData = {};
    data.forEach(entry => {
      const timestamp = parseISODate(entry.block_timestamp);
      const rounded24Hours = roundToNearest24Hours(timestamp);
  
      // Create a unique key for the 24-hour timeframe
      const key = rounded24Hours.toISOString();
  
      // Calculate the sum of values for the 24-hour timeframe
      if (!groupedData[key]) {
        // groupedData[key] = 0;
        groupedData[key] = {
            value: 0,
            decimal_24h: 0, // New field for another value for 1-hour timeframe
          };
        
      }
    //   groupedData[key] += parseFloat(entry.value);
    groupedData[key].value += parseFloat(entry.value);
    groupedData[key].decimal_24h3 += parseFloat(entry.token_decimals); // Assuming you have 
    });
  
    return groupedData;
  }

// Call the function and get the data grouped by 1-hour timeframe
const dataGroupedBy1Hour = groupDataBy1Hour(dataa.result);
const dataGroupedBy3Hours = groupDataBy3Hours(dataa.result);
const dataGroupedBy24Hours = groupDataBy24Hours(dataa.result);


  

// Loop through the data array and add a new field 'value_1_hour' for the 1-hour value
dataa.result.forEach(entry => {
    const timestamp = parseISODate(entry.block_timestamp);
    const roundedHour = roundToNearestHour(timestamp);
    const rounded3Hour = roundToNearest3Hours(timestamp);
    const rounded24Hours = roundToNearest24Hours(timestamp);
    const key1Hour = roundedHour.toISOString();
    const key3Hours = rounded3Hour.toISOString();
    const key24Hours = rounded24Hours.toISOString();
  
    // Create new fields 'value_1_hour', 'value_3_hours', and 'value_24_hours' and set them to the respective time frame values
    entry.value_1_hour = dataGroupedBy1Hour[key1Hour];
    entry.value_3_hours = dataGroupedBy3Hours[key3Hours];
    entry.value_24_hours = dataGroupedBy24Hours[key24Hours];
   
  });


  const initialValue1h = 0;
  const totalSum1h = dataa.result.reduce((accumulator, currentValue) => {
    if (currentValue.value_1_hour?.value) {
      return accumulator + parseFloat(currentValue.value_1_hour.value);
    }
    return accumulator;
  }, initialValue1h)

  const initialValue3h = 0;
  const totalSum3h = dataa.result.reduce((accumulator, currentValue) => {
    if (currentValue.value_3_hours?.value) {
      return accumulator + parseFloat(currentValue.value_3_hours.value);
    }
    return accumulator;
  }, initialValue3h)

  const initialValue24h = 0;
  const totalSum24h = dataa.result.reduce((accumulator, currentValue) => {
    if (currentValue.value_24_hours?.value) {
      return accumulator + parseFloat(currentValue.value_24_hours.value);
    }
    return accumulator;
  }, initialValue24h)
  

  res.json({items : dataa.result , totalSum1h , totalSum3h , totalSum24h})
})

// New route for fetching data from CoinMarketCap API
app.get('/fetch/tokensWithPotential/:limit', async (req, res) => {
    console.log({rd : req.params.limit})
    // const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const nnlimit = Number(req.params.limit)
    const apiKey = '2b5029aa-bce3-45b7-8263-2138b2868993';
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${nnlimit}&market_cap_max=500000000&volume_24h_max=5000000`

    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

   
        const isConditionMet = (item) => {
                console.log({item :item.potential})
            return  Number(item.potential) > 1;
        };

          

          function addIsPotentialField(array) {
            const newArray = array.map((item) => {
              const volume24h = parseInt(item.quote.USD.volume_24h);
              const marketCap = Number(item.quote.USD.market_cap)
              console.log({marketCap})
              const circulatingSupply = Number(item.circulating_supply);
              const maxSupply = Number(item.max_supply);
            
              console.log({volume24h})
              console.log({circulatingSupply})
              console.log({maxSupply})
              // Calculate the value of the condition: (500,000,000 / marketCap) * (circulatingSupply / maxSupply)
               conditionValue = (500000000 / marketCap) * (circulatingSupply / maxSupply)*4;
              conditionValue == Infinity ?  conditionValue=0 : conditionValue
              conditionValue == NaN ?  conditionValue=0 : conditionValue
              console.log({conditionValue})
              console.log({conditionValue})
              let potential = conditionValue;
              
              // Return a new object with the new field included
              return { ...item, potential };
            });
          
            return newArray;
          }
          const newArray = addIsPotentialField(response.data.data);
          const filteredItems2 = newArray.filter(isConditionMet);

        res.json(filteredItems2)
        } catch (error) {
        // error
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});




// // New route for fetching data from CoinMarketCap API
// app.get('/fetch/tokenwise_inflows', async (req, res) => {
//     const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
//     const url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/trending/most-visited';

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'X-CMC_PRO_API_KEY': apiKey,
//             },
//         });

//         // success
//         const json = response.data;
//         res.json(json);
//     } catch (error) {
//         // error
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
// });








app.get("/findBlockNumber/:contractAddress", async (req,res) =>{

    const {contractAddress} = req.params
    const etherScanApi = "DCTDFUMBRUUDBY7E9YXI7US45TB7HEU9B1"
    async function getTransactionHashFromContractAddress(contractAddress) {
        try {
            const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&sort=asc&apikey=${etherScanApi}`;

            const response = await axios.get(apiUrl);
            console.log({ res: response.data })
            const transactions = response.data.result;

            // Find the first transaction with a "to" address matching the contract address
            for (const transaction of transactions) {
                if (transaction.to.toLowerCase() === contractAddress.toLowerCase()) {
                    console.log({ trxHash: transaction.hash })
                    return transaction.hash;
                }
            }

            console.log(`No deployment transaction found for contract address: ${contractAddress}`);
            return null;
        } catch (error) {
            console.error('Error fetching transaction data:', error.message);
            return null;
        }
    }

    async function getContractDeploymentBlock(contractAddress) {
        try {
            const transactionHash = await getTransactionHashFromContractAddress(contractAddress);
            if (transactionHash) {
                // Now we have the transaction hash, we can use it to get the block number
                const txReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                if (txReceipt) {
                    console.log(`Block Height of Contract Deployment (Tx Hash: ${transactionHash}):`, txReceipt.blockNumber.toString());
                    res.send(txReceipt.blockNumber.toString())
                } else {
                    console.log(`Transaction with hash ${transactionHash} not found or not confirmed yet.`);
                }
            } else {
                console.log('Unable to find transaction hash for contract deployment.');
            }
        } catch (error) {
            console.error(`Error getting the block height of Contract Deployment:`, error);
        }
    }

    getContractDeploymentBlock(contractAddress);

})



// 404 Route - Page Not Found
app.use((req, res, next) => {
    res.status(404).send('404 - Page Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
