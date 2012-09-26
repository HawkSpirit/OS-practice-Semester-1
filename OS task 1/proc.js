//INSTRUCTION POINTER - указатель команды. Хранит адрес текущей команды. Изначально равен 0. Предоставляет доступ к адресу текущей команды
function INSTRUCTION_POINTER() {
	this.value = 0;
	this.getValue = function() {
		return(this.value);
	}
}
var ip = new INSTRUCTION_POINTER();

//RANDOM ACCESS MEMORY - оперативная память. 256 ячеек по 8 бита каждая. Изнициализирована содержимым файла "memory.txt". Предоставляет доступ к указанной ячейке памяти
function RANDOM_ACCESS_MEMORY(init) {
	this.content = new Array(256);
	this.content = init;
	for (var i = 0; i < 256; i++) {
		if (this.content[i] == null) {
			this.content[i] = 0;
		} else {
			this.content[i] = (this.content[i].toString()).charCodeAt(0);
			if (this.content[i] > 0xFF) {
				this.content[i] -= 0x350;
			}
		}
		this.getContent = function(index) {
			return(this.content[index]);
		}
		this.readCommand = function(index) {
			return(new Array((this.content[index]),(this.content[index + 1])));
		}
	}
}
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.hex";
var file = fso.OpenTextFile(file_name, 1, true);
var memory = new RANDOM_ACCESS_MEMORY(file.ReadAll().split(""));
file.Close();

//REGCOM - хранит команду целиком. Возвращает отдельно код операции и адресную часть команды
function REGCOM() {
	this.operation_code = 0;
	this.address = 0;
	this.setCommand = function(command) {
		this.operation_code = command[0];
		this.address = command[1];
	}
	this.getOpCode = function() {
		return this.operation_code;
	}
	this.getAddress = function() {
		return this.address;
	}	
}
var regcom = new REGCOM();

//ADDER - устройство целочисленного сложения.
function ADDER() {
	this.first = 0;
	this.second = 0;
	this.setFirst = function(operand) {
		this.first = operand;
	}
	this.setSecond = function(operand) {
		this.second = operand;
	}
	this.getResult = function() {
		return (this.first + this.second);
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


//Начало цикла ЭВМ
regcom.setCommand(memory.readCommand(ip.getValue()));
deccom.setParam(regcom.getOpCode());



