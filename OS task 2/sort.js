var ERROR_CODE; //Êîä îøèáêè. 0 - ÂÑÅ ÕÎĞÎØÎ

function sIncrease(i, ii) { //Ôóíêöèÿ ñîğòèğîâêè ïî âîçğàñòàíèş
    if (i > ii)
        return 1;
    else if (i < ii)
        return -1;
    else
        return 0;
}

var fso = new ActiveXObject("Scripting.FileSystemObject");

var buffer = new Array(); //Ñşäà ÷òàåì ñîäåğæèìîå âñåõ ôàéëîâ, äåëÿ ïî ïğîáåëó, è îòêèäûâàÿ òî, ÷òî íåëüçÿ ñ÷èòàòü ÷èñëîì

var fileObject = new Object(); //Ññûëêà íà òåêóùèé ôàéë â îáğàáîòêå


//İÒÀÏ ×ÒÅÍÈß ÔÀÉËÎÂ
for (var i = 0; i < WScript.Arguments.length - 1; ++i) {
	ERROR_CODE = 0; //Ñáğàñûâàåì êîä îøèáêè
	try {
		fileObject = fso.OpenTextFile(WScript.Arguments(i), 1, false);
	} catch(e) {
		ERROR_CODE = e.number & 0xFFFF;
		WSH.Echo("Âîçíèêëà îøèáêà ïğè ïîïûòêå îòêğûòèÿ ôàéëà \"" + WScript.Arguments(i) + "\"\nÊîä îøèáêè " + ERROR_CODE + " - \"" + e.description + "\"");
	}
	if (ERROR_CODE == 0) {
		try {
			var fileContent = fileObject.ReadAll().split(/\s/g);
		} catch(e) {			
			ERROR_CODE = e.number & 0xFFFF;
			WSH.Echo("Âîçíèêëà îøèáêà ïğè ïîïûòêå ÷òåíèÿ ôàéëà \"" + WScript.Arguments(i) + "\"\nÊîä îøèáêè " + ERROR_CODE + " - \"" + e.description + "\"");
		} finally {
			fileObject.Close();
		}
		if (ERROR_CODE == 0) {		
			for (var j = 0; j < fileContent.length; ++j) {
				if (!(isNaN(parseInt(fileContent[j])))) {
					try {
						buffer.push(parseInt(fileContent[j]));
					} catch(e) {	
						ERROR_CODE = e.number & 0xFFFF;
						WSH.Echo("Îøèáêà äîáàâëåíèÿ ıëåìåíòà â áóôåğ. Äîáàâëåíî ıëåìåíòîâ " + buffer.length + "\nÊîä îøèáêè " + ERROR_CODE + " - \"" + e.description + "\"");						
					}
				}
			}
		}
	}
}

//İÒÀÏ ÑÎĞÒÈĞÎÂÊÈ
try {
	buffer.sort(sIncrease);
} catch(e) {
	ERROR_CODE = e.number & 0xFFFF;
	WSH.Echo("Îøèáêà ñîğòèğîâêè\nÊîä îøèáêè " + ERROR_CODE + " - \"" + e.description + "\"");	
}

//İÒÀÏ ÇÀÏÈÑÈ
try {
	fileObject = fso.OpenTextFile(WScript.Arguments(WScript.Arguments.length - 1), 2, true);
	fileObject.Write(buffer.join(" "));
} catch(e) {
	ERROR_CODE = e.number & 0xFFFF;
	WSH.Echo("Îøèáêà çàïèñè â ôàéë\nÊîä îøèáêè " + ERROR_CODE + " - \"" + e.description + "\"");		
} finally {
	fileObject.Close();
}