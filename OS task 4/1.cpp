#include <iostream>
#include <string>
 
using namespace std;
 
int main()	{

	uint32_t *ptr;
	uint32_t ret_val,old_val,new_val;
	
	asm ("pusha\npopa\n" : "=a"(ret_val) : "r"(new_val),"m"(*ptr),"0"(old_val) : "memory");
		
    cout << "SUCCESS!" << endl;
    return 0;
}