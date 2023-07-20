const express = require('express');
const bodyParser = require('body-parser');

const cors = require("cors")
const axios = require('axios');
const {Web3} = require('web3');
// const os = require('os');
// const net = require('net');
// const ethers = require("ethers")

const app = express();
const web3 = new Web3("https://mainnet.infura.io/v3/3ada41439dc8493d98ef08873b1f8b26");

// const endpoint = "https://fabled-wiser-tree.discover.quiknode.pro/9290e904b3d8dfec35d8e209d1189ca50778bb8d/"

const PORT = process.env.PORT || 5000;





// Parse JSON and url-encoded bodies
app.use(bodyParser.json());
app.use(cors({
    origin: ["https://buyandgrabv.vercel.app", "http://localhost:3000"],

}))
app.use(bodyParser.urlencoded({ extended: true }));


// Initial route
app.get('/fetch/token_holders/:tokenId/:blockNumber', async (req, res) => {

    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    
    const {tokenId , blockNumber} = req.params
    console.log(req.params)
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/tokens/${tokenId}/token_holders_v2/?block-height=${blockNumber}`;
    
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${YOUR_API_KEY}`,
    };
    
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log(response.data);
        return res.status(200).send(response.data.data.items);
      })
      .catch((error) => {
        console.error('Error making the API call:', error.message);
      });
    
});



app.get('/fetch/transactions/:wallet_address/:contract_address' , (req , res) =>{

    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
// const address = '0x781229c7a798c33ec788520a6bbe12a79ed657fc'; 
const {wallet_address , contract_address} = req.params
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
app.get('/fetch/info/:id', async (req, res) => {
    const { id } = req.params
    // const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'; //test keys
    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

        // success
        const data = response.data.data[`${id}`].logo;
        res.json(data);
    } catch (error) {
        // error
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});
// New route for fetching data from CoinMarketCap API
app.get('/fetch/latest/:limit', async (req, res) => {
    // const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'; //test keys
    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const coinsWithPlatform = [];
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
        });

        // success
        const data = response.data.data;
        data.forEach(item =>{
            if(item.platform){
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
app.get('/fetch/trending', async (req, res) => {
    // const apiKey = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'; //test keys
    const apiKey = '1ea3b0ed-d724-4d2b-82e9-00602b124e8b';
    const url = 'https://api.coingecko.com/api/v3/search/trending'
    try {
        const response = await axios.get(url);

        // success
        const data = response.data.coins;
        console.log({data})
        res.json(data);
    } catch (error) {
        // error
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' + error });
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




app.get('/graphql', async (req, res) => {
    const query = `
    query {
      ethereum {
        collection(contractAddress: "0x4d224452801ACEd8B2F0aebE155379bb5D594381") {
          
            metaData
          symbol
          totalSupply
        }
      }
    }
  `;
    axios.post('https://api.quicknode.com/graphql', { query }, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'QN_277d11c4acfb4ce5abc2b9b116d4f9f6',
        },
    })
        .then(response => {
            console.log(response);
            res.json(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

})



app.get('/fetch-token-metadata', async (req, res) => {
    try {
        const myHeaders = {
            'Content-Type': 'application/json',
            'x-qn-api-version': '1',
        };

        const raw = JSON.stringify({
            id: 67,
            jsonrpc: '2.0',
            method: 'qn_getTokenMetadataByContractAddress',
            params: {
                contract: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
            },
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            data: raw,
            url: 'https://fabled-wiser-tree.discover.quiknode.pro/9290e904b3d8dfec35d8e209d1189ca50778bb8d/',
        };

        const response = await axios(requestOptions);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


app.get('/get-eth-block-number', async (req, res) => {
    try {
        const myHeaders = {
            'Content-Type': 'application/json',
        };

        const raw = JSON.stringify({
            method: 'eth_blockNumber',
            params: {
                    contract: "0x63f88a2298a5c4aee3c216aa6d926b184a4b2437"
            },
            id: 1,
            jsonrpc: '2.0',
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            data: raw,
            url: 'https://fabled-wiser-tree.discover.quiknode.pro/9290e904b3d8dfec35d8e209d1189ca50778bb8d/',
        };

        const response = await axios(requestOptions);
        console.log({response})
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


app.get("/getContractBlockNumber", async (req, res) => {
    const contractAddress = '0x63f88a2298a5c4aee3c216aa6d926b184a4b2437'
    const etherScanApi  = "DCTDFUMBRUUDBY7E9YXI7US45TB7HEU9B1"
   
async function getTransactionHashFromContractAddress(contractAddress) {
    try {
      const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${contractAddress}&sort=asc&apikey=${etherScanApi}`;
      
      const response = await axios.get(apiUrl);
      console.log({res : response.data})
      const transactions = response.data.result;
  
      // Find the first transaction with a "to" address matching the contract address
      for (const transaction of transactions) {
        if (transaction.to.toLowerCase() === contractAddress.toLowerCase()) {
            console.log({trxHash : transaction.hash})
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
          res.json({contractAddress , blockNumber : txReceipt.blockNumber.toString()})
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
