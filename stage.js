/* 
tests:
- add guest discount / stamps
- delete guest
- change stamps amount
- change guest system : discount-> stamps; stamps -> discount;


1.
guest - link field or/and number field

situations:
- number field to find
- link field to create or search by name or to changed disc sys or get know curr number of stamps

result work with both fields


guestID 
guestEntry



if guestID == 0 && guestEntry == 0 || 
guestID !== 0 && guestEntry !== 0 && guestID !== guestEntry

on create
        if guestID not emty use it set guestEntry
	elseif guestEntry not empty set guestID
	
	or set outGuestID, outGuestEntry
	
	

on update: if guestID !== guestEntry  ==>  figure out outGuestID comparing to prevOrderData
	if (prevGuestID !== guestID )  outGuestID = guestID;
	else if ( prevGuestEntry !== guestEntry )  outGuestID = guestEntry.field('guestID');
	


common:
	if ( guestID !== guestEntry && ( guestID !== 0 && guestEntry !== null ) )




*/



// 0. gather general data

var totalSum = 0;
var orderString = '';
var addStamps = 0; 
//var addStamps = Number(entry().field("Добавить штампы"));
var orderDiscount = Number(entry().field("Ручная скидка"));
var minusStamps = Number(entry().field("Списать штампы"));
var priceStatus = '';
var outSum = 0;

var guestStatus = '';
var guestDiscount = 0;
var guestStamps = 0;

var outGuestStamps = 0;
var outGuestStatus = '';

var smsStatus = '';


// 0.1. 

var menu = entry().field('Меню');

// clear menu-positions list on orders overall screen
for ( var i = 1; i < 7; i++ ) {
   entry().set("position"+i, '');
}

if ( menu.length > 0 ) {

  var structuredMenu = {};
  for ( var position, price, amount, posipka, i=0; i < menu.length; i++ ) {
  
    posipka = '';
    if ( menu[i].attr("Посыпка") !== "[Посыпка/Доп]"  &&  menu[i].attr("Посыпка") !== "[Доп]") posipka = "/" + menu[i].attr("Посыпка"); 
    position = menu[i].field("Наименование") + posipka;
    price = menu[i].field("Цена");
    amount = menu[i].attr("Кол-во"); 
    
    if ( !structuredMenu[position] ) {
      structuredMenu[position] = { count: amount, price: price }; 
    } else { 
      structuredMenu[position].count += amount;
    } 
    addStamps += amount;   
  }
	
   var structuredMenuLength = Object.keys(structuredMenu).length; 

  var x; var i = 1; 
  for ( x in structuredMenu ) {
    
    totalSum += structuredMenu[x].price * structuredMenu[x].count;
    if ( orderString == '' ) { 
	    if ( structuredMenuLength !== 1 ) orderString += i + ').  ';
	    orderString += structuredMenu[x].count +'x'+ x;
    }
    else orderString += ';   ' + i + ').  ' + structuredMenu[x].count +'x'+ x;
	  
    if ( i < 6 ) entry().set("position"+i, structuredMenu[x].count +'x'+ x);
    else if ( i == 6 ) { 
	    entry().set("position"+i, 'см. еще..');	    
    }  
    i++;  
  }

	
}






//. 2 guest work
var guestID = Number(entry().field("guestID").replace(/[^0-9]/g,""));
//message ( guestID ) ;
var guestEntry = entry().field('Гость')[0];
var foundGuest =  libByName("Гости").findByKey(guestID);
//message ( guestEntry == null);
var guestEntryID = 0; 
if ( typeof guestEntry !== "undefined" ) guestEntryID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,""));
//message (guestEntryID);
var outGuestID = 0;
var outGuestEntry = null;




// prevent guest function
if ( typeof guestEntry !== "undefined" ) {
	
	message("Пробивайте без гостей! Тестируем новые Онлайн-кассы. Начисление и списание позиций гостям пока запрещены! Виктор, следит за вами ;) ");
	message("Пробивайте без гостей! Тестируем новые Онлайн-кассы. Начисление и списание позиций гостям пока запрещены! Виктор, следит за вами ;) ");
	cancel();
	
} else {


	/*
	if ( guestID == 0 ) {
		// continue
	} else if ( guestID.toString().length !== 11 ) {
		message("Неправильный формат номера. Правильный 79302227555. Либо оставьте поле пустым /'0' (чтобы продолжить без баллов гостю)");
		message("Неправильный формат номера. Правильный 79302227555. Либо оставьте поле пустым /'0' (чтобы продолжить без баллов гостю)");
		cancel();
	} else if ( foundGuest == null ) {
		message("Гость не найден! Исправьте введенный номер, найдите гостя по-старинке (ч/з поле ниже) или оставьте пустым /'0' (чтобы продолжить без баллов гостю).");
		message("Гость не найден! Исправьте введенный номер, найдите гостя по-старинке (ч/з поле ниже) или оставьте пустым /'0' (чтобы продолжить без баллов гостю).");
		cancel();
	} 






	// 1. check trigger phase - create / update
	var orderID = entry().field("orderID");

	// 1.1. create phase
	if ( orderID == 0 ) { 
		//message('create phase');

		// 1.1.1. set orderID
		entry().set('orderID', Number(Date.now()));

		if ( guestID && guestID !== '' && guestID !== 0 ) {

			outGuestID = guestID;
			outGuestEntry = foundGuest;

			smsStatus = "СМС нет";

		} else if ( typeof guestEntry !== "undefined" && guestEntry !== null ) {

			outGuestEntry = guestEntry;
			outGuestID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,""));

			smsStatus = "СМС нет";

		}




	// 1.2. update phase
	} else {  // 2.  ( orderID !== 0 )
		//message('update phase');



		// 1.2.1. get data from saved entry 
		var foundOrders = lib().find('"'+orderID+'"'); // if table is not index yet, mistake will be return
		if ( foundOrders.length > 0 ) {
			//message ('prev data is found');
		var orderSavedData = foundOrders[0];
		if ( typeof orderSavedData !== "undefined" && orderSavedData !== null ) { 

			// 1.2.1.1. gather data from saved entry
			var prevGuestID = Number(orderSavedData.field("guestID").replace(/[^0-9]/g,""));
			var prevAddStamps = Number(orderSavedData.field("Начисленно позиций"));
			var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));

			/// 1.2.1.2. if guest was changed 
			// if ( prevGuestID !== newGuestID ) {
			if ( guestEntryID !== guestID  ) {
				// fields differs, and one of them may be zero


				// 1.2.1.2.1. guest was deleted or changed to new one
				if ( prevGuestID !== 0 ) {

					message("guest was changed - or deleted");

					var prevGuest = libByName("Гости").findByKey(prevGuestID);
					if ( typeof prevGuest !== "undefined" && prevGuest !== null ) { 
						if ( prevAddStamps !== 0 || prevMinusStamps !== 0 ) {
							var prevGuestStamps = Number(prevGuest.field("Кол-во штампов"));
							prevGuestStamps = prevGuestStamps - ( prevAddStamps + prevMinusStamps );
							prevGuest.set("Кол-во штампов", prevGuestStamps);
							prevGuest.set("Статус", prevGuestStamps+"шт.");
						}
					} 	
					//outGuestStatus = '';	
					outGuestID = 0;	outGuestEntry = null;
				}


				// figure out that new guest was really set && it's not just unsetting one field of old guest
				//if new guest - prev is zero and 
					//if ( prevGuest == 0 ) && ( guestEntry !== 0 || guestID !== 0 )
				//if one differs from all 3 others and not equal zero
					//if ( ( guestENtryID == prevGuestID && guestID !== 0 ) ||
					     // ( guestID == prevGuestID && guestEntryID !== 0 ) )


				// 1.2.1.2.2. new guest was set to order  -- fields are equal
				if (  guestID !== 0 || guestEntryID !== 0 ) { 

					message("new guest was set to order");

					// figue out outGuestID
					if ( prevGuestID !== guestID && guestID !== 0 )  {
						outGuestID = guestID;
						outGuestEntry = foundGuest;
					} else if ( prevGuestID !== guestEntryID && guestEntryID !== 0 )  { 
						outGuestID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,"")); 
						outGuestEntry = guestEntry;
					}

					smsStatus = "СМС нет";
					// calculations are done in last step

				} 

				// if guest was deleted
				if ( prevGuestID !== 0 && ( guestID == 0 || guestEntryID == 0 ) ) {
					message ('guest was certainly deleted');
					outGuestID = 0;	outGuestEntry = null;
					smsStatus = "";
				}
				message (' check');
			}


			/// 1.2.1.3. if guest wasn't changed

			else if ( guestID !== 0  ) {

				message("guest wasn't changed");
				outGuestID = guestID;
				outGuestEntry = guestEntry;
				outGuestStamps = outGuestStamps - ( prevAddStamps + prevMinusStamps );
			}


		} } // 1.2.1

	} // 1.





	// 2. check if guest is set
	if ( outGuestID !== 0 && typeof outGuestEntry !== "undefined" && outGuestEntry !== null ) { 

		guestDiscount = Number(outGuestEntry.field("ПерсонСкидка"));
		guestStamps = Number(outGuestEntry.field("Кол-во штампов"));
		outGuestStamps += guestStamps;
		outGuestStatus = outGuestEntry.field("Статус");


		// 2.1. if guest uses own discount sys
		if (guestDiscount !== 0 ) {
			addStamps = 0;

			// 2.1.1. use guestDisc if no discount per order
			if ( orderDiscount == 0 ) {
				orderDiscount = guestDiscount;
				entry().set("Ручная скидка", guestDiscount);
			}

			outGuestStatus = guestDiscount+'% '; // set orderGuestStatus if guest was changed 

			// 2.1.2. protect from stamps adding
			if ( addStamps !== 0 || minusStamps !== 0 ) {
				message("Аа, нет! Нельзя начислять штампы \n\nгостю с персональной скидкой");
				cancel();
			}

		// 2.2. if stamp system
		} else {

			// 2.2.1.
			if ( addStamps !== 0 || minusStamps !== 0 ) { 

				if ( orderDiscount !== 0  ) {
					message("Аа, нет! Нельзя одновременно \nначислить штампы и пробить скидку");
					cancel(); 
				}

				outGuestStamps += ( addStamps + minusStamps );
				outGuestStatus = outGuestStamps + 'пз.';			
			}
		}


		// 2.3. guest status

		if ( outGuestStamps !== guestStamps ) outGuestEntry.set("Кол-во штампов", outGuestStamps); 

		outGuestEntry.set("Статус", outGuestStatus);

		if ( outGuestStatus !== '' ) outGuestStatus = outGuestStatus +' '+ outGuestEntry.field("Имя") +' '+ outGuestEntry.field("Псевдоним");

		//message('guest entry is improved');

	}
	*/

	
}




// 3.

//message(outGuestEntry);
//message(outGuestID);


if ( orderDiscount == 0 ) { 
  outSum = totalSum;
  priceStatus = outSum + " руб.   ";
} else { 
  outSum = totalSum * ( 100 - orderDiscount ) / 100;
  outSum = Math.floor ( outSum * 0.1 ) / 0.1;
  priceStatus = outSum + "руб. " + orderDiscount + "%   ";
}

entry().set("К оплате", outSum);
entry().set("Заказ-перечень", orderString);
entry().set("Начисленно позиций", addStamps);

entry().set("priceStatus", priceStatus );


/* fields
- orderString
- sum & outSum
- status string "rub. 20%"
*/


/* prevent guest function 
entry().set("guestID", outGuestID);
entry().set("Гость", outGuestEntry);
entry().set( "guestStatus", outGuestStatus );
*/

/* sms-case things: 
on create:
	- guest is set - set smsStatus to "not send"
on-update:
	- guest is added/changed - set smsStatus to "not send"
	- guest is deletes - set sms Status to ""

*/
entry().set("СМС отправлен?", smsStatus);
		




	
	
	

//message('after guest stamp work');




