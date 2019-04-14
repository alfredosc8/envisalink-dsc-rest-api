package za.co.juba;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Properties;

import javax.inject.Inject;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.concept.dbtools.DBAccessor;
import com.concept.dbtools.jdbc.JdbcStringHostCtxConfig;
import com.concept.mvc.navigation.controller.Controller;

import za.co.juba.liquibase.LiquibaseExecutor;

/**
 * 
 * @author Sabelo Simelane <sabside@gmail.com>
 *
 */
@RunWith(Suite.class)
@SuiteClasses({	})
public class AllTests {
	
	public static String PROJECT_ROOT = DirectoryUtil.currentDir();
	private @Inject DBAccessor dbAccessor;
	private @Inject LiquibaseExecutor liquibase;
	
	@Before
	public void setup() {
		try {
			
			Properties props = new Properties();
			props.load(new FileInputStream(new File(DirectoryUtil.currentDir().replace("\\.", "")+ "/src/test/resources/META-INF/settings.properties")));
			
			System.out.println(Paths.get(".").toAbsolutePath());
			
			Controller.serverPath = props.getProperty("path");
			
			dbAccessor.setup(new JdbcStringHostCtxConfig("localhost", Integer.parseInt(props.getProperty("db.port")), props.getProperty("db.user"), 
					props.getProperty("db.password"), props.getProperty("db.test"), false, null));
			
			
			liquibase.init("./src/test/resources/");
			liquibase.execute();
			
		} catch (Exception e) {

			e.printStackTrace();
		}
	}
	
	@AfterClass
	public void cleanup() {
		/*System.out.println("AFTER THE FACT!!!");
		try {
			Connection conn = dbAccessor.connect();
			dbAccessor.runUpdate(conn, "SELECT 'drop table if exists ' || tablename || ' cascade;' as pg_drop FROM pg_tables");
		} catch (SQLException e) {
			e.printStackTrace();
		}*/
	}
}
