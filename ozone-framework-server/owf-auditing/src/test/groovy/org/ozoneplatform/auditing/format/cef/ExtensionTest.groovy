package org.ozoneplatform.auditing.format.cef

import org.junit.Test

import static org.hamcrest.CoreMatchers.*
import static org.junit.Assert.assertThat
import static org.junit.Assert.assertTrue

//From 	page 3 http://mita-tac.wikispaces.com/file/view/CEF+White+Paper+071709.pdf
class ExtensionTest {

	

	
	@Test
	void testCreateWithPipe(){
				
		def map = [:]
		map['src'] = '10.0.0.1'
		map['act'] = 'blocked a | in message'
		map['dst'] = '1.1.1.1'		
		def fields = new Extension(map)		
		assertThat(fields.toString(), is(equalTo('src=10.0.0.1 act=blocked a | in message dst=1.1.1.1')))	
			
	}


	@Test
	void testCreateWithBackSlash(){
				
		def map = [:]
		map['src'] = '10.0.0.1'
		map['act'] = 'blocked a \\ in message'
		map['dst'] = '1.1.1.1'
		def fields = new Extension(map)
		assertThat(fields.toString(), is(equalTo('src=10.0.0.1 act=blocked a \\ in message dst=1.1.1.1')))
			
	}
	
	
	@Test
	void testCreateWithEquals(){
		def map = [:]
		map['src'] = '10.0.0.1'
		map['act'] = 'blocked a = in message'
		map['dst'] = '1.1.1.1'
		def fields = new Extension(map)
		assertThat(fields.toString(), is(equalTo('src=10.0.0.1 act=blocked a \\= in message dst=1.1.1.1')))
			
	}
	
	
	@Test
	void testTruncatedValue(){
		def val = "a"
		(0..5000).each{
			val = val + "a"
		}
		def map = [:]
		map['to.long'] = val
		def fields = new Extension(map)

		assertTrue(fields.toString().size() <= Extension.MAX_VALUE_LENGTH + 8)  //padding for field name
	}
	
	@Test
	void testFieldListToString(){
		assertThat(Extension.listToString(["one  , foo ", "two", "three"]), is(equalTo("one  , foo ;two;three")))
		assertThat(Extension.listToString([]), is(equalTo("")))
		assertThat(Extension.listToString(["one"]), is(equalTo("one")))
		assertThat(Extension.listToString(null), is(equalTo("")))
		assertThat(Extension.listToString(["1"]), is(equalTo("1")))
		assertThat(Extension.listToString([new Integer(1)]), is(equalTo("1")))
	}
	
	
	@Test
	void testTrimFieldToMaxLength(){
		//If not a string return the value
		assertThat(Extension.trimFieldToMaxLength(new Integer(10)), is(equalTo(new Integer(10))))
		
		assertThat(Extension.trimFieldToMaxLength("TEST"), is(equalTo("TEST")))
		
		assertThat(Extension.trimFieldToMaxLength(Extension.UNKOWN_VALUE), is(equalTo("UNKNOWN")))
		
		assertThat(Extension.trimFieldToMaxLength(Extension.UNKOWN_NUMBER_VALUE), is(equalTo("-1")))
	}
	
	
	@Test
	public void testNoFieldBlankOrNull(){
		def fields = [:]
		fields["1"]    				= "      "
		fields["2"]   				= ""
		fields["3"] 				= null
		fields["4"]					= "FOO"
		fields["5"] 				= new Integer(1)
		fields["6"]			 		= new Date()

		def ext = new Extension(fields)

		ext.fields.each{k, v ->
			assertThat(v, is(notNullValue()))
		}
				
	}
	
	
	@Test
	public void testNumberFieldsReturn(){
		def fields = [:]
		fields[Extension.NUMBER_OF_MATCHES]  = 100
		assertThat(new Extension(fields).toString(), is(equalTo("cn1=100")))
		
		fields[Extension.NUMBER_OF_MATCHES]  = "100"
		assertThat(new Extension(fields).toString(), is(equalTo("cn1=100")))
	

	}
	
	@Test
	public void testNumberFieldsReturnNegativeOneIfNull(){
		def fields = [:]
		fields[Extension.NUMBER_OF_MATCHES]  = null
		assertThat(new Extension(fields).toString(), is(equalTo("cn1=-1")))
		fields[Extension.NUMBER_OF_MATCHES]  = ""
		assertThat(new Extension(fields).toString(), is(equalTo("cn1=-1")))
		fields[Extension.NUMBER_OF_MATCHES]  = "          "
		assertThat(new Extension(fields).toString(), is(equalTo("cn1=-1")))

		fields = [:]
		fields[Extension.PAYLOAD_SIZE]  = null
		assertThat(new Extension(fields).toString(), is(equalTo("fsize=-1")))
		fields[Extension.PAYLOAD_SIZE]  = ""
		assertThat(new Extension(fields).toString(), is(equalTo("fsize=-1")))
		fields[Extension.PAYLOAD_SIZE]  = "          "
		assertThat(new Extension(fields).toString(), is(equalTo("fsize=-1")))
		
		fields = [:]
		fields[Extension.OLD_PAYLOAD_SIZE]  = null
		assertThat(new Extension(fields).toString(), is(equalTo("oldFileSize=-1")))
		fields[Extension.OLD_PAYLOAD_SIZE]  = ""
		assertThat(new Extension(fields).toString(), is(equalTo("oldFileSize=-1")))
		fields[Extension.OLD_PAYLOAD_SIZE]  = "          "
		assertThat(new Extension(fields).toString(), is(equalTo("oldFileSize=-1")))

	}
	
	@Test
	public void testStringFieldsReturnUnknownIfNull(){
		def fields = [:]
		fields[Extension.PAYLOAD_CLS]  = null
		assertThat(new Extension(fields).toString(), is(equalTo("filePermission=UNKNOWN")))
		fields[Extension.PAYLOAD_CLS]  = ""
		assertThat(new Extension(fields).toString(), is(equalTo("filePermission=UNKNOWN")))
		fields[Extension.PAYLOAD_CLS]  = "          "
		assertThat(new Extension(fields).toString(), is(equalTo("filePermission=UNKNOWN")))
	}
	
	@Test
	public void testEmptyCollectionsReturnUnknown(){
		def fields = [:]
		fields[Extension.PAYLOAD]  = [:]
		assertThat(new Extension(fields).toString(), is(equalTo("fname=UNKNOWN")))

		fields[Extension.PAYLOAD]  = []
		assertThat(new Extension(fields).toString(), is(equalTo("fname=UNKNOWN")))
	}
	
	
	@Test
	public void testNumbersParse(){
		def fields = [:]
		fields[Extension.PAYLOAD]  = new Integer(100)
		assertThat(new Extension(fields).toString(), is(equalTo("fname=100")))

	}
}
