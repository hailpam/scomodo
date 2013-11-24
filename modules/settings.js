
/**
 * Log Level Enumeration
 * 
 * @enumeration
 */
var LogLevelType = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	VERBOSE: "VERBOSE"
}

/**
 * Application specific settings
 * 
 */
var Settings = {
	// whether is the application in debug modality
	debug: true,
	// log level
	log: LogLevelType.VERBOSE,
	// application name 
	appName: "SCOMODO Dashboard",
	// application version
	appVersion: 1.0,
	// username
	appUser: "Souliss",
	// polling period in ms
	resTimePollPeriod: 60000 
};
