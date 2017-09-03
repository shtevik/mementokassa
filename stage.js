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

var guestStatus = '';
var guestDiscount = 0;
var guestStamps = 0;
var orderDiscount = Number(entry().field("Ручная скидка"));
var addStamps = Number(entry().field("Добавить штампы"));
var minusStamps = Number(entry().field("Списать штампы"));

var outGuestStamps = 0;
var outGuestStatus = '';



// 0.1. 

var guestID = Number(entry().field("guestID").replace(/[^0-9]/g,""));
message ( guestID ) ;
var guestEntry = entry().field('Гость')[0];
var foundGuest =  libByName("Гости").findByKey(guestID);
//message ( guestEntry == null);
var guestEntryID = 0; 
if ( typeof guestEntry !== "undefined" ) guestEntryID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,""));
message (guestEntryID);
var outGuestID = 0;
var outGuestEntry = null;



//message(guestEntry);
//message(foundGuest);



if ( guestID == 0 ) {
	// continue
} else if ( guestID.toString().length !== 11 ) {
	message("Неправильный формат номера. Правильный 79302227555. Либо оставьте поле пустым /'0' (чтобы продолжить без баллов гостю)");
	cancel();
} else if ( foundGuest == null ) {
	message("Гость не найден! Исправьте введенный номер, найдите гостя по-старинке (ч/з поле ниже) или оставьте пустым /'0' (чтобы продолжить без баллов гостю).");
	cancel();
} 






// 1. check trigger phase - create / update
var orderID = entry().field("orderID");

// 1.1. create phase
if ( orderID == 0 ) { 
	message('create phase');
	
	// 1.1.1. set orderID
	entry().set('orderID', Number(Date.now()));
	
	if ( guestID && guestID !== '' && guestID !== 0 ) {

		outGuestID = guestID;
		outGuestEntry = foundGuest;
		
	} else if ( typeof guestEntry !== "undefined" && guestEntry !== null ) {

		outGuestEntry = guestEntry;
		outGuestID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,""));

	}
	
	

 
// 1.2. update phase
} else {  // 2.  ( orderID !== 0 )
  	message('update phase');
	
		
	// 1.2.1. get data from saved entry 
	var foundOrders = lib().find('"'+orderID+'"');
	if ( foundOrders.length > 0 ) {
	var orderSavedData = foundOrders[0];
	if ( typeof orderSavedData !== "undefined" && orderSavedData !== null ) { 

		// 1.2.1.1. gather data from saved entry
		var prevGuestID = Number(orderSavedData.field("guestID").replace(/[^0-9]/g,""));
		var prevAddStamps = Number(orderSavedData.field("Добавить штампы"));
		var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));		

		/// 1.2.1.2. if guest was changed 
		// if ( prevGuestID !== newGuestID ) {
		if ( guestEntryID !== guestID  /* && ( guestEntryID !== null || foundGuest !== null ) */ ) {
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



			// 1.2.1.2.2. new guest was set to order  -- fields are equal
			if ( guestID !== 0 || guestEntryID !== 0 ) { 

				message("new guest was set to order");
				
				// figue out outGuestID
				if ( prevGuestID !== guestID )  {
					outGuestID = guestID;
					outGuestEntry = foundGuest;
				} else if ( prevGuestEntry !== guestEntry )  {
					outGuestID = Number(guestEntry.field("Телефон").replace(/[^0-9]/g,"")); 
					outGuestEntry = guestEntry;
				}
				
				// calculations are done in last step
			} 

		}
			

		/// 1.2.1.3. if only stamps field was changed

		else if ( guestID !== 0 || guestEntryID !== 0  ) {

			message("order's stamps were changed ");
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
	
	

		
	// 2.1. if guest uses own discount sys
	if (guestDiscount !== 0 ) {

		// 2.1.1. use guestDisc if no discount per order
		if ( orderDiscount == 0 ) 
			entry().set("Ручная скидка", guestDiscount);

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
			
			outGuestStamps = outGuestStamps + guestStamps + ( addStamps + minusStamps );
			outGuestStatus = outGuestStamps + guestStamps + 'пз.';			
		}


	}
	
	

	
	// 2.3. guest status
	
	if ( outGuestStamps !== guestStamps ) outGuestEntry.set("Кол-во штампов", outGuestStamps); 

	outGuestEntry.set("Статус", outGuestStatus);

	if ( outGuestStatus !== '' ) outGuestStatus = outGuestStatus +' '+ outGuestEntry.field("Имя") +' '+ outGuestEntry.field("Псевдоним");

	message('guest entry is improved');
}



// 3.

message('after guest stamp work');
message(outGuestEntry);
message(outGuestID);

entry().set("guestID", outGuestID);
entry().set("Гость", outGuestEntry);

entry().set( "guestStatus", outGuestStatus );






