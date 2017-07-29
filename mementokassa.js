
// 0. check trigger phase - create / update
var orderID = entry().field("orderID");
if ( orderID == 0 ) {

	// 1. create
	//message('create');

	// 1.1. set orderID
	entry().set('orderID', Number(Date.now()));

	// 1.2. check if guest is set
	var guest = entry().field('Гость')[0];
	var guestID = 0;
	if ( typeof guest !== "undefined" && guest !== null ) { 

		// 1.2.1. gather all data
		guestID = guest.field("Телефон").replace(/[^0-9]/g,"");
		var guestStatus = '';
		var guestDiscount = Number(guest.field("ПерсонСкидка"));
		var orderDiscount = Number(entry().field("Ручная скидка"));
		var currStamps = Number(entry().field("Добавить штампы"));
		var currMinusStamps = Number(entry().field("Списать штампы"));


		// 1.2.2. if guest uses own discount sys
		if (guestDiscount !== 0 ) {

			// 1.2.2.1. use guestDisc if no discount per order
			if ( orderDiscount == 0 ) 
				entry().set("Ручная скидка", guestDiscount);

			guestStatus += guestDiscount+'% ';

			// 1.2.2.2. protect from stamps adding
			if ( currStamps !== 0 || currMinusStamps !== 0 ) {
				message("Аа, нет! Нельзя начислять штампы \n\nгостю с персональной скидкой");
				cancel();
			}


		// 1.2.3 if stamp system
		} else {

			// 1.2.3.1. if stamps and orderDiscount are set at the same time
			if ( orderDiscount !== 0 && ( currStamps !== 0 || currMinusStamps !== 0 ) ) {
				message("Аа, нет! Нельзя одновременно \nначислить штампы и пробить скидку");
				cancel(); 
			}

			// 1.2.3.2.
			else {
				var guestStamps = Number(guest.field("Кол-во штампов"))+currStamps+currMinusStamps;
				guest.set("Кол-во штампов", guestStamps); 
				guestStatus += guestStamps+'шт.';
			}

		}


		// 1.2.4. guest status
		guest.set("Статус", guestStatus);
		guestStatus += guest.field("Имя")+' '+guest.field("Псевдоним");
		entry().set("guestStatus", guestStatus );

	}

	// 1.3. set guestiD
	entry().set("guestID", guestID);


  
} else {
  
	
	
	
	
	
	// 2. update phase
  	//message('update');
	

	// 2.1. get data from saved entry 
	var foundOrders = lib().find('"'+orderID+'"');
	if ( foundOrders.length > 0 ) {
		var orderSavedData = foundOrders[0];

		
		// 2.1.1. get prev and new guest entities if are set

		var newGuest = entry().field('Гость')[0];
		var prevGuestID = Number(orderSavedData.field('guestID'));
		// doesn't available to re-save afterall

		if ( typeof newGuest == "undefined" ) // if guest is deleted 
			// run func to delete stamps from prevGuest
			var newGuestID = 0;
		else //if ( prevGuestID == 0 ) // if guest is added 
			// run func to add stamps to newGuest
			var newGuestID = Number(newGuest.field("Телефон"));

		//message(prevGuestID);
		//message(newGuestID);


		// 2.1.2. get prev and new stamps change

		var prevStamps = Number(orderSavedData.field("Добавить штампы"));
		var newStamps = Number(entry().field("Добавить штампы"));
		var prevMinusStamps = Number(orderSavedData.field("Списать штампы"));
		var newMinusStamps = Number(entry().field("Списать штампы"));
		var guestStatus = '';



		/// 2.1.3. if guest was changed

		if ( prevGuestID !== newGuestID ) {

			message("guest is changed");
			entry().set("guestID", newGuestID);


			// 2.1.3.1. delete old data from old guest

			if ( prevGuestID !== 0 ) {
			// ( ( prevGuestID !== 0 && prevStamps !== 0 ) || newGuestID == 0 ) 
				message("change old guest");
				var foundGuests = libByName("Гости").find('"'+prevGuestID+'"');
				if ( foundGuests.length > 0 ) { //message("lib accessed");
					var prevGuest = foundGuests[0];
					guestStatus = '';
					if ( prevStamps !== 0 ) {
						var guestStamps = Number(prevGuest.field("Кол-во штампов"))-prevStamps;
						prevGuest.set("Кол-во штампов", guestStamps);
						prevGuest.set("Статус", guestStamps+"шт.");
					}
					// entry().set("guestStatus", "");
					guestStatus = '';
				} 
			}


			// 2.1.3.2. set new number of stamps to new guest

			if ( newGuestID !== 0 ) {
				message("add new guest");

				// 2.1.3.2.1. gather all data
				var guestStatus = '';
				var guestDiscount = Number(newGuest.field("ПерсонСкидка"));
				var orderDiscount = Number(entry().field("Ручная скидка"));

				//message(newGuest.field('Статус'));

				// 2.1.3.2.2. if guest uses own discount sys
				if (guestDiscount !== 0 ) {

					message ('guestDiscount'+guestDiscount);

					// use guestDisc if no discount per order
					if ( orderDiscount == 0 ) 
						entry().set("Ручная скидка", guestDiscount);
					guestStatus += guestDiscount+'% ';

					// protect from stamps adding
					if ( newStamps !== 0 || newMinusStamps !== 0 ) {
						message("Аа, нет! Нельзя начислять штампы \n\nгостю с персональной скидкой");
						cancel(); 
					}


				// 2.1.3.2.3. if guest uses stamp system
				} else {

					message ('stampsbsys');

					// prevent from orderDiscount usage
					if ( orderDiscount !== 0 && ( newStamps !== 0 || newMinusStamps !== 0 ) ) {
						message("Аа, нет! Нельзя одновременно \nначислить штампы и пробить скидку");
						cancel(); 
					}

					// calc new stamps
					else {
						var guestStamps = Number(newGuest.field("Кол-во штампов"))+newStamps+newMinusStamps;
						newGuest.set("Кол-во штампов", guestStamps); 
						guestStatus += guestStamps+'шт.';
					}

				}


				// 2.1.3.2.4. guest status

				newGuest.set("Статус", guestStatus);
				guestStatus += newGuest.field("Имя")+' '+newGuest.field("Псевдоним");
				entry().set("guestStatus", guestStatus );

			} // 2.1.3.2. 

		} // 2.1.3.


		
		
		/// 2.1.4. if only stamps field was changed

		else if ( prevStamps !== newStamps || prevMinusStamps !== newMinusStamps ) {
			
			// count difference - change overall stamps field
			message("new stamps number");
			//message(prevStamps);
			//messgae(newStamps);

			var stampDiff = newStamps-prevStamps + newMinusStamps - prevMinusStamps;
			var guestStamps = Number(newGuest.field("Кол-во штампов"))+stampDiff;
			newGuest.set("Кол-во штампов", guestStamps);



			guestStatus = guestStamps+'шт. '+newGuest.field("Имя")+' '+
			newGuest.field("Псевдоним");
			entry().set("guestStatus", guestStatus);

		}





	} // 2.1.





  
} // 0.
