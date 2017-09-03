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



if guestID !== 0 && guestEntry !== 0

on create
        if guestID not emty use it set guestEntry
	elseif guestEntry not empty set guestID
	
	or set outGuestID, outGuestEntry
	
	

on update: if guestID !== guestEntry  ==>  figure out outGuestID comparing to prevOrderData
	if (prevGuestID !== guestID )  outGuestID = guestID;
	else if ( prevGuestEntry !== guestEntry )  outGuestID = guestEntry.field('guestID');
	


common:
	if ( guestID !== guestEntry && ( guestID !== 0 && guestEntry !== null ) )








// 0. gather general data


var guestID = Number(entry().field("Гость. Телефон").replace(/[^0-9]/g,""));
var guestEntry = null;
var outGuestID = 0;
var outGuest = null;


if ( guestID && guestID !== '' && guestID !== 0 ) {

	if ( guestID.toString().length !== 11 ) {
		message("Неправильный формат номера. Правильный 79302227555. Либо, если без гостя, оставьте поле пустым (0)");
		cancel();
	}
	
	else if ( libByName("Гости").findByKey(guestID) == null ) {
		message("Гость не найден! Попробуйте снова, поищите гостя в поле ниже или оставьте пустым (чтобы продолжить без гостя).");
		cancel();
	} 
	
	else {
		guestEntry = libByName("Гости").findByKey(guestID);
	
	}
		
	
	
} else if ( typeof entry().field('Гость')[0] !== "undefined" && entry().field('Гость')[0] !== null ) {

	guestEntry = entry().field('Гость')[0];
	guestID = Number(guest.field("Телефон").replace(/[^0-9]/g,""));

} else {

	guestID = 0;

}







var guestStatus = '';
var guestDiscount = 0;
var guestStamps = 0;
var orderDiscount = Number(entry().field("Ручная скидка"));
var addStamps = Number(entry().field("Добавить штампы"));
var minusStamps = Number(entry().field("Списать штампы"));

var outGuestStamps = 0;
var outGuestStatus = '';





// 1. check trigger phase - create / update
var orderID = entry().field("orderID");

// 1.1. create phase
if ( orderID == 0 ) { 
	
	//message('create phase');
	
	// 1.1.1. set orderID
	entry().set('orderID', Number(Date.now()));


 
// 1.2. update phase
} else {  // 2.  ( orderID !== 0 )
  	//message('update phase');
	

	// figue out newGuestID
	if (prevGuestID !== guestID )  outGuestID = guestID;
	else if ( prevGuestEntry !== guestEntry )  outGuestID = guestEntry.field('guestID');
	
	/// 1.2.1.2. if guest was changed 
	if ( guestID !== guestEntry.field('guestID') ) {
	


		// 1.2.1. get data from saved entry 
		var foundOrders = lib().find('"'+orderID+'"');
		if ( foundOrders.length > 0 ) {
		var orderSavedData = foundOrders[0];
		if ( typeof orderSavedData !== "undefined" && orderSavedData !== null ) { 

			// 1.2.1.1. gather data from saved entry
			var prevGuestID = Number(orderSavedData.field("guestID").replace(/[^0-9]/g,""));
			var prevAddStamps = Number(orderSavedData.field("Добавить штампы"));
			var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));


			/// 1.2.1.2. if guest was changed, deleted or set new
			// if ( prevGuestID !== newGuestID ) {


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
				outGuestStatus = '';	
				guestID = 0;	guest = null;
			}



			// 1.2.1.2.2. new guest was set to order
			if ( guestID !== 0 ) {

				message("new guest was set to order");
				// calculations are done in 1st step
			} 

			//}
			
		} } // 1.2.1

	}

	/// 1.2.1.3. if only stamps field was changed

	else if ( guestID !== 0  ) {
		// deleted: && ( prevAddStamps !== addStamps || prevMinusStamps !== minusStamps ) 
		// if there'ra changes only in menu, prevent repeat of the same stamps calc:
		// mirrow calc, that is done below in the doc

		message("order's stamps were changed ");
		outGuestStamps = outGuestStamps  - ( prevAddStamps + prevMinusStamps );
	}


	


} // 1.


// 2. check if guest is set
if ( guestID !== 0 && typeof guest !== "undefined" && guest !== null ) { 


	guestDiscount = Number(guest.field("ПерсонСкидка"));
	guestStamps = Number(guest.field("Кол-во штампов"));

		
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
	
	if ( outGuestStamps !== guestStamps ) guest.set("Кол-во штампов", outGuestStamps); 

	guest.set("Статус", outGuestStatus);

	if ( outGuestStatus !== '' ) outGuestStatus = outGuestStatus +' '+ guest.field("Имя") +' '+ guest.field("Псевдоним");

}



// 3.
//message(outGuestStatus);
//message(guestID);

entry().set("guestID", guestID);

entry().set( "guestStatus", outGuestStatus );






