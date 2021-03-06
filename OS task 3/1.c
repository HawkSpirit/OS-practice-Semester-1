#include <efi.h>
#include <efilib.h>

EFI_STATUS efi_main(EFI_HANDLE image_handle, EFI_SYSTEM_TABLE *systab) {

	InitializeLib(image_handle, systab);
	
	EFI_BOOT_SERVICES *efi_bs;
	efi_bs = systab -> BootServices;
	
	EFI_STATUS status;
	
	UINTN mem_map_size, map_key, descr_size;
	UINT32 descr_ver;
	
	EFI_MEMORY_DESCRIPTOR *mem_map;
	EFI_MEMORY_TYPE pool_type = EfiLoaderData;

	//Attempt to read memory
	status = uefi_call_wrapper(efi_bs -> GetMemoryMap, 5, &mem_map_size, mem_map, &map_key, &descr_size, &descr_ver);
	if (status != EFI_BUFFER_TOO_SMALL) {
		Print(L"GetMemoryMap ERROR\n");
		return EFI_SUCCESS;
	}

	//Memory allocation
	status = uefi_call_wrapper(efi_bs -> AllocatePool, 3, pool_type, mem_map_size, ((void*)&mem_map));
	if (status != EFI_SUCCESS) {
		Print(L"AllocatePool ERROR\n");
		return EFI_SUCCESS;
	}

	//Read memory
	status = uefi_call_wrapper(efi_bs -> GetMemoryMap, 5, &mem_map_size, mem_map, &map_key, &descr_size, &descr_ver);
	if (status != EFI_SUCCESS) {
		Print(L"GetMemoryMap ERROR\n");
		return EFI_SUCCESS;
	}

	//Calculating result
	long long int result = 0;	
	int temp = mem_map_size / descr_size;
	int i;
	for (i = 0; i < temp; i++){
		if((mem_map[i].Type == EfiBootServicesCode) || (mem_map[i].Type == EfiBootServicesData) || (mem_map[i].Type == EfiConventionalMemory)) {
			result += mem_map[i].NumberOfPages;
		}
	}
	
	//Free memory pool
	status = uefi_call_wrapper(efi_bs -> FreePool, 1, ((void*)mem_map));
	if (status != EFI_SUCCESS) {
		Print(L"FreePool ERROR\n");
		return status;
	}

	//Printing result
	result *= EFI_PAGE_SIZE;
	/*	As said in http://www.uefi.org/specs/download/UEFI_2_3_1_Errata_C_final
		UEFI page size is always set to 0x1000 = 4096, and it is defined as EFI_PAGE_SIZE constant	
		There is also EFI_PAGE_SHIFT constant set to 12, which provides
		EFI_PAGES_TO_SIZE(a)   ( (a) << EFI_PAGE_SHIFT) method										*/
	Print(L"RESULT %d bytes AVALIABLE\n", result);
	Print(L"EFI PAGE SIZE: %d\n", EFI_PAGE_SIZE);
	
	return EFI_SUCCESS;
}