  var sum = entry().field('сумма');
  var guest = entry().field('guest')[0];
  var guestBal = guest.field('Баланс') - sum;


// check if update phase
var orderID = entry().id;
if ( orderID !== null ) 

  var saved = lib().findById(orderID);
  var savedSum = saved.field('сумма');
  var guestBal += savedSum;

}

guest.set('Баланс', guestBal);
