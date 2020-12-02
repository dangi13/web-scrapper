import express from "express";
import Crawler from './src/crawler';
import {launchBrowser} from './src/browser'

const PORT = 3000;
let senhengPage,storePage,shoppePage,lazdaPage

const app = express();

app.listen(PORT, async() =>
  console.log(`The crawler is running on port`, PORT)
);

app.get('/api/getSenhengResults/:item', async (req, res) => {
    var item = req.params.item
    if (senhengPage === undefined)
    senhengPage = await launchBrowser()
    const crawler = new Crawler(senhengPage)
    console.log('Getting senheng data...')
    const shenengData = await crawler.getSenhengResults(item)
    res.send(shenengData);
})

app.get('/api/getStoreResults/:item', async (req, res) => {
  var item = req.params.item
  if (storePage === undefined)
  storePage = await launchBrowser()
  const crawler = new Crawler(storePage)
  console.log('Getting store data...')
  const storeData = await crawler.getStoreResults(item)
  res.send(storeData);
})

app.get('/api/getShoppeResults/:item', async (req, res) => {
  var item = req.params.item
  if (shoppePage === undefined)
  shoppePage = await launchBrowser()
  const crawler = new Crawler(shoppePage)
  console.log('Getting shoppe data...')
  const shoppeData = await crawler.getShoppeResults(item)
  res.send(shoppeData);
})

app.get('/api/getLazdaResults/:item', async (req, res) => {
  var item = req.params.item
  if (lazdaPage === undefined)
  lazdaPage = await launchBrowser()
  const crawler = new Crawler(lazdaPage)
  console.log('Getting lazda data....')
  const lazdaData = await crawler.getLazdaResults(item)
  res.send(lazdaData);
})