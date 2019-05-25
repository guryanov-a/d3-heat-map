import axios from 'axios';
import { PLOT_DATA_PATH } from './constants';

export async function getData(): Promise<any> {
  let response;

  try {
    response = await axios.get(PLOT_DATA_PATH);
  } catch (error) {
    console.error(error);
  }

  if (response && response.data) {
    return response.data;
  } else {
    console.error(new Error('no data in response'));
  }
}