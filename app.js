const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const cors = require("cors")
const axios = require('axios');
const { Web3 } = require('web3');
// const os = require('os');
// const net = require('net');
const coinData = require('./coinsData.json')
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
// const ethers = require("ethers")

const app = express();
const web3 = new Web3("https://mainnet.infura.io/v3/3ada41439dc8493d98ef08873b1f8b26");

const infuraKey = "3ada41439dc8493d98ef08873b1f8b26"
// const endpoint = "https://fabled-wiser-tree.discover.quiknode.pro/9290e904b3d8dfec35d8e209d1189ca50778bb8d/"

const PORT = process.env.PORT || 8000;





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
}).then(res => {
    console.log('Moralis is      running')
});


// Initial route
app.get('/fetch/token_holders/:tokenId/:blockCount', async (req, res) => {

    console.log(req.params)
    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key   
    const { tokenId, blockCount } = req.params
    const findBlockNumber = await axios.get(`https://appslk-second.onrender.com/findBlockNumber/${tokenId}`)
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
            return res.status(200).json({ data: response.data.data.items, CoinBlockNumber });
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





app.get("/fetch/tokenwise_inflows", async (req, res) => {
    // const address = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
    // //   const address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    // const chain = EvmChain.ETHEREUM;

    // const response = await Moralis.EvmApi.token.getTokenTransfers({
    //     address,
    //     chain,
    // });
    // const dataa = response.toJSON()



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
        data.forEach((entry, i) => {
            const timestamp = parseISODate(entry.logEvent[0].block_signed_at);
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
            groupedData[key].value += parseFloat(entry.log_events[0].decoded?.params[2]?.value);
            groupedData[key].decimal_1h += parseFloat(entry.token_decimals); // Assuming you have another_value field in the data
        });

        return groupedData;
    }

    // Function to group data by 3-hour timeframe
    function groupDataBy3Hours(data) {
        const groupedData = {};
        data.forEach(entry => {
            const timestamp = parseISODate(entry.block_signed_at);
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
            groupedData[key].value += parseFloat(entry.log_events[0].decoded?.params[2]?.value);
            groupedData[key].decimal_3h += parseFloat(entry.token_decimals); // Assuming you have 
        });

        return groupedData;
    }
    function groupDataBy24Hours(data) {
        const groupedData = {};
        data.forEach(entry => {
            const timestamp = parseISODate(entry.block_signed_at);
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
            groupedData[key].value += parseFloat(entry.log_events[0].decoded?.params[2]?.value);
            groupedData[key].decimal_24h3 += parseFloat(entry.token_decimals); // Assuming you have 
        });

        return groupedData;
    }

    // Call the function and get the data grouped by 1-hour timeframe
    const dataGroupedBy1Hour = groupDataBy1Hour(filteredArray2);
    const dataGroupedBy3Hours = groupDataBy3Hours(filteredArray2);
    const dataGroupedBy24Hours = groupDataBy24Hours(filteredArray2);




    // Loop through the data array and add a new field 'value_1_hour' for the 1-hour value
    filteredArray2.forEach(entry => {
        const timestamp = parseISODate(entry.block_signed_at);
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
    const totalSum1h = filteredArray2.reduce((accumulator, currentValue) => {
        if (currentValue.value_1_hour?.value) {
            return accumulator + parseFloat(currentValue.value_1_hour.value);
        }
        return accumulator;
    }, initialValue1h)

    const initialValue3h = 0;
    const totalSum3h = filteredArray2.reduce((accumulator, currentValue) => {
        if (currentValue.value_3_hours?.value) {
            return accumulator + parseFloat(currentValue.value_3_hours.value);
        }
        return accumulator;
    }, initialValue3h)

    const initialValue24h = 0;
    const totalSum24h = filteredArray2.reduce((accumulator, currentValue) => {
        if (currentValue.value_24_hours?.value) {
            return accumulator + parseFloat(currentValue.value_24_hours.value);
        }
        return accumulator;
    }, initialValue24h)


    res.json({ items: filteredArray2, totalSum1h, totalSum3h, totalSum24h })
})


app.get("/fetch/get_trxs", async (req, res) => {
    console.log('first')
    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key



    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/block/latest/transactions_v3/`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then((response) => {
            let dd = response.data.data.items

            const myArray = [];
            for (const key in dd) {
                myArray.push(dd[key]);
            }

            const filteredArray = myArray.filter((item, index) => item.log_events)
            const filteredArray2 = filteredArray.filter((item, index) => item.to_address === item.log_events[0].sender_address)
            console.log({ filteredArray })


            res.json(filteredArray2.slice(0, 160))
        })
        .catch((error) => {
            console.error('Error making the API call:', error);
        });


    // function getDataForTimeFrame1(dataArray, timeFrameInHours) {
    //     // Get the maximum block height difference for the given time frame (assuming 12 blocks per hour)
    //     const maxBlockDifference = timeFrameInHours * 12;

    //     // Find the highest block_height for the current data array
    //     const highestBlockHeight = Math.max(...dataArray.map((item) => item.block_height));

    //     // Calculate the block_height range for the desired time frame
    //     const startBlockHeight = highestBlockHeight - maxBlockDifference;
    //     const endBlockHeight = highestBlockHeight;
    //     // Filter the dataArray based on the block_height range
    //     const filteredData = dataArray.filter((item) => {
    //       return item.block_height >= startBlockHeight && item.block_height <= endBlockHeight;
    //     });




    //     const values = filteredData.map((item) => {
    //         let dd = 0;
    //         dd += parseFloat(item.log_events && item.log_events[0].decoded  &&  item.log_events[0].decoded.params && item.log_events[0].decoded.params[2]?.value)
    //         return {
    //             ...item, 
    //           value_1h: dd
    //         };
    //       });

    //       return values;
    //     }



    // function getDataForTimeFrame3(dataArray, timeFrameInHours) {
    //     // Get the maximum block height difference for the given time frame (assuming 12 blocks per hour)
    //     const maxBlockDifference = timeFrameInHours * 12;

    //     // Find the highest block_height for the current data array
    //     const highestBlockHeight = Math.max(...dataArray.map((item) => item.block_height));

    //     // Calculate the block_height range for the desired time frame
    //     const startBlockHeight = highestBlockHeight - maxBlockDifference;
    //     const endBlockHeight = highestBlockHeight;
    //     console.log({startBlockHeight})
    //     console.log({endBlockHeight})

    //     // Filter the dataArray based on the block_height range
    //     const filteredData = dataArray.filter((item) => {
    //       return item.block_height >= startBlockHeight && item.block_height <= endBlockHeight;
    //     });



    //   // Extract the required value and extra field from the filtered data
    //   const values = filteredData.map((item) => {
    //     return {
    //         ...item, 
    //       value_3h: item.log_events && item.log_events[0].decoded  &&  item.log_events[0].decoded.params && item.log_events[0].decoded.params[2]?.value
    //     };
    //   });

    //   return values;
    // }



    //   // Usage example for 1 hour time frame
    //   const oneHourData = getDataForTimeFrame1(filterARRay, 1);
    //   const threeHourData = getDataForTimeFrame3(oneHourData, 24 * 7);
    // //   const oneDayData = getDataForTimeFrame(filterARRay, 24);
    // //   console.log("Data for 1-hour time frame:", oneHourData);

    //   res.json({ threeHourData})
    //   // Usage example for 3 hours time frame
    // //   const threeHoursData = getDataForTimeFrame(slicArray, 3);
    // //   console.log("Data for 3-hour time frame:", threeHoursData);



    // })



})



app.get('/codeByAppslk', async (req, res) => {

    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/block/latest/transactions_v3/`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then((response) => {
            let dd = response.data.data.items

            const myArray = [];
            for (const key in dd) {
                myArray.push(dd[key]);
            }

            const filterARRay = myArray.filter((item, index) => item.log_events !== null || item.log_events !== undefined)


            const modifiedResponse = filterARRay.map((data) => {
                data.log_events?.map((item) => {
                    const paramsArray = item.decoded?.params?.filter((param) => param.name === "value");;
                    delete item.decoded?.params;
                    item.valueParam = paramsArray;
                    return item;
                });
                return data;
            });


            // return res.json(modifiedResponse)
            const filteredData = modifiedResponse.reduce((result, item) => {
                if (!result[item.tx_hash]) {
                    result[item.tx_hash];
                }
                const filterUSDT = item.log_events?.filter((logEvent) => logEvent.sender_contract_ticker_symbol === "USDT");
                result[item.tx_hash] = filterUSDT;
                return result;
            }, {});

            // const newArray = Object.entries(filteredData).map(([trx_hash, log_events]) => ({ trx_hash, log_events }));
            const newArray = Object.entries(filteredData).map(([trx_hash, log_events]) => ({ trx_hash, log_events }));

            const filteNewArray = newArray.filter((data) => data.log_events && data.log_events.length > 0);




            // raw response array withtout the log_events
            const newfilterARRay = filterARRay.map((item) => {
                // Use object destructuring to create a new object without the log_events property
                const { log_events, ...newItem } = item;
                return newItem;
            });



            // return res.json({filteNewArray   }) // render log_eventgs array
            // return res.json({ newfilterARRay }) // render raw resp without the log_events


            function parseISODate(timestamp) {
                return new Date(timestamp);
            }

            // Function to round the time to the nearest 1 hour
            function roundToNearestHour(timestamp) {
                const date = new Date(timestamp);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                date.setHours(date.getHours() - (date.getHours() % 40));

                return date;
            }








            function groupDataBy1Hour(entry) {
                const groupedData = {};

                const timestamp = parseISODate(entry.block_signed_at);
                const roundedHour = roundToNearestHour(timestamp);

                // Create a unique key for the 1-hour timeframe
                const key = roundedHour.toISOString();

                // Calculate the sum of values for the 1-hour timeframe
                if (!groupedData[key]) {
                    groupedData[key] = 0;
                    // groupedData[key] = {
                    //     value: 0,
                    //     decimal_1h: 0, // New field for another value for 1-hour timeframe
                    // };
                }
                //   groupedData[key] += parseFloat(entry.value);
                // groupedData[key] += parseFloat(entry.log_events[i].valueParam[0].value);
                groupedData[key] += parseFloat(entry.valueParam.length > 0 && entry.valueParam[0].value);
                // groupedData[key].decimal_1h += parseFloat(entry.token_decimals); // Assuming you have another_value field in the data

                return groupedData;
            }



            let dataGroupedBy1Hour
            for (const obj of filteNewArray) {

                // Loop through the inner array of each object
                for (const value of obj.log_events) {
                    console.log(value);
                    dataGroupedBy1Hour = groupDataBy1Hour(value);
                    const timestamp = parseISODate(value.block_signed_at);
                    const roundedHour = roundToNearestHour(timestamp);

                    const key1Hour = roundedHour.toISOString();

                    // Create new fields 'value_1_hour', 'value_3_hours', and 'value_24_hours' and set them to the respective time frame values
                    value.firstHour = dataGroupedBy1Hour[key1Hour];

                }
            }






            // Loop through the data array and add a new field 'value_1_hour' for the 1-hour value
            // filteNewArray.forEach((entry , i) => {



            // });



            res.json(filteNewArray)
































            // Assuming you have an array of transactions in your data set
            // const transactions = filterARRay
            // // Function to calculate the time difference in hours between two dates
            // function getHoursDifference(fromDate, toDate) {
            //     const diffInMilliseconds = toDate - fromDate;
            //     return diffInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
            // }

            // // Function to filter transactions based on the time range
            // function filterTransactionsByTime(transactions, timeRangeInHours) {
            //     const currentTime = new Date();

            //     return transactions.filter((transaction) => {
            //         const transactionTime = new Date(transaction.block_signed_at);
            //         return getHoursDifference(transactionTime, currentTime) <= timeRangeInHours;
            //     });
            // }



            // // Function to calculate aggregate data for a given set of transactions
            // function calculateAggregates(transactions) {
            //     let totalTransactions = transactions.length;
            //     let totalValue = 0;

            //     transactions.forEach((transaction, index) => {
            //         const cc = transaction.log_events && transaction.log_events[index]?.decoded && transaction.log_events[index]?.decoded?.params[2]?.value
            //         // console.log({cc})
            //         totalValue += cc !== undefined && parseInt(cc); // Assuming the value is a string, convert it to an integer
            //     });

            //     return { totalTransactions, totalValue };
            // }


            // Function to create the table and display the aggregated data
            //   function createTableWithAggregates(transactions) {
            //     const tokens = {}; // Object to store token-wise aggregates

            //     // Group transactions by sender_name (token)
            //     transactions.forEach((transaction) => {
            //       const tokenName = transaction.log_events?.length > 0 && transaction.log_events[0]?.sender_name;
            //       if (!tokens[tokenName]) {
            //         tokens[tokenName] = [];
            //       }
            //       tokens[tokenName].push(transaction);
            //     });

            //     console.log({tokens})
            //     // Calculate aggregates for each token within different time ranges
            //     const tableData = [];
            //     for (const tokenName in tokens) {
            //       const lastHourTransactions = filterTransactionsByTime(tokens[tokenName], 1);
            //       const last3HoursTransactions = filterTransactionsByTime(tokens[tokenName], 120);
            //       const last12HoursTransactions = filterTransactionsByTime(tokens[tokenName], 12);

            //       const lastHourAggregates = calculateAggregates(lastHourTransactions);
            //       const last3HoursAggregates = calculateAggregates(last3HoursTransactions);
            //       const last12HoursAggregates = calculateAggregates(last12HoursTransactions);

            //       tableData.push({
            //         tokenName,
            //         lastHourTransactions: lastHourAggregates.totalTransactions,
            //         lastHourTransactionsValue: lastHourAggregates.totalValue,
            //         last3HoursTransactions: last3HoursAggregates.totalTransactions,
            //         last3HoursTransactionsValue: last3HoursAggregates.totalValue,
            //         last12HoursTransactions: last12HoursAggregates.totalTransactions,
            //         last12HoursTransactionsValue: last12HoursAggregates.totalValue,

            //         });
            //     }

            //     // Display the table (you can customize the display based on your needs)
            //     // console.table(tableData);
            //     res.json(tableData)
            //   }

            //   Call the function with your transactions data








            // function createTableWithAggregates(transactions) {
            //     const tokens = {}; // Object to store token-wise aggregates

            //     // Group transactions by sender_name (token)
            //     transactions.forEach((transaction) => {
            //         const tokenName = transaction.log_events?.length > 0 && transaction.log_events[0]?.sender_name;
            //         if (!tokens[tokenName]) {
            //             tokens[tokenName] = [];
            //         }
            //         tokens[tokenName].push(transaction);
            //     });

            //     // Calculate aggregates for each token within different time ranges
            //     const tableData = [];
            //     for (const tokenName in tokens) {
            //         const lastHourTransactions = filterTransactionsByTime(tokens[tokenName].slice(), 1);
            //         const last3HoursTransactions = filterTransactionsByTime(tokens[tokenName].slice(), 3);
            //         const last12HoursTransactions = filterTransactionsByTime(tokens[tokenName].slice(), 12);

            //         // Rest of the code remains unchanged...
            //         const lastHourAggregates = calculateAggregates(lastHourTransactions);
            //         const last3HoursAggregates = calculateAggregates(last3HoursTransactions);
            //         const last12HoursAggregates = calculateAggregates(last12HoursTransactions);

            //         tableData.push({
            //             tokenName,
            //             lastHourTransactions: lastHourAggregates.totalTransactions,
            //             last3HoursTransactions: last3HoursAggregates.totalTransactions,
            //             last12HoursTransactions: last12HoursAggregates.totalTransactions,
            //             lastHourTransactionsValue: lastHourAggregates.totalValue,
            //             last3HoursTransactionsValue: last3HoursAggregates.totalValue,
            //             last12HoursTransactionsValue: last12HoursAggregates.totalValue,

            //         });
            //         // Display the table (you can customize the display based on your needs)
            //     }
            //     console.table(tableData);
            //     res.json(tableData)
            // }
            // createTableWithAggregates(transactions);


        })
})



app.get('/getBlockTrxs', async (req, res) => {
    // const currentTimestamp = Math.floor(Date.now() / 1000);
    // const oneHourInSeconds = 3600;
    // const pastHourTimestamp = currentTimestamp - oneHourInSeconds;
    // const { block } = req.params


    let startingBlockNumber = await web3.eth.getBlockNumber().then(latestBlockNumber => {
        let blockNumber = Number(latestBlockNumber);
        let startingBlockNumberx = blockNumber - (3600 / 15); // Assuming an average block time of 15 seconds
        blockNumberNumberTouse = startingBlockNumberx
        return startingBlockNumberx
    })



    console.log({ startingBlockNumber })

    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/block/${startingBlockNumber}/transactions_v3/`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };


    async function fetchApiResponse() {
        try {
            const response = await axios.get(apiUrl, { headers });
            return response.data.data.items; // Return the data from the API response
        } catch (error) {
            console.error('Error fetching API data:', error.message);
            throw error;
        }
    }




    // axios
    //     .get(apiUrl, { headers })
    //     .then(async(response) => {
    let dd = await fetchApiResponse();


    if (dd) {

        const myArray = [];
        for (const key in dd) {
            myArray.push(dd[key]);
        }

        const filterARRay = myArray.filter((item, index) => item.log_events !== null || item.log_events !== undefined)






        // Function to read and update the JSON file with the API response
        async function updateJsonFileWithApiResponse(apiResponse) {
            try {
                // Read the existing JSON data from the file (if the file exists)
                let jsonData = [];
                if (fs.existsSync('tokenData.json')) {
                    const fileContent = fs.readFileSync('tokenData.json', 'utf8');
                    if (fileContent.trim() !== '') {
                        jsonData = JSON.parse(fileContent);
                    }
                }

                // Push the API response data into the JSON array
                jsonData.push(apiResponse);

                // Write the updated JSON data to the file
                fs.writeFileSync('tokenData.json', JSON.stringify(jsonData, null, 2));
                console.log('JSON data updated successfully.');
                res.send("JSON data updated successfully")
            } catch (error) {
                console.error('Error updating JSON file:', error.message);
                throw error;
            }
        }



        // res.json(filterARRay)
        // Update the JSON file with the API response
        await updateJsonFileWithApiResponse(filterARRay);
    }



})
app.get("/findValue", (req, res) => {
    // Function to read the JSON file and get the data array
    function getDataArrayFromFile() {
        try {
            if (fs.existsSync('tokenData.json')) {
                const jsonData = require('./tokenData.json');
                return jsonData;
            } else {
                console.log('tokenData.json file does not exist.');
                return [];
            }
        } catch (error) {
            console.error('Error reading JSON file:', error.message);
            throw error;
        }
    }











    // Loop through the data array obtained from the file

    // function processDataArray(dataArray) {
    //     for (const item of dataArray) {
    //       // Perform operations with each item in the dataArray
    //     //   console.log(item);
    //     }
    //   }
      

    // Example usage:
    const [dataArrayFromFile] = getDataArrayFromFile();
    console.log('lenght' ,  dataArrayFromFile.length)

    function extractValuesFromArray(dataArray) {
        let valuesArray = [];
      
        dataArray.forEach((item ,i) => {
          if (item.log_events &&  item.log_events[i]?.decoded   && Array.isArray(item.log_events)) {
            const values = item.log_events.map((event) => event.decoded?.params[2]?.value);
            valuesArray.push(...values);
          }
        });
      
        return valuesArray;
      }
      
   
      const valuesArray = extractValuesFromArray(dataArrayFromFile);
      console.log(valuesArray);
      

        // Filter out undefined and null values, and convert strings to numbers
        function sumValuesFromArray(dataArray) {
            const valuesArray = extractValuesFromArray(dataArray);
          
            // Filter out non-numeric values, and convert strings to numbers
            const filteredValues = valuesArray
              .filter((value) => !isNaN(value))
              .map((value) => parseFloat(value));
          
            // Perform the summation using reduce
            const sum = filteredValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          
            return sum;
        }
 
      const totalSum = sumValuesFromArray(dataArrayFromFile);
      console.log(totalSum);
    res.json({totalVAlues : valuesArray , totalSum : totalSum.toLocaleString()})
    // res.json(totalSum.toLocaleString())
    // processDataArray(dataArrayFromFile);
})




// Assuming you have the necessary setup for web3 and the web3 instance is available as 'web3'

let startingBlockNumber = null;

// Function to fetch the block number initially and store it in the startingBlockNumber variable
async function fetchStartingBlockNumber() {
    try {
        const latestBlockNumber = await web3.eth.getBlockNumber();
        startingBlockNumber = Number(latestBlockNumber) - (3600 / 15);
        console.log('Initial startingBlockNumber:', startingBlockNumber);
    } catch (error) {
        console.error('Error fetching starting block number:', error.message);
    }
}

// Call the function once at the beginning to fetch the initial block number
fetchStartingBlockNumber();

// Set the interval to perform the required operations
const interval = 90000000; // 1000 milliseconds (1 second) - or adjust it as needed

let minusBlocks = 0;
// setInterval(() => {
//   if (startingBlockNumber !== null) {
//     // startingBlockNumber is available, use it for the operations
//     // For example, log the current blockNumber
//     minusBlocks +=  1;
//     const previousBlockNumber = startingBlockNumber - minusBlocks;
//     console.log({ previousBlockNumber });
//     axios.get("http://localhost:8000/getBlockTrxs")
//   } else {
//     // startingBlockNumber is not available yet, skip the current iteration
//     console.log('Waiting for initial block number...');
//   }
// }, interval);




app.get("/fetch/get_trxs4", async (req, res) => {
    console.log('get_trxs4')
    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    // const address = '0x781229c7a798c33ec788520a6bbe12a79ed657fc'; 
    const { wallet_address, contract_address } = req.params
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/block/4634841/transactions_v3/`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then(async (response) => {
            let dd = response.data.data.items

            // const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1000`

            // const resp = await axios.get(url, {
            //     headers: {
            //         'X-CMC_PRO_API_KEY': '1ea3b0ed-d724-4d2b-82e9-00602b124e8b',
            //     },
            // });

            // const coinData = resp.data.data


            const myArray = [];
            for (const key in dd) {
                myArray.push(dd[key]);
            }

            const filteredArray = myArray.filter((item, index) => item.log_events)
            //   const filterByContract =   myArray.filter((item, index) =>item.to_address === myArray[0].)
            //   const filteredArray2 =   filteredArray.filter((item, index) =>item.to_address === item.log_events[0].sender_address)

            // console.log(myArray);
            //   console.log({filteredArray})
            //   console.log({filteredArray2 : filteredArray[0].log_events[0].sender_address})
            //   console.log({filteredArray2 })
            //   console.log({ to : item.to_address})
            //   console.log({ from : item.log_events[0]})


            // Group the array based on the 'contract_address' field
            const groupedData = filteredArray.reduce((groups, item) => {
                const address = item.to_address;
                if (!groups[address]) {
                    groups[address] = [];
                }
                groups[address].push(item);
                return groups;
            }, {});

            // Convert the groupedData object into an array of objects with 'contract_address' as key
            const resultArray = Object.keys(groupedData).map(address => ({
                contract_address: address,
                data: groupedData[address],
            }));


            // res.json(resultArray)
            const filteredCoins = coinData.filter((item, index) => item.platform)

            const combinedData = filteredCoins.map(coinItem => {
                const contractAddress = coinItem.platform.token_address;
                const matchingGroup = resultArray.find(groupItem => groupItem.contract_address === contractAddress);

                if (matchingGroup) {
                    return {
                        ...coinItem,
                        data: matchingGroup.data,
                    };
                }

                return undefined; // If there's no matching group, add the coinItem without additional data
            });

            // console.log(combinedData);
            function hasNonNullProperties(obj) {
                return Object.values(obj).some(value => value !== null);
            }

            // Use filter() to remove explicit null values and objects with all null properties
            const filterCombined = combinedData.filter(item => {
                if (item == null) return false; // Remove explicit null values
                if (typeof item == 'object') {
                    return hasNonNullProperties(item); // Check if the object has non-null properties
                }
                return true;
            });

            res.json(filterCombined)
            // res.json(filteredArray2.slice(0 , 160))
        })
        .catch((error) => {
            console.error('Error making the API call:', error);
        });


})




app.get("/fetch/get_trxs6", async (req, res) => {
    console.log('get_trxs6')

    let startingBlockNumber = await web3.eth.getBlockNumber().then(latestBlockNumber => {
        let blockNumber = Number(latestBlockNumber);
        let startingBlockNumberx = blockNumber - (3600 / 15); // Assuming an average block time of 15 seconds

        return startingBlockNumberx
    })


    console.log({ startingBlockNumber })
    const YOUR_API_KEY = 'cqt_rQJpp8VF3QvYYWYHMCTbytwhbF8W'; // Replace this with your actual API key
    // const address = '0x781229c7a798c33ec788520a6bbe12a79ed657fc'; 
    const { wallet_address, contract_address } = req.params
    const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/block/${startingBlockNumber}/transactions_v3/`;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YOUR_API_KEY}`,
    };

    axios
        .get(apiUrl, { headers })
        .then(async (response) => {
            let dd = response.data.data.items


            const myArray = [];
            for (const key in dd) {
                myArray.push(dd[key]);
            }

            const filteredArray = myArray.filter((item, index) => item.log_events)

            const groupedData = filteredArray.reduce((groups, item) => {
                const address = item.to_address;
                if (!groups[address]) {
                    groups[address] = [];
                }
                groups[address].push(item);
                return groups;
            }, {});

            // Convert the groupedData object into an array of objects with 'contract_address' as key
            const resultArray = Object.keys(groupedData).map(address => ({
                contract_address: address,
                data: groupedData[address],
            }));



            // function hasNonNullProperties(obj) {
            //     return Object.values(obj).some(value => value !== null);
            //   }

            //   // Use filter() to remove explicit null values and objects with all null properties
            //   const filterCombined = combinedData.filter(item => {
            //     if (item == null) return false; // Remove explicit null values
            //     if (typeof item == 'object') {
            //       return hasNonNullProperties(item); // Check if the object has non-null properties
            //     }
            //     return true;
            //   });

            res.json(resultArray)

        })
        .catch((error) => {
            console.error('Error making the API call:', error);
        });


})





// New route for fetching data from CoinMarketCap API
app.get('/fetch/tokensWithPotential/:limit', async (req, res) => {
    console.log({ rd: req.params.limit })
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
            console.log({ item: item.potential })
            return Number(item.potential) > 1;
        };





        function addIsPotentialField(array) {
            const newArray = array.map((item) => {
                const volume24h = parseInt(item.quote.USD.volume_24h);
                const marketCap = Number(item.quote.USD.market_cap)
                console.log({ marketCap })
                const circulatingSupply = Number(item.circulating_supply);
                const maxSupply = Number(item.max_supply);

                console.log({ volume24h })
                console.log({ circulatingSupply })
                console.log({ maxSupply })
                // Calculate the value of the condition: (500,000,000 / marketCap) * (circulatingSupply / maxSupply)
                conditionValue = (500000000 / marketCap) * (circulatingSupply / maxSupply) * 4;
                conditionValue == Infinity ? conditionValue = 0 : conditionValue
                conditionValue == NaN ? conditionValue = 0 : conditionValue
                console.log({ conditionValue })
                console.log({ conditionValue })
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












app.get("/findBlockNumber/:contractAddress", async (req, res) => {

    const { contractAddress } = req.params
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


