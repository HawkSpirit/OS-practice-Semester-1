function sIncrease(i, ii) { //Функция сортировки по возрастанию возрастанию
    if (i > ii)
        return 1;
    else if (i < ii)
        return -1;
    else
        return 0;
}


var buffer = new Array(); //Сюда чтаем содержимое всех файлов, деля по пробелу, и откидывая то, что нельзя считать числом

var fso = new ActiveXObject("Scripting.FileSystemObject");
var fileObjects = new Array();

for (var i = 0; i < WScript.Arguments.length - 1; ++i) {
	fileObjects[i] = fso.OpenTextFile(WScript.Arguments(i), 1, true);
	var temp_fileContent = fileObjects[i].ReadAll().split(" ");
	for (var j = 0; j < temp_fileContent.length; ++j) {
		if (!(isNaN(parseInt(temp_fileContent[j])))) {
			buffer.push(parseInt(temp_fileContent[j]));
		}
	}
	fileObjects[i].Close();
}

buffer.sort(sIncrease)

WSH.Echo(buffer);

















