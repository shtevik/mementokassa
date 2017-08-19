


// 0.0. gather general data

var guest = entry().field('Гость')[0];
var guestID = 0;
var guestStatus = '';
var guestDiscount = 0;
var guestStamps = 0;
var orderDiscount = Number(entry().field("Ручная скидка"));
var addStamps = Number(entry().field("Добавить штампы"));
var minusStamps = Number(entry().field("Списать штампы"));

var outGuestStamps = 0;
var outGuestStatus = '';
var outOrderGuestStatus = '';

 


if ( typeof guest !== "undefined" && guest !== null ) { 

	guestID = Number(guest.field("Телефон").replace(/[^0-9]/g,""));
	guestDiscount = Number(guest.field("ПерсонСкидка"));
	guestStamps = Number(guest.field("Кол-во штампов"));

}













// 0. check trigger phase - create / update
var orderID = entry().field("orderID");

if ( orderID == 0 ) {  // 1. create
	message('create phase');
	
	// 1.1. set orderID
	entry().set('orderID', Number(Date.now()));


  
} else {  // 2. update phase  ( orderID !== 0 )
  	//message('update phase');
	
	
	// 2.1. get data from saved entry 
	var foundOrders = lib().find('"'+orderID+'"');
	if ( foundOrders.length > 0 ) {
	var orderSavedData = foundOrders[0];
	if ( typeof orderSavedData !== "undefined" && orderSavedData !== null ) { 
	
		// 2.1.1. gather data from prev entry
		var prevGuestID = Number(orderSavedData.field('guestID').replace(/[^0-9]/g,""));
		var prevAddStamps = Number(orderSavedData.field("Добавить штампы"));
		var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));

		
		/// 2.1.3. if guest was changed, deleted or set new
		if ( prevGuestID !== guestID ) {
			

			// 2.1.3.1. guest was deleted or changed to new one
			if ( prevGuestID !== 0 ) {
				
				message("guest was changed - or deleted");
				// get guest entity (from prev order entry)
				
				var foundGuests = libByName("Гости").find('"'+prevGuestID+'"');
				if ( foundGuests.length > 0 ) { 
				var prevGuest = foundGuests[0];
				if ( typeof prevGuest !== "undefined" && prevGuest !== null ) { 
					message ("guest was found");
					if ( prevAddStamps !== 0 || prevMinusStamps !== 0 ) {
						var prevGuestStamps = Number(prevGuest.field("Кол-во штампов"));
						prevGuestStamps = prevGuestStamps - ( prevAddStamps + prevMinusStamps );
						prevGuest.set("Кол-во штампов", prevGuestStamps);
						prevGuest.set("Статус", prevGuestStamps+"шт.");
					}
				} } 
				
				outGuestStatus = '';
			}


			// 2.1.3.2. new guest was set to order
 			if ( newGuestID !== 0 ) {

 				// message("new guest was set to order");
				// calculations are done in 1st step
 			} 

		}
			
			
		/// 2.1.4. if only stamps field was changed

		else if ( guestID !== 0 && ( prevAddStamps !== addStamps || prevMinusStamps !== minusStamps ) ) {

			message("order stamps were changed ");

			outGuestStamps = outGuestStamps - ( prevAddStamps + prevMinusStamps );
		}


	} } // 2.1.


} // 0.




// 1.2. check if guest is set
if ( typeof guest !== "undefined" && guest !== null ) { 
	
	message(guest);
	
	// 1.2.2. if guest uses own discount sys
	if (guestDiscount !== 0 ) {

		// 1.2.2.1. use guestDisc if no discount per order
		if ( orderDiscount == 0 ) 
			entry().set("Ручная скидка", guestDiscount);

		outGuestStatus += guestDiscount+'% '; // set orderGuestStatus if guest was changed 

		// 1.2.2.2. protect from stamps adding
		if ( addStamps !== 0 || minusStamps !== 0 ) {
			message("Аа, нет! Нельзя начислять штампы \n\nгостю с персональной скидкой");
			cancel();
		}

	// 1.2.3 if stamp system
	} else {

		// 1.2.3.1. if stamps and orderDiscount are set at the same time
		if ( orderDiscount !== 0 && ( addStamps !== 0 || minusStamps !== 0 ) ) {
			message("Аа, нет! Нельзя одновременно \nначислить штампы и пробить скидку");
			cancel(); 
		}

		// 1.2.3.2.
		else {
			outGuestStamps = guestStamps+addStamps+minusStamps;
			outGuestStatus = outGuestStamps+'шт.';
			//outOrderGuestStatus = outGuestStamps+'шт.';
		}

	}
	

	
	// 1.2.4. guest status
	
	guest.set("Кол-во штампов", outGuestStamps); 

	guest.set("Статус", outGuestStatus);

	if ( outGuestStatus !== '' ) outGuestStatus = outGuestStatus +' '+ guest.field("Имя") +' '+ guest.field("Псевдоним");

}



	message(outGuestStatus);
	message(guestID);


entry().set("guestID", guestID);

entry().set( "guestStatus", outGuestStatus );







