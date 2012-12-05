#include <iostream>
#include <string>
 
using namespace std;
 
int main()	{

	uint32_t *ptr;
	uint32_t ret_val,old_val,new_val;
	
	asm ("pusha\ncmpxchg %eax, %eax\npopa\n");
		
    cout << "SUCCESS!" << endl;
    return 0;
}