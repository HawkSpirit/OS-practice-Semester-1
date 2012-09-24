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
	this.getContent = function(index) {
		return(this.content[index]);
	}
	this.readCommand = function(index) {
		return((this.content[index]) + "" + (this.content[index + 1]));
	}
}
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.txt";
var file = fso.OpenTextFile(file_name, 1, true);
var memory = new RANDOM_ACCESS_MEMORY(file.ReadAll().split(""));
file.Close();

//REGCOM - ������ ������� �������. ���������� �������� ��� �������� � �������� ����� �������
function REGCOM() {
	this.setCommand = function(command) {
		this.operation_code = command.substr(0,1);
		this.address = command.substr(1,1);
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
function adder() {
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



//������ ����� ���
regcom.setCommand(memory.readCommand(ip.getValue()));






WSH.echo(regcom.getOpCode());