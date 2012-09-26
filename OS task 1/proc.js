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

//ADDER - ���������� �������������� ��������.
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

//����������� ������� - ������������ � ���� ������������ �������, ���������� ����� ���������� ���������
function ENV() {

	this.KOP = 0;	//��������
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

//DECCOM - ������ ������� �� ��������������� ���������� ����� ENV - ���������� ���������
function DECCOM() {
	this.setParam = function(opCode, env) {
		switch (opCode) {
			case 0x00:	env.P = 0;			//������
						env.OP = 0;
						env.PEREH = false;
						break;
			case 0x11:	env.I = 0;			//����������
						env.P = 1;
						env.OP = 1;
						env.PEREH = false;
						break;
			case 0x15:	env.I = 1;			//���������� ��
						env.P = 1;
						env.OP = 1;
						env.PEREH = false;
						break;
			case 0x02:	env.P = 2;			//������ � ��
						env.OP = 0;
						env.PEREH = false;
						break;
			case 0x21:	env.I = 0;			//��������
						env.P = 1;
						env.OP = 2;
						env.PEREH = false;
						break;
			case 0x25:	env.I = 1;			//�������� � ��
						env.P = 1;
						env.OP = 2;
						env.PEREH = false;
						break;
			case 0x31:	env.I = 0;			//���������
						env.P = 1;
						env.OP = 3;
						env.PEREH = false;
						break;
			case 0xFE:	env.P = 4;			//����������� �������
						env.OP = 0xF;
						env.PEREH = true;
						break;
			case 0xFF:	env.P =4;			//�������
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


//������ ����� ���
regcom.setCommand(memory.readCommand(ip.getValue()));
deccom.setParam(regcom.getOpCode());



