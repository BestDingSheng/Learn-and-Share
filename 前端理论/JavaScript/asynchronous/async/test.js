const fs = require('fs');

const readFile = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        console.log('the promise had been rejected!');
        reject(err.toString());
      } else {
        console.log('the promise has been resolved!');
        resolve(data.toString());
      }
    });
  });
}

readFile('./readmea').then(function(data) {
  return data;
}).then(function(data) {
  return readFile(data).then(function(data) {
    console.log(data);
  });
}).catch(function(err) {
  console.error(err);
})
// Promise.all([
//   readFile('./readme'),
//   readFile('./nextFile'),
//   readFile('./lastFile')
// ]).then(function(data) {
//   console.log(data[0] + data[1] + data[2]);
// }, function(err) {
//   console.error(err);
// });


// const ajaxPromise = function(url) {
//   return new Promise(function (resolve, reject) {
//     const xmlHttp = new XMLHttpRequest();
//     xmlHttp.open('GET', url);
//     xmlHttp.onreadystatechange = function() {
//       if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
//         resolve(xmlHttp.responseText);
//       } else if (xmlHttp.status === 500 && xmlHttp.readyState === 4) {
//         reject(xmlHttp.responseText);
//       }
//     }
//     xmlHttp.send();
//   });
// }

// Promise.race([
//   ajaxPromise('http://localhost:9999/'),
//   ajaxPromise('http://localhost:9999/index'),
//   ajaxPromise('http://localhost:9999/user')
// ]).then(function(data) {
//   console.log(data);
// }, function(err) {
//   console.error(err);
// });