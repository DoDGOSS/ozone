package org.ozoneplatform.auditing.format.cef.util

import org.junit.Test
import org.ozoneplatform.auditing.format.cef.util.EscapedStringUtil

import static org.hamcrest.CoreMatchers.*
import static org.junit.Assert.assertThat

class EscapedStringUtilTest {

		
	
	@Test
	void testIsValidExtensionKey(){
		
		//If the key is null false should be returned
		assertThat(EscapedStringUtil.isValidExtensionKey(null), is(equalTo(false)))
		
		
		//If the key has white space false should be returned
		assertThat(EscapedStringUtil.isValidExtensionKey("white space"), is(equalTo(false)))

		//If the key has white space false should be returned
		assertThat(EscapedStringUtil.isValidExtensionKey("        "), is(equalTo(false)))
				
		
		//If the key has no white space and is non null true should be returned
		assertThat(EscapedStringUtil.isValidExtensionKey("FOOBAR"), is(equalTo(true)))
	}
	
	
	
	@Test
	void testIsValidExtensionValue(){
		
		//If the extension is null false should be returned
		assertThat(EscapedStringUtil.isValidExtensionValue(null), is(equalTo(false)))
	}
	
	
	@Test
	void testIsValidField(){
		
		//If the field is null then false should be returned
		assertThat(EscapedStringUtil.isValidField(null), is(equalTo(false)))
		
		//If the field has a newline char then false should be returned
		assertThat(EscapedStringUtil.isValidField("foo \n bar"), is(equalTo(false)))
		
		//If the field has a newline char then false should be returned
		assertThat(EscapedStringUtil.isValidField("foo \r bar"), is(equalTo(false)))

		
		//If the field does not has a newline char then true should be returned
		assertThat(EscapedStringUtil.isValidField("foo bar"), is(equalTo(true)))
		
				
	}
	
	
	@Test
	void testEscapeFieldContainsInvalidCharacter(){
		//just return an empty string
		assertThat(EscapedStringUtil.escapeField("foo \n bar"), is(equalTo("")))
	}

	@Test
	void testEscapeField(){
		//If the input is null then the output should be null as well
		assertThat(EscapedStringUtil.escapeField(null), is(nullValue()))
		
		//If the input has a pipe it must be escaped
		assertThat(EscapedStringUtil.escapeField("this has | a pipe"), is(equalTo("this has \\| a pipe")))
		
	}
	
	
	@Test
	void testEscapeExtensionKeyContainsInvalidCharacter(){
		assertThat(EscapedStringUtil.escapeExtensionKey("foo bar"), is(equalTo("foobar")))
		assertThat(EscapedStringUtil.escapeExtensionKey("foo        bar"), is(equalTo("foobar")))
	}
	
	@Test
	void testEscapeExtensionKey(){
		//If the input is null then the output should be null as well
		assertThat(EscapedStringUtil.escapeExtensionKey(null), is(nullValue()))
		
		//If the input has a equals sign it must be escaped
		assertThat(EscapedStringUtil.escapeExtensionKey("foo=bar"), is(equalTo("foo\\=bar")))
		
	}
	
	
	@Test
	void testEscapeExtensionValue(){
		//If the input is null then the output should be null as well
		assertThat(EscapedStringUtil.escapeExtensionValue(null), is(nullValue()))
		
		
		//If the input has a equals sign it must be escaped
		assertThat(EscapedStringUtil.escapeExtensionValue("foo = bar"), is(equalTo("foo \\= bar")))
		
		
		//If the input has a new line it must be escaped
		assertThat(EscapedStringUtil.escapeExtensionValue("foo \r bar"), is(equalTo("foo \\r bar")))

		
		//If the input has a new line it must be escaped
		assertThat(EscapedStringUtil.escapeExtensionValue("foo \n bar"), is(equalTo("foo \\n bar")))

		
		//If the input has a new line it must be escaped
		assertThat(EscapedStringUtil.escapeExtensionValue("foo \\ bar"), is(equalTo("foo \\ bar")))
						
	}
	
}
