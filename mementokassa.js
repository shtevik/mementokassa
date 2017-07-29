
// 0. check trigger phase - create / update
var orderID = entry().field("orderID");
//message(foundOrders.length);
if ( orderID == 0 ) {

	message('create');
  
} else {
  
  message('update');
  
}
