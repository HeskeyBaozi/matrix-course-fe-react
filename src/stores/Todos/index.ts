import { flow, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
import { fetchStudentTodos, fetchTeacherOrTaTodos } from './service';
import { StudentTodoItem, TeacherOrTaTodoItem } from './todoitem';

const TodosState = types
  .model('TodosState', {
    studentList: types.maybe(types.array(StudentTodoItem)),
    teacherOrTaList: types.maybe(types.array(TeacherOrTaTodoItem))
  });

type TodosStateType = typeof TodosState.Type;
interface ITodosState extends TodosStateType { }

const TodosStore = types
  .compose(TodosState, LoadingStore)
  .actions((self: ITodosState) => {
    return {
      LoadTodosAsync: flow(function* LoadTodosAsync() {
        const [
          { data: { data: studentList } },
          { data: { data: teacherOrTaList } }
        ] = yield Promise.all([
          fetchStudentTodos(),
          fetchTeacherOrTaTodos()
        ]);
        self.studentList = studentList;
        self.teacherOrTaList = teacherOrTaList;
      })
    };
  })
  .named('TodosStore');

type TodosStoreType = typeof TodosStore.Type;
export interface ITodosStore extends TodosStoreType { }

export const todosStore: ITodosStore = TodosStore.create();
