import initialState from '../state';

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'toggleBottomModal': {
      const bottomModal = action.payload.bottomModal;
      return {
        ...state,
        bottomModal,
        data: action.payload?.data ? action.payload.data : null,
        index: action.payload?.index != null ? action.payload.index : null
      };
    }
    case 'viewTask': {
      const selectedTask = action.payload.selectedTask;
      return {
        ...state,
        selectedTask,
      };
    }
    case 'login': {
      console.log("Login payload", action.payload)
      return {
        ...state,
        user: action.payload,
      };
    }

    case 'editprofile' : {
      return {
        ...state,
        user: action.payload,
      };
    }
    
    case 'users': {
      console.log('users lists here in redeucer');
      console.log(action.payload.users);

      return {
        ...state,
        members: action.payload.users,
      };
    }
    case 'projects': {
      console.log(action.payload.projects);

      return {
        ...state,
        projects: action.payload.projects,
      };
    }
    case 'tasks': {
      console.log(action.payload.tasks);

      return {
        ...state,
        tasks: action.payload.tasks,
      };
    }

    default:
      return state;
  }
};
