import { config } from './config';
import firebase from 'firebase';

export const fire = firebase.initializeApp(config);

export default fire;
