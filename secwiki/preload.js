const { shell } = require('electron')
const axios = require('axios')
const cheerio = require('cheerio')

function getSecNews(callbackSetList) {
  const imgUrl = "https://wiki.ioin.in"
  axios.get(imgUrl).then(res => {
    const render = []
    try {
      $ = cheerio.load(res.data)
      title = $('a.visit-color')
      $("a.visit-color").each(function (i, e) {
        url = imgUrl + $(e).attr("href")
        title = $(e).text().replace(/\n|\r/g, "").trim()
        if (url && url.length > 0 && title && title.length > 0) {
          render.push({
            title: title,
            description: title,
            url: url,
            icon: "logo.png"
          })
        }
      });
    } catch (error) {
      return null
    }
    callbackSetList(render)
  })
}

window.exports = {
  'get_news': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList([
          {
            title: 'Sec-News 安全文摘加载中...',
          }
        ])
        getSecNews(callbackSetList)
      },
      select: (action, itemData) => {
        window.utools.hideMainWindow()
        shell.openExternal(itemData.url).then(() => {
          window.utools.outPlugin()
        })
      }
    }
  }
}