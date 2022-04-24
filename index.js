const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const PORT = process.env.PORT||3000
const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base:'',
    }
    // },
    // {
    //     name: '',
    //     address: ''
    // },
    // {
    //     name: '',
    //     address: ''
    // },

]
const articles = []

const app = express()
newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(
        response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url:newspaper.base+url,
                    publisher: newspaper.name
                })
            })
        }
    )

})

app.get('/', (req, res) => {
    res.json({
        name: 'Weather news api',
        version: '1.0.0',
        author: 'Graham Kenneth Katana',
        links: {
            'all':'https://my-climate.herokuapp.com/news',
        }
    })
})

app.get('/news', (req, res) => {
    res.json(articles)

})
app.get('/news/:newspaperId',async (req,res)=>{
    const id = req.params.newspaperId
    const base = newspapers.filter(newspaper=>newspaper.name==id)[0].base
    const newspaperAddress = newspapers.filter(newspaper=>newspaper.name==id)[0].address
  // axios.get()
    console.log(newspaperAddress)
    axios.get(newspaperAddress).then(
        response=>{
            const html = response.data
            const $ = cheerio.load(html)
            const title = $(this).text()
            const url = $(this).attr('href')
            const specificArticle = []
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticle.push({
                    title,
                    url:base+url,
                    publisher: id
                })
            })

            res.json(specificArticle)

        }
    )

})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})