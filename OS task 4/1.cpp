#include <iostream>
#include <string>
#include <windows.h>
#include <tchar.h>
#include <strsafe.h>

#define MAX_THREADS 64

int counterSimple = 0;
int counterProtected = 0;
int flag = 0;

DWORD WINAPI IncSimle(LPVOID lpParam);
DWORD WINAPI IncProtected(LPVOID lpParam);
void ErrorHandler(LPTSTR lpszFunction);

using namespace std;
 
int main() {
	int old_val = 5;
	int new_val = 6;
	int *ptr = new int(1);	
	ptr[0] = 5;

	cout << endl << "OLD VAL:   " << *ptr << endl;
	cout << "NEW VAL:   " << new_val << endl;
	
	cout << "-----------------------CMPXCHG-----------------------" << endl;
	
	asm volatile("pusha\n");
	asm volatile("movl %0,%%eax\nlock\ncmpxchgl %1,%2\n" :: "r"(old_val), "r"(new_val), "m"(*ptr) : "memory");
	asm volatile("popa\n");
	
	cout << "OLD VAL:   " << *ptr << endl;
	cout << "NEW VAL:   " << new_val << endl << endl;
	
    DWORD   dwThreadIdArray[MAX_THREADS];
    HANDLE  hThreadArray[MAX_THREADS]; 

	
	counterSimple = 0;
    // Create MAX_THREADS worker threads.
    for( int i=0; i<MAX_THREADS; i++ ) {

        // Create the thread to begin execution on its own
        hThreadArray[i] = CreateThread(NULL, 0, IncSimle, NULL, 0, &dwThreadIdArray[i]);   // returns the thread identifier 

        // Check the return value for success.
        // If CreateThread fails, terminate execution. 
        // This will automatically clean up threads and memory. 
        if (hThreadArray[i] == NULL) {
           ErrorHandler(TEXT("CreateThread"));
           ExitProcess(3);
        }
    }

    // Wait until all threads have terminated.
    WaitForMultipleObjects(MAX_THREADS, hThreadArray, TRUE, INFINITE);

    // Close all thread handles and free memory allocations.
    for(int i=0; i<MAX_THREADS; i++) {
        CloseHandle(hThreadArray[i]);
    }
	
	
	counterProtected = 0;	
    // Create MAX_THREADS worker threads.
    for( int i=0; i<MAX_THREADS; i++ ) {

        // Create the thread to begin execution on its own
        hThreadArray[i] = CreateThread(NULL, 0, IncProtected, NULL, 0, &dwThreadIdArray[i]);   // returns the thread identifier 

        // Check the return value for success.
        // If CreateThread fails, terminate execution. 
        // This will automatically clean up threads and memory. 
        if (hThreadArray[i] == NULL) {
           ErrorHandler(TEXT("CreateThread"));
           ExitProcess(3);
        }
    }

    // Wait until all threads have terminated.
    WaitForMultipleObjects(MAX_THREADS, hThreadArray, TRUE, INFINITE);

    // Close all thread handles and free memory allocations.
    for(int i=0; i<MAX_THREADS; i++) {
        CloseHandle(hThreadArray[i]);
    }
	
	cout << "-----------------------RESULTS-----------------------" << endl;
	cout << "SIMPLE INCREMENT RESULT:      " << counterSimple << " (must be 640000)" << endl << endl;	
	cout << "PROTECTED INCREMENT RESULT:   " << counterProtected << " (must be 640000)" << endl << endl;	
	
	cout << "----------------------TRY AGAIN----------------------" << endl;

    return 0;
}


DWORD WINAPI IncSimle(LPVOID) {
    for (int i = 0; i < 10000; ++i)
    {
        counterSimple += 1;
    }
}

DWORD WINAPI IncProtected(LPVOID) { 
	asm volatile("pusha\n");
	for (int i = 0; i < 10000; ++i) {
		asm volatile("movl $1, %edx\n");
		asm volatile("looper:\n");
		asm volatile("movl %0, %%ebx\n" :: "r" (&flag));
		asm volatile("movl $0, %eax\n");
		asm volatile("lock\ncmpxchgl %edx, (%ebx)\n");
		asm volatile("jnz looper\n");
		counterProtected += 1;
		asm volatile("movl $0, (%0)\n" :: "r" (&flag));
	}
	asm volatile("popa\n");
	return 0;
}

void ErrorHandler(LPTSTR lpszFunction) { 
    // Retrieve the system error message for the last-error code.

    LPVOID lpMsgBuf;
    LPVOID lpDisplayBuf;
    DWORD dw = GetLastError(); 

    FormatMessage(
        FORMAT_MESSAGE_ALLOCATE_BUFFER | 
        FORMAT_MESSAGE_FROM_SYSTEM |
        FORMAT_MESSAGE_IGNORE_INSERTS,
        NULL,
        dw,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
        (LPTSTR) &lpMsgBuf,
        0, NULL );

    // Display the error message.

    lpDisplayBuf = (LPVOID)LocalAlloc(LMEM_ZEROINIT, (lstrlen((LPCTSTR) lpMsgBuf) + lstrlen((LPCTSTR) lpszFunction) + 40) * sizeof(TCHAR)); 
    StringCchPrintf((LPTSTR)lpDisplayBuf, LocalSize(lpDisplayBuf) / sizeof(TCHAR), TEXT("%s failed with error %d: %s"), lpszFunction, dw, lpMsgBuf); 
    MessageBox(NULL, (LPCTSTR) lpDisplayBuf, TEXT("Error"), MB_OK); 

    // Free error-handling buffer allocations.

    LocalFree(lpMsgBuf);
    LocalFree(lpDisplayBuf);
}

