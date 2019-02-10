## Synopsis

**syncCurrency** is a currency exchange door originally designed for running under [Synchronet BBS Software](http://www.synchro.net).  It will display the current
exchange rates for $1.00USD in various currencies.  It uses data from the Free API at [Open Exchange Rates](https://openexchangerates.org).  It was originally written by [Robert Stinnett aka dmxrob](robert@robertstinnett.com) of [Gateway to the West BBS - bbs.dmxrob.net](telnet://bbs.dmxrob.net) as a way to get back into BBSing and learn more about Synchronet and Javascript.

## Screenshots 

Regular View:  
![Coming Soon]()

## Code Example

The majority of what is happening in this app is based off of one query. Note, it combines four queries into one: conditions, forecast, astronomy, and alerts. It also adds through the "WXlang" variable the possibility for results in over 80 languages.

		var req= new HTTPRequest();
		var current = req.Get("http://api.wunderground.com/api/" + wungrndAPIkey + "/conditions/forecast/astronomy/alerts/" + WXlang + "q/" + wungrndQuery);
		var cu = JSON.parse(current);

## Installation

Check out [sysop.txt](https://github.com/KenDB3/syncWXremix/blob/master/sysop.txt) for full installation instructions.

## License

This project is under ISC License, and so is the artwork in the "icons" folder. 
Please see the [LICENSE](https://github.com/KenDB3/syncWXremix/blob/master/LICENSE) file for the project, and the [LICENSE](https://github.com/KenDB3/syncWXremix/blob/master/icons/LICENSE) file for the icons.

## Revision History (change log)

1.00 (2019-02-10)
* First full release, here's hoping for the best!
