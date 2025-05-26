// App Basic Data
export const appTypes = ['Quick Online Courses', 'Face to Face Discussions', 'Full Intro Training'];

// App Frameworks
export const appFrameworks = ['HTML5', 'ReactJS', 'Angular', 'Vue'];

// App Databases
export const databaseSolutions = ['MySQL', 'Firebase', 'DynamoDB'];

// App Storage
export const storageOptions = ['Basic Server', 'AWS', 'Google'];

// Default Data for Creating an App
export const defaultCreateAppData = {
  appBasic: {
    appName: '',
    appType: 'Quick Online Courses'
  },
  appFramework: 'HTML5',
  appDatabase: {
    databaseName: 'db_name',
    databaseSolution: 'MySQL'
  },
  appStorage: 'Basic Server'
};

// Step Properties
/**
 * @typedef {Object} StepProps
 * @property {Object} data - The data related to the app creation.
 * @property {Function} updateData - Function to update the data.
 * @property {boolean} hasError - Indicates if there's an error.
 */
