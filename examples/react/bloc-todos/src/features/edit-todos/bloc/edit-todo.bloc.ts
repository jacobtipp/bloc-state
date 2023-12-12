import { Bloc, Emitter } from '@jacobtipp/bloc';
import { Todo } from '../../../packages/todos-client/model/todo';
import {
  EditTodoDescriptionChanged,
  EditTodoEvent,
  EditTodoSubmitted,
  EditTodoSubscribed,
  EditTodoTitleChanged,
} from './edit-todo.event';
import { EditTodoState } from './edit-todo.state';
import { TodosRepository } from '../../../packages/todos-repository/todos-repository';

export class EditTodoBloc extends Bloc<EditTodoEvent, EditTodoState> {
  constructor(private todosRepository: TodosRepository) {
    super(
      new EditTodoState({
        title: '',
        description: '',
      })
    );

    this.on(EditTodoSubscribed, this.onSubscribed);
    this.on(EditTodoTitleChanged, this.onTitleChanged);
    this.on(EditTodoDescriptionChanged, this.onDescriptionChanged);
    this.on(EditTodoSubmitted, this.onSubmitted);
  }

  async onSubmitted(_event: EditTodoSubmitted, emit: Emitter<EditTodoState>) {
    try {
      const { title, description, id, isCompleted } = this.state.data;
      await this.todosRepository.saveTodo(
        new Todo(title, description, isCompleted, id)
      );
      emit(
        this.state.copyWith((draft) => {
          draft.status = 'ready';
          draft.submitSuccess = true;
        })
      );
    } catch (e) {
      emit(this.state.failed());
    }
  }

  onDescriptionChanged(
    event: EditTodoDescriptionChanged,
    emit: Emitter<EditTodoState>
  ) {
    emit(
      this.state.ready((data) => {
        data.description = event.description;
      })
    );
  }

  onTitleChanged(event: EditTodoTitleChanged, emit: Emitter<EditTodoState>) {
    emit(
      this.state.ready((data) => {
        data.title = event.title;
      })
    );
  }

  async onSubscribed(event: EditTodoSubscribed, emit: Emitter<EditTodoState>) {
    emit(this.state.loading());

    try {
      const todo = await this.todosRepository.getTodo(event.todoId);
      emit(
        this.state.ready({
          ...todo,
        })
      );
    } catch (error: any) {
      if (error instanceof Error) {
        emit(this.state.failed(error));
      }
    }
  }

  override fromJson(json: string): EditTodoState {
    const parsed = super.fromJson(json);
    return new EditTodoState(parsed.data, parsed.status);
  }
}
