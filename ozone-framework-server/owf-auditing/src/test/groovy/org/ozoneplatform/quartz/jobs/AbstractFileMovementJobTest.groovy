package org.ozoneplatform.quartz.jobs

import org.junit.Test
import org.ozoneplatform.auditing.quartz.jobs.AbstractFileMovementJob

import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.CoreMatchers.is
import static org.junit.Assert.assertThat

class AbstractFileMovementJobTest {

	
	@Test
	void testIsSweepableFileIngoreList(){
		//Test that .log files are not picked up
		assertThat(AbstractFileMovementJob.isSweepableFile("marketplace-cef-audit.log",1),is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("marketplace-cef-audit.log.bak",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("marketplace-cef-audit.log.",1 ), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("marketplace-cef-audit.log.1.1",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log",1  ),is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.bak",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.",1 ), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.1.1",1), is(equalTo(false)))
		
		//Test non omp|marketplace files are not picked up
		assertThat(AbstractFileMovementJob.isSweepableFile("stacktrace.log",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("stacktrace.log.2",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-stacktrace.log",1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-stacktrace.log.2",1), is(equalTo(false)))
		
	}
	
	
	@Test
	public void testMatchFileNamesThatAreLessThanToday(){		
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.2013-07-11.1", 1), is(equalTo(true)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.2013-07-11.3", 2), is(equalTo(true)))		
	}
	
	@Test
	public void testMatchFileNamesThatAreToday(){		
		assertThat(AbstractFileMovementJob.isSweepableFile(getFileNameForToday(1), 1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile(getFileNameForToday(2), 3), is(equalTo(true)))
		assertThat(AbstractFileMovementJob.isSweepableFile(getFileNameForToday(200), 500), is(equalTo(true)))
	}
	
	@Test
	public void testIgnoreFileNamesThatAreGreaterThanToday(){		
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.2099-07-11.1", 1), is(equalTo(false)))
		assertThat(AbstractFileMovementJob.isSweepableFile("owf-cef-audit.log.2099-07-11.2", 3), is(equalTo(false)))		
	}
	
	
	@Test
	public void testGetMaxFileFromToday(){
		
		def files = (1..4).collect {
			getFileNameForToday(it)
		}
		
		assertThat(AbstractFileMovementJob.getMaxFileFromToday(files), is(equalTo(4)))
	}
	
	
	private String getFileNameForToday(int nbr){
		String today = AbstractFileMovementJob.logDateFormatter.format(new Date())
		return "owf-cef-audit.log." + today + "." + nbr
	}
}
