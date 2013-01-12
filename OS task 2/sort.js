var ERROR_CODE; //��� ������. 0 - ��� ������

function sIncrease(i, ii) { //������� ���������� �� �����������
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
	ERROR_CODE = 0; //���������� ��� ������
	try {
		fileObject = fso.OpenTextFile(WScript.Arguments(i), 1, false);
	} catch(e) {
		ERROR_CODE = e.number & 0xFFFF;
		WSH.Echo("�������� ������ ��� ������� �������� ����� \"" + WScript.Arguments(i) + "\"\n��� ������ " + ERROR_CODE + " - \"" + e.description + "\"");
	}
	if (ERROR_CODE == 0) {
		try {
			var fileContent = fileObject.ReadAll().split(/\s/g);
		} catch(e) {			
			ERROR_CODE = e.number & 0xFFFF;
			WSH.Echo("�������� ������ ��� ������� ������ ����� \"" + WScript.Arguments(i) + "\"\n��� ������ " + ERROR_CODE + " - \"" + e.description + "\"");
		} finally {
			fileObject.Close();
		}
		if (ERROR_CODE == 0) {		
			for (var j = 0; j < fileContent.length; ++j) {
				if (!(isNaN(parseInt(fileContent[j])))) {
					try {
						buffer.push(parseInt(fileContent[j]));
					} catch(e) {	
						ERROR_CODE = e.number & 0xFFFF;
						WSH.Echo("������ ���������� �������� � �����. ��������� ��������� " + buffer.length + "\n��� ������ " + ERROR_CODE + " - \"" + e.description + "\"");						
					}
				}
			}
		}
	}
}

//���� ����������
try {
	buffer.sort(sIncrease);
} catch(e) {
	ERROR_CODE = e.number & 0xFFFF;
	WSH.Echo("������ ����������\n��� ������ " + ERROR_CODE + " - \"" + e.description + "\"");	
}

//���� ������
try {
	fileObject = fso.OpenTextFile(WScript.Arguments(WScript.Arguments.length - 1), 2, true);
	fileObject.Write(buffer.join(" "));
} catch(e) {
	ERROR_CODE = e.number & 0xFFFF;
	WSH.Echo("������ ������ � ����\n��� ������ " + ERROR_CODE + " - \"" + e.description + "\"");		
} finally {
	fileObject.Close();
}