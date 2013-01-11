#include <iostream>
#include <pthread.h>

//Amount of running threads
#define MAX_THREADS 1024

//Counter for non-synchronized threads
volatile int counterSimple;

//Counter for synchronized threads
volatile int counterProtected;

//Mutex for shared counter in synchronized threads
volatile int flag = 0;

//Non-synchronized thread procedure for adding 10000 declaration
void *IncSimle(void *);

//Synchronized thread procedure for adding 10000 declaration
void *IncProtected(void *);

using namespace std;
 
int main() {

	cout << endl << "                    PLEASE, WAIT                    " << endl << endl;
	
	pthread_t threads_array[MAX_THREADS];	
	
	//Creation MAX_THREADS amount of non-synchronized threads with error handling
	counterSimple = 0; //set initial value of counter to 0
	for(int i=0; i < MAX_THREADS; ++i) {
        int error = pthread_create(&threads_array[i], NULL, IncSimle, NULL);
		if (error) {
			cout << "Error: could not create a thread" << endl;
			return 0;
		}
    }
	
	//Waiting for non-synchronized threads with error handling
	for (int i = 0; i < MAX_THREADS; ++i) {
        int error = pthread_join(threads_array[i], NULL);
		if (error) {
			cout << "pthread_join function returned an error value" << endl;
			return 0;
		}
    }
	
	//Creation MAX_THREADS amount of synchronized threads with error handling
	counterProtected = 0; //set initial value of counter to 0
	for(int i=0; i < MAX_THREADS; ++i) {
        int error = pthread_create(&threads_array[i], NULL, IncProtected, NULL);
		if (error) {
			cout << "Error: could not create a thread" << endl;
			return 0;
		}
    }
	
	//Waiting for synchronized threads with error handling
	for (int i = 0; i < MAX_THREADS; ++i) {
        int error = pthread_join(threads_array[i], NULL);
		if (error) {
			cout << "pthread_join function returned an error value" << endl;
			return 0;
		}
    }
	
	//Printing results
	cout << "-----------------------RESULTS-----------------------" << endl;
	cout << "SIMPLE INCREMENT RESULT:      " << counterSimple << " (should be 10240000)" << endl << endl;	
	cout << "PROTECTED INCREMENT RESULT:   " << counterProtected << " (should be 10240000)" << endl << endl;	
	cout << "----------------------TRY AGAIN----------------------" << endl;
	
	return 0;
}

void *IncSimle(void *arg) {
	int i = 0;
	while (i < 10000) {
	
		//Critical section
        counterSimple += 1;
		++i;
	}
}

void *IncProtected(void *arg) { 
	int ret_val;
	int i = 0;
	while (i < 10000) {
	
		//Assembly block with memory, condition codes and registers protection..... I hope :)		
		asm volatile("pusha");
		asm volatile("lock\n\tcmpxchgl %1,%2":"=a"(ret_val):"r"(1),"m"(flag),"0"(0): "memory" , "cc");
		asm volatile("popa");
		
		//Increase the counter only if mutex captured successfully
		if (!ret_val) {
			
			//Critical section
			counterProtected += 1;
			++i;
			flag = 0;
		}
	}
}