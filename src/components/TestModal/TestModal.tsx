// prettier-ignore
import { Button, Divider, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { useTestMutation, useTestQuery } from "../../utils";

interface ITestModalProps {
  isTest: boolean;
}

const { Title, Text } = Typography;
const TestModal: React.FunctionComponent<ITestModalProps> = ({ isTest }) => {
  const [enableQuery, setEnableQuery] = useState(false);
  const [isMutationError, setIsMutationError] = useState(false);
  const [isQueryError, setIsQueryError] = useState(false);

  const {
    data: mutationData,
    mutate,
    ...mutationOther
  } = useTestMutation({
    isTest: true,
    isTestError: isMutationError,
    onTest: () => {
      return Promise.resolve("Mutation success");
    },
    onMutate: () => {
      console.log("Use mutate");
    },
    onSuccess: () => {
      console.log("Use Success");
    },
    onError: () => {
      console.log("Use Error");
    },
    successNotify: {
      title: "APEC store",
      des: "Test success",
    },
  });

  const {
    data: queryData,
    refetch,
    ...queryOther
  } = useTestQuery<string, number>({
    enabled: enableQuery,
    isTest: true,
    isTestError: isQueryError,
    onTest: () => {
      return Promise.resolve<string>("Query success");
    },
    queryKey: ["test"],
    qf: () => {
      return Promise.resolve<string>("On Query Fn");
    },
    onSuccess: () => {
      console.log("Use Success");
    },
    onError: (error) => {
      console.log("Use Error", { error });
    },
  });

  if (process.env.NODE_ENV === "development" && isTest)
    return (
      <>
        <Modal open footer={null} closable={false}>
          <Title level={3}>This is test</Title>
          <Divider>Mutation</Divider>
          <div>
            <Space
              style={{
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Title level={4}>Result</Title>
              <Space>
                <Button
                  onClick={() => {
                    mutate();
                  }}
                >
                  mutate
                </Button>
                <Button onClick={() => setIsMutationError((pre) => !pre)}>
                  {isMutationError ? "To Success" : "To Test Error"}
                </Button>
              </Space>
            </Space>
            <Text>Data: {mutationData}</Text>
            <br />
            <Text>{JSON.stringify(mutationOther)}</Text>
          </div>

          <Divider>Query</Divider>
          <div>
            <Space
              style={{
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Title level={4}>Result</Title>
              <Space>
                <Button onClick={() => setEnableQuery((pre) => !pre)}>
                  {enableQuery ? "Disable" : "Enable"}
                </Button>
                <Button onClick={() => refetch()}>Refetch</Button>
                <Button onClick={() => setIsQueryError((pre) => !pre)}>
                  {isQueryError ? "To Success" : "To Test Error"}
                </Button>
              </Space>
            </Space>
            <Text>Data: {JSON.stringify(queryData)}</Text>
            <br />
            <Text>{JSON.stringify(queryOther)}</Text>
          </div>
        </Modal>
      </>
    );
  return <span></span>;
};

export default TestModal;
