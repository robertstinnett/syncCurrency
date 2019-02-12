//syncCurrency by dmxrob - http://blog.dmxrob.net | ssh://bbs.dmxrob.net | telnet://bbs.dmxrob
//Code for Error Handling by Kirkman - http://breakintochat.com & https://github.com/Kirkman


var version = "1.10 - 02/12/2019";

var apiEndpoint = "https://openexchangerates.org/api/";
var apiLatestCall = "latest.json?app_id=";
var apiCurrencyListCall = "currencies.json?prettyprint=true&show_alternative=false&show_inactive=false";  // Freebie call!

var usd_amount = 1;  // Base currency amount in USD

log(user.ip_address);

//Load modopts.ini info early so we can detect if the section exists for [syncCurrency]
//see sysop.txt for what should be in this section
var opts=load({},"modopts.js","syncCurrency"); 
if (opts === null) {
	log("ERROR in currency.js: opts is null.");
	log("ERROR in currency.js: Are you sure you have a section in modopts.ini labeled [syncCurrency]? See sysop.txt for instructions.");
	exit();
}

load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 



// Your Open Exchange Rates API key is defined in the file /sbbs/ctrl/modopts.ini
// See the sysop.txt file for information on how to obtain a free key.
var openExchangeAPIkey = opts.openExchangeAPIkey;


// Find out what the SYSOPS wants displayed by default by reading options
// See the sysop.txt file for information on how to configure currency defaults.
var currencyTypes = opts.currencyTypes
var currencyTypeList = currencyTypes.split("|");



// Setup some color variables
var gy = "\1n\001w"; //Synchronet Ctrl-A Code for Normal White (which looks gray)
var wh = "\001w\1h"; //Synchronet Ctrl-A Code for High Intensity White
var drkyl = "\001n\001y"; //Synchronet Ctrl-A Code for Dark (normal) Yellow
var yl = "\001y\1h"; //Synchronet Ctrl-A Code for High Intensity Yellow
var drkbl = "\001n\001b"; //Synchronet Ctrl-A Code for Dark (normal) Blue
var bl = "\001b\1h"; //Synchronet Ctrl-A Code for High Intensity Blue
var drkrd = "\001n\001r"; //Synchronet Ctrl-A Code for Dark (normal) Red
var rd = "\001r\1h"; //Synchronet Ctrl-A Code for High Intensity Red
var drkcy = "\001n\001c"; //Synchronet Ctrl-A Code for Dark (normal) Cyan
var cy = "\001c\1h"; //Synchronet Ctrl-A Code for High Intensity Cyan



function getExchangeRates() {
// This function calls the API and displays the current exchange rates. 

		
		// Make the API call
		var req = new HTTPRequest();
		var currentRatesResponse = req.Get(apiEndpoint + apiLatestCall + openExchangeAPIkey);
		if (currentRatesResponse === undefined) {
			// Something went wrong
			log("ERROR in currency.js:  Request to openexchangerates.org returned nothing/undefined");
			console.putmsg("We're sorry, Currency Exchange Rates are not available right now. :-(")
			exit();
		}

		// Parse the JSON
		var currentRatesJSON = JSON.parse(currentRatesResponse);



		// Print it out
		var exchangeRates = Object.keys(currentRatesJSON.rates);
		var dt = new Date(currentRatesJSON.timestamp*1000);
		console.crlf();
		console.putmsg(bl + "Exchange Rates Current as of " + yl + dt);
		console.crlf();
		console.putmsg(bl + "Rates shown below are for " + wh + usd_amount + " USD.")
		console.crlf();
		console.crlf();
	
		
		for (var i = 0; i < exchangeRates.length; i++) {
			if (currencyTypeList.indexOf(exchangeRates[i]) > -1) {
				console.putmsg(currentRatesJSON.rates[exchangeRates[i]] + " - " + exchangeRates[i]);
				console.crlf();
			}
		}

		
	
	
		console.crlf();

		// Return JSON object with rates so we don't have to continue making repeat calls to API 

		return currentRatesJSON; 
		
		



}


function searchExchangeRates(currentRatesJSON) {
	// This function will allow the user to search Exchange Rates for a currency.

	var exchangeRates = Object.keys(currentRatesJSON.rates);
	var ready_to_exit = false;
	var user_input = "";
	
	var dt = new Date(currentRatesJSON.timestamp*1000);

	while (!ready_to_exit && bbs.online) {
		console.putmsg("Enter currency to search for, ? for list or Q to quit: ")
		user_input = console.getstr(user_input,3);  // Read a maximum of 3 letters in.
		
		if (user_input == "Q" || user_input == "q") {
			ready_to_exit = true;
		}
		else if (user_input == "?") { // Display all the currencies to choose from
			console.putmsg(rd + "Valid currencies to choose from:");
			console.crlf();
			for (var i = 0; i < exchangeRates.length; i++) { // Print out currencies, 15 per line.
					if (i%15 == 0) {
						console.crlf();
					}
					console.putmsg(wh + exchangeRates[i] + gy + ",");
					
				
			}
			console.crlf();


		}
		else if (exchangeRates.indexOf(user_input) != -1) { //Found it, display it
			console.crlf();
			console.putmsg(wh + usd_amount + cy + " USD" + bl + " is equal to " + wh + currentRatesJSON.rates[user_input] + cy + " " + user_input + bl + " as of " + yl + dt);
			console.crlf(2);
		}
		else {
			console.putmsg(rd + "Invalid choice " + wh + user_input + rd + ". Try again.");
			console.crlf();
		}

		

	}

}
       
			

try {

	// Print a welcome message and header
	console.clear();
	console.putmsg(bl + "syncCurrency " + cy + "v" + version);
	console.crlf();
	console.putmsg(bl + "by " + wh + "dmxrob");
	console.crlf();

	var currentRatesJSON = getExchangeRates();
	searchExchangeRates(currentRatesJSON);
    console.pause();
    console.clear();
    console.aborted = false;

} catch (err) {

log("ERROR in currency.js. " + err);
log(LOG_DEBUG,"DEBUG for currency.js. API call looked like this at time of error: " + apiEndpoint + openExchangeAPIkey);
log(LOG_DEBUG,"DEBUG for currency.js. The user.connection object looked like this at the time of error: " + user.connection);


} finally {

    exit();

}

exit();
