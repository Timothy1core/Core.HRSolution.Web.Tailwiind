import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const PIPELINE_URL = `${config.API_URL}/recruitment/pipeline/list_pipelines`;

export function listPipeline() {
  return axios.post(PIPELINE_URL, qs.stringify(),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

