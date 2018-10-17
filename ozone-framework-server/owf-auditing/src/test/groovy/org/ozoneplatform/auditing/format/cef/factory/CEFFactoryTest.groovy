package org.ozoneplatform.auditing.format.cef.factory

import org.junit.Test
import org.ozoneplatform.auditing.format.cef.CEF

import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.CoreMatchers.is
import static org.junit.Assert.assertThat

public class CEFFactoryTest {

    public static final int TEST_VERSION = 1.0

    public static final String TEST_DEV_VENDOR = "OZONE"

    public static final String TEST_DEV_PRODUCT = "AUDIT"

    public static final String TEST_DEV_VERSION = "2.0"

    @Test
    void testBuildCEF(){
        CEF cef = CEFFactory.buildBaseCEF(TEST_VERSION, TEST_DEV_VENDOR, TEST_DEV_PRODUCT, TEST_DEV_VERSION, "OBJ_READ", "Test reading a URL", 5)
        assertThat(cef.version, is(equalTo(TEST_VERSION)))
        assertThat(cef.deviceVendor, is(equalTo(TEST_DEV_VENDOR)))
        assertThat(cef.deviceProduct, is(equalTo(TEST_DEV_PRODUCT)))
        assertThat(cef.deviceVersion, is(equalTo(TEST_DEV_VERSION)))
        assertThat(cef.severity, is(equalTo(5)))
    }
}
