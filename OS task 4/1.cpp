#include <iostream>
#include <string>
 
using namespace std;
 
int main()	{

	int old_val = 5;
	int new_val = 6;
	int *ptr = new int(1);	
	ptr[0] = 5;

	cout << old_val << endl;
	cout << new_val << endl;
	cout << *ptr << endl;
	
	cout << "--------CMPXCHG------------" << endl;		
	
	asm volatile("pusha\nmovl %0,%%eax\nlock\ncmpxchgl %1,%2\npopa\n" :: "r"(old_val), "r"(new_val), "m"(*ptr) : "memory");
	
	cout << old_val << endl;
	cout << new_val << endl;
	cout << *ptr << endl;
		
    cout << "SUCCESS!" << endl;
    return 0;
}