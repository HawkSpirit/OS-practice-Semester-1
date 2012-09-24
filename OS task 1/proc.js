//INSTRUCTION POINTER - ��������� �������. ������ ����� ������� �������. ���������� ����� 0. ������������� ������ � ������ ������� �������
function INSTRUCTION_POINTER(value) {
	this.value = value;
	this.getValue = function() {
		return(this.value);
	}
}
var ip = new INSTRUCTION_POINTER(0);

//RANDOM ACCESS MEMORY - ����������� ������. 256 ����� �� 4 ���� ������. ����������������� ���������� ����� "memory.txt". ������������� ������ � ��������� ������ ������
function RANDOM_ACCESS_MEMORY(init) {
	this.content = new Array(256);
	this.content = init;
	this.getContent = function(index) {
		return(this.content[index]);
	}
	this.readCommand = function(index) {
		return((this.content[index]) + "" + (this.content[index + 1]) + "" + (this.content[index + 2]) + "" + (this.content[index + 3]));
	}
}
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.txt";
var file = fso.OpenTextFile(file_name, 1, true);
var memory = new RANDOM_ACCESS_MEMORY(file.ReadAll().replace(/[\t\r\n ]/g, "").split(""));
file.Close();

//REGCOM - ������ ������� �������. ���������� �������� ��� �������� � �������� ����� �������
function REGCOM() {
	this.setCommand = function(command) {
		this.operation_code = command.substr(0,2);
		this.address = command.substr(2,2);
	}
	this.getOpCode = function() {
		return this.operation_code;
	}
	this.getAddress = function() {
		return this.address
	}	
}
var regcom = new REGCOM();


regcom.setCommand(memory.readCommand(ip.getValue()));






WSH.echo(regcom.getOpCode());