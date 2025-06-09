import { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FormContext = createContext();

const initialState = {
  forms: [],
  currentForm: {
    id: null,
    title: '',
    questions: [],
    isPublished: false,
    createdAt: null
  },
  responses: []
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_TITLE':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          title: action.payload
        }
      };

    case 'ADD_QUESTION':
      const newQuestion = {
        id: uuidv4(),
        type: action.payload.type,
        question: action.payload.question,
        options: action.payload.options || [],
        required: action.payload.required || false
      };
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          questions: [...state.currentForm.questions, newQuestion]
        }
      };

    case 'UPDATE_QUESTION':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          questions: state.currentForm.questions.map(q =>
            q.id === action.payload.id ? { ...q, ...action.payload.data } : q
          )
        }
      };

    case 'DELETE_QUESTION':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          questions: state.currentForm.questions.filter(q => q.id !== action.payload)
        }
      };

    case 'SAVE_FORM':
      const formToSave = {
        ...state.currentForm,
        id: state.currentForm.id || uuidv4(),
        createdAt: state.currentForm.createdAt || new Date().toISOString(),
        isPublished: true
      };
      
      const existingFormIndex = state.forms.findIndex(f => f.id === formToSave.id);
      const updatedForms = existingFormIndex >= 0 
        ? state.forms.map(f => f.id === formToSave.id ? formToSave : f)
        : [...state.forms, formToSave];

      return {
        ...state,
        forms: updatedForms,
        currentForm: {
          id: null,
          title: '',
          questions: [],
          isPublished: false,
          createdAt: null
        }
      };

    case 'LOAD_FORM':
      return {
        ...state,
        currentForm: action.payload
      };

    case 'RESET_CURRENT_FORM':
      return {
        ...state,
        currentForm: {
          id: null,
          title: '',
          questions: [],
          isPublished: false,
          createdAt: null
        }
      };

    case 'SUBMIT_RESPONSE':
      const newResponse = {
        id: uuidv4(),
        formId: action.payload.formId,
        email: action.payload.email,
        answers: action.payload.answers,
        submittedAt: new Date().toISOString()
      };
      return {
        ...state,
        responses: [...state.responses, newResponse]
      };

    case 'DELETE_FORM':
      return {
        ...state,
        forms: state.forms.filter(f => f.id !== action.payload),
        responses: state.responses.filter(r => r.formId !== action.payload)
      };

    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};