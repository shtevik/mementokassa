


// 0. gather general data

var guest = entry().field('Гость')[0];
var guestID = 0;
var guestStatus = '';
var guestDiscount = 0;
var guestStamps = 0;
var orderDiscount = Number(entry().field("Ручная скидка"));
var addStamps = Number(entry().field("Добавить штампы"));
var minusStamps = Number(entry().field("Списать штампы"));


if ( typeof guest !== "undefined" && guest !== null ) { 

	guestID = Number(guest.field("Телефон").replace(/[^0-9]/g,""));
	guestDiscount = Number(guest.field("ПерсонСкидка"));
	guestStamps = Number(guest.field("Кол-во штампов"));

}

var outGuestStamps = guestStamps;
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
	
	
	// 1.2.1. get data from saved entry 
	var foundOrders = lib().find('"'+orderID+'"');
	if ( foundOrders.length > 0 ) {
	var orderSavedData = foundOrders[0];
	if ( typeof orderSavedData !== "undefined" && orderSavedData !== null ) { 
	
		// 1.2.1.1. gather data from prev entry
		var prevGuestID = Number(orderSavedData.field("guestID").replace(/[^0-9]/g,""));
		var prevAddStamps = Number(orderSavedData.field("Добавить штампы"));
		var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));
		
		
		/// 1.2.1.2. if guest was changed, deleted or set new
		if ( prevGuestID !== guestID ) {
			

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

		}
			
			
		/// 1.2.1.3. if only stamps field was changed

		else if ( guestID !== 0  ) {
			// deleted: && ( prevAddStamps !== addStamps || prevMinusStamps !== minusStamps ) 
			// if there'ra changes only in menu, prevent repeat of the same stamps calc:
			// mirrow calc, that is done below in the doc

			message("order stamps were changed ");
			outGuestStamps = outGuestStamps  - ( prevAddStamps + prevMinusStamps );
		}


	} } // 1.2.1


} // 1.


// 2. check if guest is set
if ( guestID !== 0 && typeof guest !== "undefined" && guest !== null ) { 
		
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
			
			outGuestStamps = outGuestStamps + ( addStamps + minusStamps );
			outGuestStatus = outGuestStamps+'шт.';			
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







