import math
import random
import time
# from memory_profiler import profile

# Implementation of Iterative Binary Search

# Returns index of x in arr if present, else -1
# param arr - given array
# x - searched value
# param l - left index
# param r - rigth index
@profile
def binary_search_iter(arr, x, l, r):

    while l <= r:

        mid = l + (r - l) // 2

        # Check if x is present at mid
        if arr[mid] == x:
            return mid

        # If x is greater, ignore left half
        elif arr[mid] < x:
            l = mid + 1

        # If x is smaller, ignore right half
        else:
            r = mid - 1

    # If we reach here, then the element
    # was not present
    return -1


# Implementation of Recursive Binary Search

# Returns index of x in arr if present, else -1
# param arr - given array
# x - searched value
# param l - left index
# param r - rigth index
def binary_search_recurs(arr, x, l, r):

    # Check base case
    if r >= l:

        mid = l + (r - l) // 2

        # If element is present at the middle itself
        if arr[mid] == x:
            return mid

        # If element is smaller than mid, then it
        # can only be present in left subarray
        elif arr[mid] > x:
            return binary_search_recurs(arr, x, l, mid-1)

        # Else the element can only be present
        # in right subarray
        else:
            return binary_search_recurs(arr, x, mid + 1, r)

    # Element is not present in the array
    else:
        return -1


# Implementation of Jump Search

# Returns index of x in arr if present, else -1
# param arr - given array
# x - searched value
@profile
def jump_search(arr, x):
    
    n = len(arr)                          
    m = int(math.sqrt(n))
    i = 0                

    while i != len(arr)-1 and arr[i] < x:
        # If element is present at the right boundary
        if arr[i+m-1] == x:            
            return i+m-1
        # If element is smaller than right boundary, then it
        # can only be present in left subarray
        elif arr[i+m-1] > x:           
            block = arr[i: i+m-1]
            # Linear search for key in block
            return linear_search(block, x)
        i += m

    # Linear search for key in block of remain elements
    block = arr[i:i+m]                 
    return i + linear_search(block, x)


# Implementation of Linear Search

# Returns index of x in arr if present, else -1
# param arr - given array
# x - searched value
def linear_search(arr, x):
    i = 0

    while i != len(arr):
        if arr[i] == x:
            return i
        i += 1

    return -1


@profile
def wrapper_for_recurs(arr, x, l, r):
    binary_search_recurs(arr, x, l, r)
    

if __name__ == '__main__':

    arr_size = 50 * 1000
    arr = [round(random.random()*arr_size) for _ in range(arr_size)]
    x = round(random.random() * (arr_size - 1))

    arr.sort()

    algorithms = [binary_search_iter, binary_search_recurs, jump_search] 

    print(f'Size of array: {arr_size}\n')

    for i in range(len(algorithms)):    
        if algorithms[i] == jump_search:
            algorithms[i](arr, x)
        elif algorithms[i] == binary_search_iter:
            algorithms[i](arr, x, 0, arr_size-1)
        else:
            wrapper_for_recurs(arr, x, 0, arr_size-1)    
    