module.exports.api = api
function api(start, types) {
  let ing = 'https://douban.uieee.com/v2/movie/in_theaters';
  let soon = 'https://douban.uieee.com/v2/movie/coming_soon';
  let top = 'https://douban.uieee.com/v2/movie/top250';
  let movie;
  if (types == 1) {
    movie = ing
  } else if (types == 2) {
    movie = soon
  } else {
    movie = top
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: movie,
      method: 'GET',
      data: {
        "start": start,
        "count": 10,
      },
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        resolve(res);
      }
    })

  });
};


