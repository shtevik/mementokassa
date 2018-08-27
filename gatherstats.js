

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
- Средний чек

- Позиция1  ...  Позиция5
- Кол-во1  ...   Кол-во5




*/


var orders = libByName("");
var guestStats = libByName("");
var dayStats = libByName("");





foreach ( var i=0; orders.length > i; i++ ) {


var statOfDay, date, revenue, avBill, visits, gifts, discount;



date = orders[i].field("Дата");
revenue = orders[i].field("К оплате");
[..]




statOfDay = dayStats.find(date)[0];

 if ( statOfDay ) { //   if is not created day entry

    statOfDay.set( "Выручка", statOfDay.field("К оплате") + revenue );

  
  } else {  // is created yet
   
  
    var newDay = new Object();    
    newDay["Дата"] = date;
    dayStats.create(newDay);
   
     
  }
   

   
   




}
