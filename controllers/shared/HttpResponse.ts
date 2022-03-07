import { Http2ServerResponse } from 'http2';
import { HttpStatusCode } from './HttpStatusCode';

interface HttpResponse {
  code?: HttpStatusCode;
  body: any;
}

export default HttpResponse;
