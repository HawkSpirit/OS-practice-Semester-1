//INSTRUCTION POINTER - указатель команды. Хранит адрес текущей команды. Изначально равен 0. Предоставляет доступ к адресу текущей команды
function INSTRUCTION_POINTER() {
	var value = 0;
	this.getValue = function() {
		return(value);
	}
	this.setValue = function(val) {
		value = val;
	}
}
var ip = new INSTRUCTION_POINTER();

//RANDOM ACCESS MEMORY - оперативная память. 256 ячеек по 8 бита каждая. Изнициализирована содержимым файла "memory.txt". Предоставляет доступ к указанной ячейке памяти
function RANDOM_ACCESS_MEMORY(init) {
	var content = new Array(256);
	content = init;
	for (var i = 0; i < 256; i++) {
		if (content[i] == null) {
			content[i] = 0;
		} else {
			content[i] = (content[i].toString()).charCodeAt(0);
			if (content[i] > 0xFF) {
				content[i] -= 0x350;
			}
		}
	}
	this.getContent = function(index) {
		return(content[index]);
	}
	this.setContent = function(index, value) {
		content[index] = value;
	}
	this.readCommand = function(index) {
		return(new Array((content[index]),(ontent[index + 1])));
	}
}
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.hex";
var file = fso.OpenTextFile(file_name, 1, true);
var memory = new RANDOM_ACCESS_MEMORY(file.ReadAll().split(""));
file.Close();

//REGCOM - хранит команду целиком. Возвращает отдельно код операции и адресную часть команды
function REGCOM() {
	var operation_code = 0;
	var address = 0;
	this.setCommand = function(command) {
		operation_code = command[0];
		address = command[1];
	}
	this.getOpCode = function() {
		return operation_code;
	}
	this.getAddress = function() {
		return address;
	}	
}
var regcom = new REGCOM();

//ADDER - устройство целочисленного сложения.
function ADDER() {
	this.add = function(op1, op2) {
		return (op1 + op2);
	}
}
var adder = new ADDER();

//УПРАВЛЯЮЩИЕ СИГНАЛЫ - реализованны в виде абстрактного объекта, сочетающие набор переменных окружения
function ENV() {
	this.KOP = 0;	//выпилить
	this.PR = 0x00;
	this.F = false;
	
	this.I = 0;
	this.P = 0;
	this.OP = 0;	
	this.PEREH = false;
	
	this.PYSK = true;
	this.VZAP1 = false;
	this.ZAM1 = false;
	this.ZAM2 = false;
	this.CHIST = false;
	this.VIB = false;
	this.ZAPP = false;
	this.PEREH = false;
}
var env = new ENV();

//DECCOM - подает сигналы на соответствующие устройства через ENV - переменные окружения
function DECCOM() {
	this.setParam = function(opCode, env) {
		switch (opCode) {
			case 0x00:	env.P = 0;			//ЗАПИСЬ
						env.OP = 0;
						env.PEREH = false;
						break;
			case 0x11:	env.I = 0;			//СЧИТЫВАНИЕ
						env.P = 1;
						env.OP = 1;
						env.PEREH = false;
						break;
			case 0x15:	env.I = 1;			//СЧИТЫВАНИЕ ИА
						env.P = 1;
						env.OP = 1;
						env.PEREH = false;
						break;
			case 0x02:	env.P = 2;			//ЗАПИСЬ В ИР
						env.OP = 0;
						env.PEREH = false;
						break;
			case 0x21:	env.I = 0;			//СЛОЖЕНИЕ
						env.P = 1;
						env.OP = 2;
						env.PEREH = false;
						break;
			case 0x25:	env.I = 1;			//СЛОЖЕНИЕ С ИА
						env.P = 1;
						env.OP = 2;
						env.PEREH = false;
						break;
			case 0x31:	env.I = 0;			//ВЫЧИТАНИЕ
						env.P = 1;
						env.OP = 3;
						env.PEREH = false;
						break;
			case 0xFE:	env.P = 4;			//БЕЗУСЛОВНЫЙ ПЕРЕХОД
						env.OP = 0xF;
						env.PEREH = true;
						break;
			case 0xFF:	env.P =4;			//ОСТАНОВ
						env.OP = 0xF;
						env.PEREH = false;
						break;
		}
		env.ZAPP = (env.P == 0);
		env.ZAM1 = (env.P == 1);
		env.ZAM2 = (env.P != 3);
		env.VZAP1 = (env.P == 3);
		env.VIB = (env.I);
		env.CHIST = !(env.P == 2 || env.P == 3);
		env.PYSK = (opCode != 0xFF);
	}
}
var deccom = new DECCOM();

//MULTIPLEXOR - На входе управляющий сигнал и массив сигналов, на выходе сигнал, соответствующий значению
function MULTIPLEXOR() {
	this.proceed = function(control_signal,arrayOfSignals) {
		return arrayOfSignals[control_signal];
	}
}
var multiplexor = new MULTIPLEXOR();

//INDEX REGISTER
function INDEX_REGISTER() {
	var value = 0;
	this.getValue = function() {
		return value;
	}
	this.setValue = function(val) {
		value = val;
	}
}
var IR = new INDEX_REGISTER();

//GENERAL_PURPOSE_REGISTER
function GENERAL_PURPOSE_REGISTER() {
	var commonVal = 0;
	var prznkVal = 0b00;
	this.setValue = function(common, prznk) {
		commonVal = common;
		prznkVal = prznk;
	}
	this.getCommon = function() {
		return commonVal;
	}
	this.getPrznk = function() {
		return prznkVal;
	}
}
var gpr = new GENERAL_PURPOSE_REGISTER();

//INPUT_OUTPUT_REGISTER
function INPUT_OUTPUT_REGISTER(){
	var value = 0;
	var flag = 0;
	this.setValue = function(val, f) {
		value = common;
		flag = f;
	}
	this.getValue = function() {
		return value;
	}
	this.getFlag = function() {
		return flag;
	}
}
var ior = new INPUT_OUTPUT_REGISTER();


//Начало цикла ЭВМ
regcom.setCommand(memory.readCommand(ip.getValue()));
deccom.setParam(regcom.getOpCode(),env);

var a = new INDEX_REGISTER(84);
var b = new INDEX_REGISTER(6);
b.set(1);
WSH.Echo(b.show());


