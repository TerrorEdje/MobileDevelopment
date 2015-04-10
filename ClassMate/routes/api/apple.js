var express = require('express');
var router = express.Router();

router.route('/login/:username/:password').get(function(req, res) {

	if (req.params.username == 'thijsda' && req.params.password == 'Avans2015') {
		res.status(201);
		return res.send('{"token": 1}');
	} else {
		res.status(404);
		return res.send('{"token": null}');
	}
});

router.route('/prikbord/:token').get(function(req, res) {
	if (req.params.token == "1") {
		res.status(201);
		return res.send('{"courses": [{"id": "0","status": null,"address": "Zonnedauw, 5052 CH  Goirle","deadline": "din 14 apr 2015","tags": "Computer, Windows 7, Virusscanner, APK/opschonen, Installeren software, Instellingen software","description": "- installeren nieuwe antivirus software ESET aanbieding http://www.eset.com/nl/studentaanhuis/ -	Computer/laptop traag. Nakijken en opschonen. APK. Wie zou dit tegen het eind van de maand (april) kunnen doen? -	Geen beschikbaarheid"},{"id": "1","status": 2,"address": "Laarstraat, 5025 VK  Tilburg","deadline": "vri 10 apr 2015","tags": "Computer, Printer, MacOS, Windows 7, Windows Vista, APK/opschonen, Installeren software, Instellingen software, E-mail problemen oplossen","description": "Aantekening klant op webformulier: installeren van programmas / e-mail account, aansluiten op printer, traagheid. etc. I-mac en windows computer. Wie kan hier naartoe? Liefste in de avond."},{"id": "2","status": 1,"address": "Diessenseweg, 5081 AK  Hilvarenbeek","deadline": "vri 17 apr 2015","tags": "Computer, Netwerk: Algemeen, Netwerk: Router, MacOS, Social Media, Social Media: Facebook, APK/opschonen, Installeren software, Instellingen software, Internetverbinding probleem oplossen","description": "Imac Traag Wifi Wachtwoord instellen (is onbeveiligd) Instagram twitter social media aan facebook -	Geen beschikbaarheid, wie zou dit kunnen doen? Eventueel ophalen op centraal punt is een optie"}]}');
	} else {
		res.status(404);
		return res.send('{"courses": null}');
	}
});

module.exports = router;