import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { NotifyOptions, useNotifyStore } from '../store';
// eslint-disable-next-line prettier/prettier
import { QueryKey, UseQueryOptions, QueryClient, useQuery, UseMutationOptions, useMutation } from '@tanstack/react-query';
import { useLogout } from '@/api';

// ### query
type TestQueryProps<TDATA = unknown, TPARAMS = unknown, TERROR = AxiosError<IMikeError>> = {
  isTest?: boolean;
  onTest?: (params?: TPARAMS) => Promise<TDATA>;
  isTestError?: boolean;
  delay?: number;
  onQuery?: (params?: TPARAMS) => void;
  onSuccess?: (data: TDATA, params?: TPARAMS) => void;
  onError?: (error: TERROR) => void;
  onSettled?: () => void;
  params?: TPARAMS;
  qf: (params?: TPARAMS) => Promise<TDATA>;
  blockNotify?: boolean;
  skipLog?: boolean;
};

const withTestLog = true;
const useTestQuery = <
  TDATA = unknown,
  TPARAMS = unknown,
  TERROR = AxiosError<IMikeError>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TDATA, TERROR, TPARAMS, TQueryKey> & TestQueryProps<TDATA, TPARAMS, TERROR>,
  client?: QueryClient,
) => {
  const {
    qf,
    params,
    isTest,
    onTest,
    isTestError,
    delay,
    onQuery,
    onSuccess,
    onError,
    onSettled,
    blockNotify,
    queryKey,
    skipLog,
    ...originOptions
  } = options;
  const { logout } = useLogout();

  const { pushBEQ } = useNotifyStore();

  const { data: whyIsParam, ...result } = useQuery<TDATA, TERROR, TPARAMS, TQueryKey>(
    {
      ...originOptions,
      queryKey,
      queryFn: () => {
        if (onQuery) onQuery(params);
        return new Promise<TDATA>((resolve, reject) => {
          if (process.env.NODE_ENV === 'development' && isTestError) {
            const makeError: AxiosError<IMikeError> = {
              isAxiosError: false,
              toJSON: (): object => ({}),
              name: '',
              message: '',
              response: {
                data: {
                  errorCode: -1,
                  errors: {},
                  status: -1,
                  title: 'Test query error',
                  type: '',
                },
                status: -1,
                statusText: '',
                headers: {},
                config: {} as InternalAxiosRequestConfig<any>,
              },
            };
            reject(makeError);
            return;
          }

          if (process.env.NODE_ENV === 'development' && isTest) {
            if (onTest)
              setTimeout(
                () => {
                  resolve(onTest(params));
                },
                delay ? delay : 0,
              );
            return;
          }
          resolve(qf(params));
        })
          .then((value) => {
            if (withTestLog && process.env.NODE_ENV === 'development' && !skipLog)
              // console.info(`Query test success, key: ${queryKey} \r\n `, {
              //   value,
              // });
            if (onSuccess) onSuccess(value, params);

            return value;
          })
          .catch((error) => {
            const mikeError = error as AxiosError<IMikeError>;
            // if (process.env.NODE_ENV === 'development') console.warn('Query test error,', { error });
            // notify
            if (!blockNotify)
              pushBEQ([
                {
                  title: 'APEC store',
                  des: mikeError.response?.data?.title,
                },
              ]);

            // auth
            if (mikeError.response?.status === 401) {
              logout();
            }
            return error;
          })
          .finally(() => {
            if (onSettled) onSettled();
          });
      },
    },
    client,
  );
  const data = (whyIsParam as TDATA) || undefined;

  return { data, ...result };
};

type UseTestQueryProps<Other = unknown, TPARAMS = unknown> = Other & {
  enabled?: boolean;
  isTest?: boolean;
  params?: TPARAMS;
  isTestError?: boolean;
};

// mutation
type TestMutationProps<TDATA = unknown, TPARAMS = unknown, TERROR = AxiosError<IMikeError>> = {
  isTest?: boolean;
  isTestError?: boolean;
  onTest?: (params: TPARAMS) => Promise<TDATA>;
  delay?: number;
  onSuccess?: (data: TDATA, params?: TPARAMS) => void;
  onError?: (error: TERROR) => void;
  onSettled?: () => void;
  blockNotify?: boolean;
  successNotify?: NotifyOptions;
  skipLog?: boolean;
};

const useTestMutation = <TDATA = unknown, TPARAMS = void, TERROR = AxiosError<IMikeError>, TContext = unknown>(
  options: UseMutationOptions<TDATA, TERROR, TPARAMS, TContext> & TestMutationProps<TDATA, TPARAMS, TERROR>,
  queryClient?: QueryClient,
) => {
  const {
    isTest,
    isTestError,
    onTest,
    delay,
    mutationFn,
    onSuccess,
    onError,
    blockNotify,
    successNotify,
    skipLog,
    ...originOptions
  } = options;

  const { pushBEQ, pushBSQ } = useNotifyStore();

  const newConfig: UseMutationOptions<TDATA, TERROR, TPARAMS, TContext> = {
    ...originOptions,
    mutationFn: (props) => {
      return new Promise((resolve, reject) => {
        if (isTestError && process.env.NODE_ENV === 'development') {
          const makeError: AxiosError<IMikeError> = {
            isAxiosError: false,
            toJSON: (): object => ({}),
            name: '',
            message: '',
            response: {
              data: {
                errorCode: -1,
                errors: {},
                status: -1,
                title: 'Test mutation error',
                type: '',
              },
              status: -1,
              statusText: '',
              headers: {},
              config: {} as InternalAxiosRequestConfig<any>,
            },
          };
          reject(makeError);
          return;
        }
        if (isTest && process.env.NODE_ENV === 'development' && onTest) {
          setTimeout(
            () => {
              resolve(onTest(props));
            },
            delay ? delay : 0,
          );
          return;
        }
        if (mutationFn) resolve(mutationFn(props));
      });
    },
    onSuccess: (data, parms, context) => {
      if (withTestLog && process.env.NODE_ENV === 'development' && !skipLog) {
        // console.warn('On test mutation success, data:', {
        //   data,
        //   parms,
        //   context,
        // });
      }

      if (successNotify) pushBSQ([successNotify]);
      if (onSuccess) onSuccess(data, parms, context);
    },
    onError: (error, params, context) => {
      if (process.env.NODE_ENV === 'development') {
        // console.warn('On test mutation error, error:', { error });
      }

      if (!blockNotify) {
        const mikeError = error as AxiosError<IMikeError>;
        pushBEQ([
          {
            title: 'APEC warring !',
            des: mikeError.response?.data.title,
          },
        ]);
      }
      if (onError) onError(error, params, context);
    },
  };

  return useMutation<TDATA, TERROR, TPARAMS, TContext>(newConfig, queryClient);
};

// 這個用作於使用 test mutation 建立 hook時快速設定 props
type UseTestMutationProps<TDATA = unknown, TPARAMS = unknown, Other = unknown, TERROR = AxiosError<IMikeError>> = {
  isTest?: boolean;
  onTest?: (params: TPARAMS) => Promise<TDATA>;
  delay?: number;
  onSuccess?: (data: TDATA, params?: TPARAMS) => void;
  onError?: (error: TERROR) => void;
  onSettled?: () => void;
  blockNotify?: boolean;
  successNotify?: NotifyOptions;
} & Other;

export type { UseTestQueryProps, UseTestMutationProps };
export { useTestQuery, useTestMutation };
