// @refresh reset

import { useRepository, BlocProvider } from '@jacobtipp/react-bloc';
import { PropsWithChildren } from 'react';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';
import { EditTodoBloc } from '../bloc/edit-todo.bloc';
import { EditTodoSubscribed } from '../bloc/edit-todo.event';

export type EditTodoProviderProps = {
  id?: string;
};

export default function EditTodoProvider({
  children,
  id,
}: PropsWithChildren<EditTodoProviderProps>) {
  const todosRepository = useRepository(TodosRepository);

  return (
    <BlocProvider
      bloc={EditTodoBloc}
      create={() => new EditTodoBloc(todosRepository)}
      onMount={(editTodoBloc) => {
        if (id) {
          editTodoBloc.add(new EditTodoSubscribed(id));
        }
      }}
    >
      {children}
    </BlocProvider>
  );
}
