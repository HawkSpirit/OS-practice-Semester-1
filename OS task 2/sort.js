function sIncrease(i, ii) { //Функция сортировки по возрастанию возрастанию
    if (i > ii)
        return 1;
    else if (i < ii)
        return -1;
    else
        return 0;
}

var fso = new ActiveXObject("Scripting.FileSystemObject");

var buffer = new Array(); //Сюда чтаем содержимое всех файлов, деля по пробелу, и откидывая то, что нельзя считать числом

for (var i = 0; i < WScript.Arguments.length - 1; ++i) {
	var fileObject = fso.OpenTextFile(WScript.Arguments(i), 1, false);
	var fileContent = fileObject.ReadAll().split(" ");
	for (var j = 0; j < fileContent.length; ++j) {
		if (!(isNaN(parseInt(fileContent[j])))) {
			buffer.push(parseInt(fileContent[j]));
		}
	}
	fileObject.Close();
}

buffer.sort(sIncrease)

var resultFile = fso.OpenTextFile(WScript.Arguments(WScript.Arguments.length - 1), 2, true);
resultFile.Write(buffer.join(" "));
















