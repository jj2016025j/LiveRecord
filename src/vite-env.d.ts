/// <reference types="vite/client" />

enum MikeErrorCodeNum {
  'TestCode' = -1,
  'VerifyError' = 0,
  'Nothing' = 1,
  'CantSms' = 4,
}

interface IMikeRes<DATA = unknown> {
  status: number;
  data: DATA;
  msg: string;
}

interface IMikeError {
  errorCode: MikeErrorCodeNum;
  errors: null | Object;
  status: number;
  title: string;
  type: string;
}
