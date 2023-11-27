import { Radio, RadioChangeEvent, Space } from 'antd';
import { useBloc } from '@jacobtipp/react-bloc';
import { HomeBloc } from '../bloc/home.cubit';

export function HomeDescription() {
  const [transformer, { setHomeState }] = useBloc(HomeBloc, {
    selector: (state) => state.data.transformer,
  });

  const onChange = (e: RadioChangeEvent) => {
    setHomeState((state) =>
      state.ready((data) => {
        data.transformer = e.target.value;
      })
    );
  };

  return (
    <section
      style={{ position: 'absolute', left: 0, bottom: 0, padding: '2rem' }}
    >
      <Radio.Group onChange={onChange} value={transformer}>
        <Space direction="vertical">
          <Radio value="concurrent">concurrent</Radio>
          <Radio value="restartable">restartable</Radio>
          <Radio value="sequential">sequential</Radio>
        </Space>
      </Radio.Group>
    </section>
  );
}
