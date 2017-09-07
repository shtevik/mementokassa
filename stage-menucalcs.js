var menu = entry().field('Меню');

if ( menu.length > 0 ) {

  var structuredMenu = {};

  for ( var position, i=0; i < menu.length; i++ ) {
  
    position = menu[i].field("Наименование");

    if ( structuredMenu[position] === null ) structuredMenu[position] = 1;
    else structuredMenu[position]++;
    
    message(structuredMenu[position]);
    
    

  }
  
  



}
