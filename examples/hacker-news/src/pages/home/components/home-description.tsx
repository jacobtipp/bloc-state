import { Button, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { useState } from 'react';
import { HomeBloc } from '../bloc';
import { useBloc } from '@jacobtipp/react-bloc';

export function HomeDescription() {
  const [transformer, { setHomeState }] = useBloc(HomeBloc, {
    selector: (data) => data.transformer,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChange = (e: RadioChangeEvent) => {
    setHomeState((state) =>
      state.ready((data) => {
        data.transformer = e.target.value;
      })
    );
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      style={{ position: 'absolute', left: 0, bottom: 0, padding: '2rem' }}
    >
      <div style={{ padding: '1rem' }}>
        <Button type="primary" size="small" onClick={showModal}>
          Click for description!
        </Button>
      </div>
      <Modal
        title="Bloc Concurrency"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          The modern Bloc library for Dart comes with powerful concurrent event
          processing. The following demo showcases the different effects of the
          concurrent(mergeMap), restartable(switchMap), and
          sequential(concatMap) event transformers.
        </p>
        <p>
          This demo is built with Typescript and the{' '}
          <code>@jacobtipp/bloc</code> libray that adheres to the modern Bloc
          Dart api. It is a clone of the hacker-news example from the Jotai
          state management library for react.
        </p>

        <p>
          Clicking the next arrow will increment the id, which will create an
          event to fetch a new post for that id. Because the response to the
          request is quick, a 1 second delay has been added to highlight the
          different event transformer effects. Click repeatedly with each mode
          to see how they handle each new event.
        </p>
      </Modal>
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
