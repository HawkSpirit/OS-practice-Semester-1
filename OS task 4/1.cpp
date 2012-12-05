#include <iostream>
 
using namespace std;
 
int main()	{
	
	asm("pusha\npopa");
		
    cout << "SUCCESS" << endl;
    return 0;
}