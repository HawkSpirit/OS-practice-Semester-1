
//INSTRUCTION POINTER - ��������� �������. ������ ����� ������� �������. ���������� ����� 0.
function INSTRUCTION_POINTER(value) {
	this.value = value;
	this.getValue = function() {
		return(this.value);
	}
}
var ip = new INSTRUCTION_POINTER(0);

//RANDOM ACCESS MEMORY - ����������� ������. 256 ����� �� 4 ���� ������. ����������������� ���������� ����� "memory.txt"
function RANDOM_ACCESS_MEMORY(init) {
	this.content = new Array(256);
	this.content = init;
	this.getContent = function(index) {
		return(this.content[index]);
	}
}
var fso = new ActiveXObject("Scripting.FileSystemObject");
var file_name = "memory.txt";
var file = fso.OpenTextFile(file_name, 1, true);
var memory = new RANDOM_ACCESS_MEMORY(file.ReadAll().replace(/[\t\r\n ]/g, "").split(""));
file.Close();






WSH.echo(memory.getContent(0));