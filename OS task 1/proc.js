//»нициализируем MEMORY (оперативную пам€ть) содержимым файла "memory.txt", игнориру€ пробелы
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.txt";
var file = fso.OpenTextFile(file_name,1,true);
var file_content = file.ReadAll();
file.Close();
var MEMORY = new Array(256);
MEMORY = file_content.replace(/[\t\r\n ]/g, "").split("");

//INSTRUCTION POINTER - указатель команды. ’ранит адрес текущей команды. »значально равен 0.
var IP = 0;