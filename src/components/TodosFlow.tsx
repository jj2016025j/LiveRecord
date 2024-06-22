import { useNotifyStore } from '@/store';
import { Button, Checkbox, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { FcTodoList } from 'react-icons/fc';

type TodoOptions = {
  title: string;
  message?: string;
};
interface ITodosFlowProps {
  todos: Array<TodoOptions>;
  top?: number | string;
  left?: number | string;
  topOffset?: number | string;
  leftOffset?: number | string;
  isTest?: boolean;
  defaultClose?: boolean;
}

const itemKey = 'DEV:todoflowKey' + window.location.hash;
const alwaysCloseKey = 'DEV:todoFlowAlwaysClose';
const TodosFlow: React.FunctionComponent<ITodosFlowProps> = (props) => {
  const { todos, top, left, topOffset, leftOffset, isTest, defaultClose } = props || {};

  if (isTest && import.meta.env.DEV) {
    const [alwaysClose, setAlwaysClose] = useState(!!defaultClose);
    const [fixeds, setFixeds] = useState<Array<string>>([]);
    const [open, setOpen] = useState(false);
    const { pushBEQ } = useNotifyStore();

    // 全部的談窗是否關閉
    useEffect(() => {
      const storeAlwaysClose = localStorage.getItem(alwaysCloseKey);
      if (!!Number(storeAlwaysClose)) {
        // 如果未設定的情況下維持開發時的各業面設定
        setAlwaysClose(true);
      } else if (isTest && todos.length) {
        // 預設情況，並且為test時自動開啟
        setOpen(true);
      }
    }, [isTest, todos]);

    // 已完成紀錄還原
    useEffect(() => {
      const JSONkeys = localStorage.getItem(itemKey);
      try {
        if (!JSONkeys) return;
        const storageKeys: Array<string> = JSON.parse(JSONkeys);
        setFixeds(storageKeys);
      } catch (e) {
        pushBEQ([
          {
            title: 'Todo flow',
            des: 'Parsing Json keys error' + JSON.stringify(e),
          },
        ]);
      }
    }, []);

    return (
      <>
        <div
          style={{
            position: 'fixed',
            bottom: '1.5%',
            right: '5%',
            zIndex: 500,
          }}
        >
          <Button
            style={{
              backgroundColor: open ? 'rgba(200, 35, 200, 0.7)' : 'rgba(200, 35, 200, 0.5)',
            }}
            size='large'
            shape='circle'
            icon={<FcTodoList />}
            onClick={() => {
              console.log('onclick`');
              setOpen((pre) => !pre);
            }}
          ></Button>

          <Tooltip title='不要總是開啟'>
            <div
              style={{
                position: 'absolute',
                top: '0%',
                right: '0%',
                transform: 'translate(40%, -40%)',
              }}
            >
              <Checkbox
                checked={alwaysClose}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAlwaysClose(true);
                    localStorage.setItem(alwaysCloseKey, '1');
                  } else {
                    localStorage.setItem(alwaysCloseKey, '0');
                    setAlwaysClose(false);
                  }
                }}
              ></Checkbox>
            </div>
          </Tooltip>
        </div>

        <div
          style={{
            position: 'fixed',
            top: open ? (top ? top : '50%' + (topOffset ? '+' + topOffset + 'px' : '')) : '95.5 %',
            left: open ? (left ? left : '50%' + (leftOffset ? '+' + leftOffset + 'px' : '')) : '92%',
            border: '2px solid #9b30ff',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: open ? '10px' : '50%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: open ? '25vw' : 15,
            maxHeight: open ? '100vh' : 15,
            zIndex: 500,
            transform: open ? 'translate(-50%,-50%)' : 'translate(0%, 0%)',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            transition: 'all 0.5s ease, visibility 0s',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className='tight'>Todos</h2>
            <Button
              type='text'
              shape='circle'
              onClick={() => setOpen(false)}
            >
              X
            </Button>
          </div>
          <hr />
          {todos.map((todo) => {
            const { title, message } = todo || {};
            return (
              <div
                key={title}
                style={{ display: 'flex' }}
              >
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newFixed = fixeds.concat([title]);
                              localStorage.setItem(itemKey, JSON.stringify(newFixed));
                              setFixeds(newFixed);
                            } else {
                              const newFixed = fixeds.filter((data) => data !== title);
                              localStorage.setItem(itemKey, JSON.stringify(newFixed));
                              setFixeds(newFixed);
                            }
                          }}
                          checked={fixeds.includes(title)}
                        />
                      </td>
                      <td>
                        <strong>{title}</strong>
                      </td>
                      <td>{message && <p style={{ marginLeft: 15 }}>{message}</p>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return <></>;
};

export default TodosFlow;
