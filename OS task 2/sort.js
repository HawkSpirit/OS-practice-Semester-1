var ERROR_CODE = 0; //��� ������ 	0 - ��� ������
					//				1 - ���� �� ������
					//				2 - ������ ������
					//				3 - ������ ���������� �������� � �����
					//				4 - ������ ����������
					//				5 - ������ ������ � ����

function sIncrease(i, ii) { //������� ���������� �� ����������� �����������
    if (i > ii)
        return 1;
    else if (i < ii)
        return -1;
    else
        return 0;
}

var fso = new ActiveXObject("Scripting.FileSystemObject");

var buffer = new Array(); //���� ����� ���������� ���� ������, ���� �� �������, � ��������� ��, ��� ������ ������� ������

var fileObject = new Object(); //������ �� ������� ���� � ���������

//���� ������ ������
for (var i = 0; i < WScript.Arguments.length - 1; ++i) {
	try {
		fileObject = fso.OpenTextFile(WScript.Arguments(i), 1, false);
	} catch(e) {
		ERROR_CODE = 1;
		WSH.Echo("������ �������� ����� \"" + WScript.Arguments(i) + "\"\n" + e.name + " ERROR_CODE: " + ERROR_CODE);
	}
	if (ERROR_CODE != 1) {
		try {
			var fileContent = fileObject.ReadAll().split(/\s/g);
		} catch(e) {			
			ERROR_CODE = 2;
			WSH.Echo("������ ������ ����� \"" + WScript.Arguments(i) + "\"\n" + e.name + " ERROR_CODE: " + ERROR_CODE);
		} finally {
			fileObject.Close();
		}
		if (ERROR_CODE != 2) {		
			for (var j = 0; j < fileContent.length; ++j) {
				if (!(isNaN(parseInt(fileContent[j])))) {
					try {
						buffer.push(parseInt(fileContent[j]));
					} catch(e) {	
						ERROR_CODE = 3;
						WSH.Echo("������ ���������� �������� � �����. ��������� ��������� " + buffer.length + "\n" + e.name + " ERROR_CODE: " + ERROR_CODE);						
					}
				}
			}
		}
	} else {
		continue;
	}
}

//���� ����������
try {
	buffer.sort(sIncrease);
} catch(e) {
	ERROR_CODE = 4;
	WSH.Echo("������ ����������\n" + e.name + " ERROR_CODE: " + ERROR_CODE);	
}

//���� ������
try {
	fileObject = fso.OpenTextFile(WScript.Arguments(WScript.Arguments.length - 1), 2, true);
	fileObject.Write(buffer.join(" "));
} catch(e) {
	ERROR_CODE = 5;
	WSH.Echo("������ ������ � ����\n" + e.name + " ERROR_CODE: " + ERROR_CODE);		
} finally {
	fileObject.Close();
}





