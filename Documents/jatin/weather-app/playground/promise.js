/*var somePromise = new Promise((resolve, reject) => {
  setTimeout (() => {
  resolve('Hey it worked');
  reject('Unable to fullfill promise');
  },2500);
});

somePromise.then((message) => {
  //console.log('Success: ' , message)
}, (errorMessage) => {
  //console.log('error: ' , errorMessage);
}); */

var async = (a,b) => {
  return new Promise((resolve, reject) =>{
   setTimeout(() => {
     if(typeof a === 'number' && typeof b === 'number')
     {
       resolve(a + b);
     }
     else
     {
        //console.log('Arguments should be number');
     }
   }, 1500);
  });
};

async(5,7).then((message) => {
  //console.log('Result: ' , message);
  return async(message, 33)
}).then((message) => {
  //console.log('should be 45', message);
}).catch((errorMessage) => {
  //console.log(errorMessage);
});
