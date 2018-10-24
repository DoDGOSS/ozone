package org.ozoneplatform.auditing.format.cef

import org.junit.Test

import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.CoreMatchers.is
import static org.junit.Assert.assertThat

class CEFTest {

	
	/*
	 * This test case is taken from the arc sight docs":
	  
	    The following example illustrates a CEF message using Syslog transport:
		Sep 19 08:26:10 host CEF:0|security|threatmanager|1.0|100|worm
	    successfully stopped|10|src=10.0.0.1 dst=2.1.2.2 spt=1232
	    
	    Our generated string should match this
	 */	
	@Test
	public void testCEF(){
		
		def map = [:]
		map['src'] = '10.0.0.1'
		map['dst'] = '2.1.2.2'
		map['spt'] = '1232'
		def extention = new Extension(map)
		def cef = new CEF(0, "security", "threatmanager", "1.0","100","worm successfully stopped",10, extention)
				
		def expected = 'CEF:0|security|threatmanager|1.0|100|worm successfully stopped|10|src=10.0.0.1 dst=2.1.2.2 spt=1232'
				
		assertThat(cef.toString(), is(equalTo(expected)))

	}
	
	
	@Test
	public void testCEFPrefix(){
		def cef = new CEF(0, "security", "threatmanager", "1.0","100","worm successfully stopped",10, null)
		
		//Must start with CEF:
		assertThat(cef.toString() ==~ /CEF:*.*/, is(true))
	}
}
