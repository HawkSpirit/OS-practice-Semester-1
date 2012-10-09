var ERROR_CODE = 0; //Êîä îøèáêè 	0 - ÂÑÅ ÕÎĞÎØÎ
					//				1 - ÔÀÉË ÍÅ ÍÀÉÄÅÍ
					//				2 - ÎØÈÁÊÀ ×ÒÅÍÈß
					//				3 - ÎØÈÁÊÀ ÄÎÁÀÂËÅÍÈß İËÅÌÅÍÒÀ Â ÁÓÔÅĞ
					//				4 - ÎØÈÁÊÀ ÑÎĞÒÈĞÎÂÊÈ
					//				5 - ÎØÈÁÊÀ ÇÀÏÈÑÈ Â ÔÀÉË

function sIncrease(i, ii) { //Ôóíêöèÿ ñîğòèğîâêè ïî âîçğàñòàíèş âîçğàñòàíèş
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
	try {
		fileObject = fso.OpenTextFile(WScript.Arguments(i), 1, false);
	} catch(e) {
		ERROR_CODE = 1;
		WSH.Echo("Îøèáêà îòêğûòèÿ ôàéëà \"" + WScript.Arguments(i) + "\"\n" + e.name + " ERROR_CODE: " + ERROR_CODE);
	}
	if (ERROR_CODE != 1) {
		try {
			var fileContent = fileObject.ReadAll().split(/\s/g);
		} catch(e) {			
			ERROR_CODE = 2;
			WSH.Echo("Îøèáêà ÷òåíèÿ ôàéëà \"" + WScript.Arguments(i) + "\"\n" + e.name + " ERROR_CODE: " + ERROR_CODE);
		} finally {
			fileObject.Close();
		}
		if (ERROR_CODE != 2) {		
			for (var j = 0; j < fileContent.length; ++j) {
				if (!(isNaN(parseInt(fileContent[j])))) {
					try {
						buffer.push(parseInt(fileContent[j]));
					} catch(e) {	
						ERROR_CODE = 3;
						WSH.Echo("Îøèáêà äîáàâëåíèÿ ıëåìåíòà â áóôåğ. Äîáàâëåíî ıëåìåíòîâ " + buffer.length + "\n" + e.name + " ERROR_CODE: " + ERROR_CODE);						
					}
				}
			}
		}
	} else {
		continue;
	}
}

//İÒÀÏ ÑÎĞÒÈĞÎÂÊÈ
try {
	buffer.sort(sIncrease);
} catch(e) {
	ERROR_CODE = 4;
	WSH.Echo("Îøèáêà ñîğòèğîâêè\n" + e.name + " ERROR_CODE: " + ERROR_CODE);	
}

//İÒÀÏ ÇÀÏÈÑÈ
try {
	fileObject = fso.OpenTextFile(WScript.Arguments(WScript.Arguments.length - 1), 2, true);
	fileObject.Write(buffer.join(" "));
} catch(e) {
	ERROR_CODE = 5;
	WSH.Echo("Îøèáêà çàïèñè â ôàéë\n" + e.name + " ERROR_CODE: " + ERROR_CODE);		
} finally {
	fileObject.Close();
}





