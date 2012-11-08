bigtime.js
==========
  * Creates random numbers and BigNumber and BigDecimal objects in batches.
  * UNLIKELY TO RUN OUT OF MEMORY.
  * Doesn't show separate times for object creation and method calls.
  * Tests methods with one or two operands (i.e. includes abs and negate).
  * Doesn't indicate random number creation completion.
  * Doesn't calculate average number of digits of operands.
  * Creates random numbers in exponential notation.
  
bigtime-OOM.js
==============
  * Creates random numbers and BigNumber and BigDecimal objects all in one go.
  * MAY RUN OUT OF MEMORY, e.g. if iterations > 500000 and random digits > 40.
  * SHOWS SEPARATE TIMES FOR OBJECT CREATION AND METHOD CALLS.
  * Only tests methods with two operands (i.e. no abs or negate).
  * Indicates random number creation completion.
  * Calculates average number of digits of operands.
  * Creates random numbers in normal notation.
  
  
In general, bigtime.js is recommended over bigtime-OOM.js, which is included as
separate timings for object creation and method calls may be preferred.


Usage
=====

For help:

    $ node bigtime -h

Examples:

Compare the time taken by the BigNumber plus method and the BigDecimal add method.   
Time 10000 calls to each.   
Use operands of up to 40 random digits (each unique for each iteration).   
Check that the BigNumber results match the BigDecimal results.   

    $ node bigtime plus 10000 40    
    
    
    

  
