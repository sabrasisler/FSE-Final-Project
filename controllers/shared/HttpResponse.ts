import { Http2ServerResponse } from 'http2';
import { StatusCode } from './HttpStatusCode';

interface HttpResponse {
  code?: StatusCode;
  body: any;
}

export default HttpResponse;
