
package org.ozoneplatform.appconfig.server.domain.model

import org.junit.Test

import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.CoreMatchers.is
import static org.junit.Assert.assertThat

class ApplicationConfigurationTest {


	@Test
	void testValueAsList(){
		
		ApplicationConfiguration t
		
		//Test when the format is like ['string','string2']
		t = new ApplicationConfiguration(value:['FOO', 'BAR', 'BAZ', 'BOZ', 'COS'])
		
		assertThat(t.valueAsList().size(), is(equalTo(5)))

		
		//Test when the format is like "'string','string2'"
		t = new ApplicationConfiguration(value: "'FOO', 'BAR', 'BAZ', 'BOZ', 'COS'")
		
		assertThat(t.valueAsList().size(), is(equalTo(5)))
		

		//Test when the format is like "string,string2"
		t = new ApplicationConfiguration(value: "FOO, BAR, BAZ, BOZ, COS")
		
		assertThat(t.valueAsList().size(), is(equalTo(5)))

						
	}
	
	@Test
	void testValueAsMap(){
		
		
		ApplicationConfiguration t
		
		//Test when the format is like ['foo:bar,baz:boz']
		t = new ApplicationConfiguration(value : "Franchise Store 1::/marketplace/themes/common/images/agency/agencyDefault.png, Franchise Store 2::/marketplace/themes/common/images/agency/agencyDefault.png")

		
		assertThat(t.valueAsMap().get("Franchise Store 2"), is(equalTo("/marketplace/themes/common/images/agency/agencyDefault.png")))
		assertThat(t.valueAsMap().size(), is(equalTo(2)))
						
	}
	
	@Test
	void testBuildStringConfiguration(){
		ApplicationConfiguration applicationConfiguration = ApplicationConfiguration.buildStringInstance(MockApplicationSetting.MOCK_SETTING, MockApplicationSettingType.MOCK_SETTING_TYPE)
		assertThat(applicationConfiguration.type, is(equalTo('String')))
	}
	
	@Test
	void testBuildBooleanConfiguration(){
		ApplicationConfiguration applicationConfiguration = ApplicationConfiguration.buildBooleanInstance(MockApplicationSetting.MOCK_SETTING, MockApplicationSettingType.MOCK_SETTING_TYPE)
		assertThat(applicationConfiguration.type, is(equalTo('Boolean')))
	}
	
	@Test
	void testBuildImageConfiguration(){
		ApplicationConfiguration applicationConfiguration = ApplicationConfiguration.buildImageInstance(MockApplicationSetting.MOCK_SETTING, MockApplicationSettingType.MOCK_SETTING_TYPE)
		assertThat(applicationConfiguration.type, is(equalTo('Image')))
	}
	
	@Test
	void testBuildListConfiguration(){
		ApplicationConfiguration applicationConfiguration = ApplicationConfiguration.buildListInstance(MockApplicationSetting.MOCK_SETTING, MockApplicationSettingType.MOCK_SETTING_TYPE)
		assertThat(applicationConfiguration.type, is(equalTo('List')))
	}
	
	@Test
	void testBuildMapConfiguration(){
		ApplicationConfiguration applicationConfiguration = ApplicationConfiguration.buildMapInstance(MockApplicationSetting.MOCK_SETTING, MockApplicationSettingType.MOCK_SETTING_TYPE)
		assertThat(applicationConfiguration.type, is(equalTo('Map')))
	}
	
	
	private enum  MockApplicationSetting implements ApplicationSetting{
		MOCK_SETTING("mock.setting")
		
		private final String code
		
		MockApplicationSetting(String code) {
			this.code = code;
		}
		public String getCode() {
			return code
		}
	}
	
	private enum MockApplicationSettingType implements ApplicationSettingType  {
		MOCK_SETTING_TYPE("MOCK_SETTING_TYPE")
		
		private final String description
		
		MockApplicationSettingType(String description) {
			this.description = description;
		}
		public String getDescription() {
			return description
		}
	}
	
}
