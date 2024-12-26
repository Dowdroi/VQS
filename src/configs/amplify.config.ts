import { Amplify } from 'aws-amplify';
import amplify_outputs from './dev/dev/amplify_outputs.json';
Amplify.configure(amplify_outputs);

console.log('🚀vo-portal: ~ amplify.getConfig', Amplify.getConfig());
