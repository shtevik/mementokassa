

/*

INPUT:
- К оплате
- Позиций
- Списать штампов
- Ручная скидка

- Time
- Date

- Меню[0].field("Наименование")

- guestID




OOUTPUT:

1. по дням
- Дата
- Выручка
- Средний чек (calcs)
- Посещений
- Позиций
- Подарков 
- Скидок (руб) (calcs == roundup ("К оплате" / (1 - "Ручная скидка")) )

- Новых кол-во 
- Новых сумма 
- Старых кол-во
- Старых сумма
- Без гостей кол-во
- Без гостей сумма
(if no guest, if guest is new [ order data = guest creation data ])

- 08-10 выручка
- 08-10 посещений
- 10-12 выручка
- 10-12 посещений
- 12-14 выручка
- 12-14 посещений
- 14-16 выручка
- 14-16 посещений
- 16-18 выручка
- 16-18 посещений
- 18-20 выручка
- 18-20 посещений
- 20-22 выручка
- 20-22 посещений
plus time


- меню


2. по гостям

- guestID
- Месяц
- Кол-во посещений
- Покупко на сумму
- Средний \чек

- Позиция1  ...  Позиция5
- Кол-во1  ...   Кол-во5



// 1. verify date string 
// 1.5 find exsisted or create new entry
// 2. gather data that calcs
// 3. gather new / old / no guests

v
*/


var orders = libByName("Дуброва 2018-1").entries();
//var guestStats = libByName("");
//var dayStats = libByName("");


var newEntry = function (i) {
 
  day1 = orders[i].field("Date");    // Fri Jun 25 2018 10:27:00 GMT+0300 (GMT+03:00)
  var isExist = lib().find( day1.toLocaleDateString() );    // 25 июня 2018 г. 10:27:00 GMT+03:00
 
  if ( isExist.length !== 0 ) {
   
   // message('y');
   isExist[0].set( "Выручка", Number(isExist[0].field("Выручка")) + revenue );
   isExist[0].set( "Посещений", Number(isExist[0].field("Посещений")) + 1 );
   isExist[0].set( "Позиций",  Number(isExist[0].field("Позиций")) + positions );
   
   
  } else {
   
   message('n');
   var newEntry = new Object();
   newEntry["Дата"] = Date.parse( day1 );  // timestamp
   newEntry["Выручка"] = Number(revenue);
   newEntry["Посещений"] = 1;
   newEntry["Позиций"] = Number(positions);
   //newEntry["Подарков "] = gifts;
   //newEntry["Скидок"] = discount;

  
   
   lib().create( newEntry );
   
   
  }
 
}


 
for ( var e=280; e < 320; e++ ) {
 
  order = orders[e];
 
  revenue = Number(order.field("К оплате"));
  positions = Number(order.field("Позиций"));
  gifts = Number(order.field("Списать штампы"));
  discount = Number(order.field("Ручная скидка"));

 
  time = order.field("Time");
 
  guestID = order.field("guestID");
  
  
  newEntry(e);
  
}
 
 
 
 
 




