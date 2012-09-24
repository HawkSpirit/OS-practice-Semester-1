//INSTRUCTION POINTER - ��������� �������. ������ ����� ������� �������. ���������� ����� 0. ������������� ������ � ������ ������� �������
function INSTRUCTION_POINTER() {
	this.value = 0;
	this.getValue = function() {
		return(this.value);
	}
}
var ip = new INSTRUCTION_POINTER();

//RANDOM ACCESS MEMORY - ����������� ������. 256 ����� �� 8 ���� ������. ����������������� ���������� ����� "memory.txt". ������������� ������ � ��������� ������ ������
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

//REGCOM - ������ ������� �������. ���������� �������� ��� �������� � �������� ����� �������
function REGCOM() {
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

//ADDER - ���������� �������������� ��������.
function ADDER() {
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

//DECCOM
function DECCOM() {
	this.setParam = function(opCode) {
		WSH.Echo(opCode);
	}
}
var deccom = new DECCOM();


//������ ����� ���
regcom.setCommand(memory.readCommand(ip.getValue()));
deccom.setParam(regcom.getOpCode());



