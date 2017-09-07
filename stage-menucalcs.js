var menu = entry().field('Меню');

if ( menu.length > 0 ) {

  var structuredMenu = {};
  var addStamps = 0;

  for ( var position, price, i=0; i < menu.length; i++ ) {
  
    position = menu[i].field("Наименование");
    price = menu[i].field("Цена");
    

    if ( !structuredMenu[position] ) {
      //message ('null');
      structuredMenu[position] = {
        count: 1,
        price: price 
      }; 
    } else { 
      structuredMenu[position].count ++;
      //message ('exsist');
    }
    
    addStamps++;   

  }
  
  
  message ('x');
  
  var x;
  var totalSum = 0;
  var orderString = '';
  
  for ( x in structuredMenu ) {
    
    totalSum += structuredMenu[x].price * structuredMenu[x].count;
    //message(x);
    orderString += ', '+ structuredMenu[x].count +'x'+ x;
    
    
  }
  
  message (totalSum);
  message(orderString);
  



}
