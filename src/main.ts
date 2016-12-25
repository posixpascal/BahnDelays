import {TrainDelay} from './traindelay';
import {Stations} from './trainstations';
import * as dotenv from 'dotenv'; dotenv.config();


const trainDelay = new TrainDelay();
trainDelay.start();