
// 0. check trigger phase - create / update
var orderID = entry().field("orderID");
var foundOrders = lib().find('"'+orderID+'"');
message(foundOrders.length);
// if ( foundOrders.length == 0 ) {

// 	message('create');
  
// else {
  
//   message('update');
  
// }
